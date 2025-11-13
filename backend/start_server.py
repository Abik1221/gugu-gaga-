#!/usr/bin/env python3
"""
Development server startup script with proper configuration for large file uploads.
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        # Configure for large file uploads (50MB limit)
        limit_max_requests=50 * 1024 * 1024,  # 50MB
        timeout_keep_alive=30,
        access_log=True,
    )