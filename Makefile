.PHONY: help build up down logs shell db-shell test clean

help:
	@echo "MarketEdgePros - Available Commands:"
	@echo ""
	@echo "  make build      - Build Docker containers"
	@echo "  make up         - Start all services"
	@echo "  make down       - Stop all services"
	@echo "  make logs       - View logs"
	@echo "  make shell      - Open backend shell"
	@echo "  make db-shell   - Open PostgreSQL shell"
	@echo "  make db-migrate - Create database migration"
	@echo "  make db-upgrade - Run database migrations"
	@echo "  make test       - Run tests"
	@echo "  make clean      - Clean up containers and volumes"

build:
	docker-compose build

up:
	docker-compose up -d
	@echo "Services started! Backend: http://localhost:5000"

down:
	docker-compose down

logs:
	docker-compose logs -f

shell:
	docker-compose exec backend /bin/bash

db-shell:
	docker-compose exec postgres psql -U postgres -d proptradepro_dev

db-migrate:
	docker-compose exec backend flask db migrate -m "$(message)"

db-upgrade:
	docker-compose exec backend flask db upgrade

test:
	docker-compose exec backend pytest

clean:
	docker-compose down -v
	docker system prune -f

