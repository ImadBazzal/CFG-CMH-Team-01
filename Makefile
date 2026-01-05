.PHONY: build run

# Build docker images for frontend and backend
build:
	@echo "Building images..."
	docker-compose build

# Run the stack (builds first)
up:
	@echo "Starting services..."
	docker-compose up --build -d
	@echo "Services started. Backend: http://localhost:8000  Frontend: http://localhost:5173"