import os
import subprocess

from fastapi import FastAPI, HTTPException

app = FastAPI(title="Docker Compose Runner", version="1.0.0")


@app.get("/")
async def root():
    """Root endpoint to check if the API is running"""
    return {"message": "Docker Compose Runner API is running"}


@app.post("/docker/up")
async def docker_compose_up():
    """Execute docker compose up -d --build command"""
    try:
        # Execute the docker compose command
        result = subprocess.run(
            ["docker", "compose", "up", "-d", "--build", "frontend", "app"],
            cwd=os.getcwd(),  # Run in current directory
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


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
