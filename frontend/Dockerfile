# Frontend Dockerfile using Vite dev server (development friendly)
FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY frontend/package*.json /app/
RUN npm ci --silent

RUN npm i vite

# Copy the rest of the frontend files
COPY frontend /app

# Expose Vite dev port
ENV HOST=0.0.0.0
ENV PORT=5173
EXPOSE 5173

# Start vite in dev mode and listen on all interfaces.
# The --host flag is passed through npm to vite.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]