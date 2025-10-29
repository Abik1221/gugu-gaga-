# syntax=docker/dockerfile:1
FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=on \
    PYTHONPATH=/app

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    ca-certificates \
    curl \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps first (better layer caching)
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project files
COPY app ./app
COPY alembic.ini ./alembic.ini
COPY alembic ./alembic
COPY README.md ./README.md
COPY docker/entrypoint.sh ./entrypoint.sh
COPY docker/wait_for_db.py ./wait_for_db.py

# Make entrypoint executable
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

# Default environment (override in docker-compose)
ENV ENVIRONMENT=production

ENTRYPOINT ["/app/entrypoint.sh"]
