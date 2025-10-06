import os
import subprocess

from fastapi import FastAPI, HTTPException, Request

app = FastAPI(title="Docker Compose Runner", version="1.0.0")


def setup_git_auth():
    """Setup Git authentication using environment variables"""
    git_username = os.getenv('GIT_USERNAME')
    git_token = os.getenv('GIT_TOKEN')
    git_email = os.getenv('GIT_EMAIL')
    
    if git_username and git_token:
        print(f"Setting up Git authentication for user: {git_username}")
        
        # Configure Git credentials
        subprocess.run(
            ["git", "config", "--global", "user.name", git_username],
            capture_output=True, text=True
        )
        
        if git_email:
            subprocess.run(
                ["git", "config", "--global", "user.email", git_email],
                capture_output=True, text=True
            )
        
        return git_username, git_token
    
    return None, None


def get_authenticated_url(url, username, token):
    """Convert a GitHub HTTPS URL to include authentication"""
    if username and token and url.startswith("https://github.com/"):
        # Format: https://username:token@github.com/owner/repo.git
        return url.replace("https://github.com/", f"https://{username}:{token}@github.com/")
    return url


@app.get("/")
async def root():
    """Root endpoint to check if the API is running"""
    return {"message": "Docker Compose Runner API is running"}


@app.post("/docker/up")
async def docker_compose_up(request: Request):
    """Execute docker compose up -d --build command"""

    try:
        # Use the mounted parent directory where the main docker-compose.yml is located
        parent_dir = "/app/parent"

        # First, stop and remove existing containers to avoid name conflicts
        subprocess.run(
            ["docker", "compose", "down", "--remove-orphans"],
            cwd=parent_dir,
            capture_output=True,
            text=True,
        )

        # Execute git pull after docker compose down
        print("Executing git pull...")
        
        # Setup Git authentication if credentials are provided
        git_username, git_token = setup_git_auth()
        
        git_result = subprocess.run(
            ["git", "pull"],
            cwd=parent_dir,
            capture_output=True,
            text=True,
        )
        
        # If git pull fails, try to fix common issues and retry
        if git_result.returncode != 0:
            error_message = git_result.stderr.lower()
            
            # Handle safe.directory issue
            if "safe.directory" in error_message:
                print("Git safe.directory issue detected, configuring and retrying...")
                subprocess.run(
                    ["git", "config", "--global", "--add", "safe.directory", parent_dir],
                    capture_output=True,
                    text=True,
                )
                # Retry git pull
                git_result = subprocess.run(
                    ["git", "pull"],
                    cwd=parent_dir,
                    capture_output=True,
                    text=True,
                )
            
            # Handle SSH host key verification issue or permission denied
            elif "host key verification failed" in error_message or "permission denied (publickey)" in error_message:
                if "permission denied (publickey)" in error_message:
                    print("SSH permission denied, converting Git to use HTTPS...")
                else:
                    print("SSH host key verification failed, configuring Git to use HTTPS...")
                
                # Try to get the current remote URL
                remote_result = subprocess.run(
                    ["git", "remote", "get-url", "origin"],
                    cwd=parent_dir,
                    capture_output=True,
                    text=True,
                )
                
                if remote_result.returncode == 0:
                    current_url = remote_result.stdout.strip()
                    print(f"Current remote URL: {current_url}")
                    
                    # Convert SSH URL to HTTPS if needed
                    if current_url.startswith("git@github.com:"):
                        https_url = current_url.replace("git@github.com:", "https://github.com/")
                        
                        # Add authentication if credentials are available
                        if git_username and git_token:
                            https_url = get_authenticated_url(https_url, git_username, git_token)
                            print(f"Converting to authenticated HTTPS URL: https://github.com/{current_url.split(':')[1]}")
                        else:
                            print(f"Converting to HTTPS URL: {https_url}")
                            print("⚠️  No Git credentials provided - this will only work for public repositories")
                        
                        # Set the remote URL to HTTPS
                        subprocess.run(
                            ["git", "remote", "set-url", "origin", https_url],
                            cwd=parent_dir,
                            capture_output=True,
                            text=True,
                        )
                        
                        # Retry git pull with HTTPS
                        git_result = subprocess.run(
                            ["git", "pull"],
                            cwd=parent_dir,
                            capture_output=True,
                            text=True,
                        )
                    else:
                        # If it's not a GitHub SSH URL, try to configure SSH to skip host key verification
                        print("Configuring SSH to skip host key verification...")
                        subprocess.run(
                            ["git", "config", "--global", "core.sshCommand", "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"],
                            capture_output=True,
                            text=True,
                        )
                        
                        # Retry git pull
                        git_result = subprocess.run(
                            ["git", "pull"],
                            cwd=parent_dir,
                            capture_output=True,
                            text=True,
                        )
        
        if git_result.returncode == 0:
            print(f"Git pull executed successfully: {git_result.stdout}")
        else:
            error_msg = git_result.stderr.lower()
            print(f"Git pull failed (return code {git_result.returncode}): {git_result.stderr}")
            
            # Provide helpful error messages
            if "authentication failed" in error_msg or "could not read username" in error_msg:
                print("💡 Authentication failed. For private repositories:")
                print("   1. Set GIT_USERNAME and GIT_TOKEN environment variables")
                print("   2. Generate a Personal Access Token at: https://github.com/settings/tokens")
                print("   3. Make sure the token has 'repo' permissions")
            elif "repository not found" in error_msg or "not found" in error_msg:
                print("💡 Repository not found. Check if:")
                print("   1. The repository URL is correct")
                print("   2. You have access to the repository")
                print("   3. The repository is not private (or provide credentials)")
            
            # Continue with docker compose even if git pull fails

        # Also force remove containers by name in case they weren't managed by compose
        subprocess.run(
            ["docker", "rm", "-f", "frontend", "app"], capture_output=True, text=True
        )

        # Execute the docker compose command
        result = subprocess.run(
            ["docker", "compose", "up", "-d", "--build", "frontend", "app"],
            cwd=parent_dir,  # Run in parent directory (where main docker-compose.yml is)
            capture_output=True,
            text=True,
            timeout=300,  # 5 minutes timeout
        )

        if result.returncode == 0:
            return {
                "status": "success",
                "message": "Docker compose up executed successfully",
                "stdout": result.stdout,
                "stderr": result.stderr,
            }
        else:
            raise HTTPException(
                status_code=500,
                detail={
                    "status": "error",
                    "message": "Docker compose up failed",
                    "stdout": result.stdout,
                    "stderr": result.stderr,
                    "return_code": result.returncode,
                },
            )

    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=408,
            detail={
                "status": "error",
                "message": "Docker compose up command timed out",
            },
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"status": "error", "message": f"An error occurred: {str(e)}"},
        )


