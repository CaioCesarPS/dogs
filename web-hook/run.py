import os
import subprocess

from fastapi import FastAPI, HTTPException, Request

app = FastAPI(title="Docker Compose Runner", version="1.0.0")


@app.get("/")
async def root():
    """Root endpoint to check if the API is running"""
    return {"message": "Docker Compose Runner API is running"}


@app.post("/docker/up")
async def docker_compose_up(request: Request):
    """Execute docker compose up -d --build command"""
    
    print("Received request:", await request.json())
    try:
        # Use the mounted parent directory where the main docker-compose.yml is located
        parent_dir = "/app/parent"
        
        # First, stop and remove existing containers to avoid name conflicts
        subprocess.run(
            ["docker", "compose", "down", "--remove-orphans"], 
            cwd=parent_dir,
            capture_output=True,
            text=True
        )
        
        # Also force remove containers by name in case they weren't managed by compose
        subprocess.run(
            ["docker", "rm", "-f", "frontend", "app"], 
            capture_output=True,
            text=True
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
            ["docker", "rm", "-f", "frontend", "app"], 
            capture_output=True,
            text=True
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
            ["docker", "ps", "-a", "--filter", "name=frontend", "--filter", "name=app", "--format", "table {{.Names}}\t{{.Status}}\t{{.Ports}}"],
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
