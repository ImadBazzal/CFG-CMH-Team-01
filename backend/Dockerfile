# Backend Dockerfile for FastAPI app
FROM python:3.11-slim

# Ensure apt packages for build if needed (keep minimal)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install python dependencies
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy application code
COPY backend /app

ENV PYTHONUNBUFFERED=1

# Expose port uvicorn uses
EXPOSE 8000

# Start uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]