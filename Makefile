# Define shell to use
SHELL := /bin/bash

COMPOSE := docker compose -f src/docker-compose.yml

default: up

# Start up services
up:
	$(COMPOSE) up --build

# Pause services
pause:
	$(COMPOSE) pause

# Restart services
restart:
	$(COMPOSE) restart

# Stop services
down:
	$(COMPOSE) down

# Stop services and remove volumes
down-v:
	$(COMPOSE) down -v

# Stop services, remove volumes and images
down-all:
	$(COMPOSE) down -v --rmi all

# Show logs
logs:
	$(COMPOSE) logs -f

# Show logs for a specific service (e.g., make logs-wordpress)
logs-%:
	$(COMPOSE) logs -f $*

# Access shell inside a container (e.g., make shell-wordpress)
shell-%:
	$(COMPOSE) exec $* /bin/sh

# Execute a command inside a running container (e.g., make exec service=wordpress cmd="ls")
exec:
	$(COMPOSE) exec $(service) $(cmd)

# Stop all running containers
stop:
	@containers=$$(docker ps -q); \
	if [ -n "$$containers" ]; then \
		docker stop $$containers; \
	else \
		echo "No containers to stop"; \
	fi

# Remove all images
rmi:
	@images=$$(docker images -aq); \
	if [ -n "$$images" ]; then \
		docker rmi -f $$images; \
	else \
		echo "No images to remove"; \
	fi

# Remove all volumes
rmv:
	@volumes=$$(docker volume ls -q); \
	if [ -n "$$volumes" ]; then \
		docker volume rm -f $$volumes; \
	else \
		echo "No volumes to remove"; \
	fi

# Remove all networks
rmn:
	@networks=$$(docker network ls --format '{{.Name}}' | grep -v 'bridge\|host\|none'); \
	if [ -n "$$networks" ]; then \
		docker network rm $$networks; \
	else \
		echo "No networks to remove"; \
	fi


# Remove all containers
rmc:
	@containers=$$(docker ps -aq); \
	if [ -n "$$containers" ]; then \
		docker rm -f $$containers; \
	else \
		echo "No containers to remove"; \
	fi

# Remove all images, volumes, networks and containers
clean: stop down-all rmn rmv rmc rmi

.PHONY: default up down down-v down-all restart logs logs-% shell-% exec rmi rmv rmn rmc clean