@app.post("/docker/down")
async def docker_compose_down():
    """Execute docker compose down to stop and remove containers"""
    try:
        parent_dir = "/app/parent"

        # Stop and remove containers
        result = subprocess.run(
            ["docker", "compose", "down", "--remove-orphans"],
            cwd=parent_dir,
            capture_output=True,
            text=True,
            timeout=60,
        )

        # Also force remove containers by name
        subprocess.run(
            ["docker", "rm", "-f", "frontend", "app"], capture_output=True, text=True
        )

        return {
            "status": "success",
            "message": "Docker compose down executed successfully",
            "stdout": result.stdout,
            "stderr": result.stderr,
        }

    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=408,
            detail={
                "status": "error",
                "message": "Docker compose down command timed out",
            },
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"status": "error", "message": f"An error occurred: {str(e)}"},
        )


@app.get("/docker/status")
async def docker_status():
    """Check the status of Docker containers"""
    try:
        # Check if containers exist
        result = subprocess.run(
            [
                "docker",
                "ps",
                "-a",
                "--filter",
                "name=frontend",
                "--filter",
                "name=app",
                "--format",
                "table {{.Names}}\t{{.Status}}\t{{.Ports}}",
            ],
            capture_output=True,
            text=True,
            timeout=30,
        )

        return {
            "status": "success",
            "message": "Docker status retrieved successfully",
            "containers": result.stdout,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"status": "error", "message": f"An error occurred: {str(e)}"},
        )


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
