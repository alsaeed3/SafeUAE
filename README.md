# SafeUAE - Real-Time Public Safety Coordination System

SafeUAE is a project meant to be as a contribution to SambaNova Hackathon by mr. Pastifier, mr. Martin Lumibao, and I from 42 Abu Dhabi.

## Overview
AI-powered emergency response system using multiple collaborating agents for:
- Incident detection from social media
- Sensor data analysis
- Predictive modeling
- Resource allocation
- Public alerts

## Architecture
![System Architecture](docs/architecture.png)

## Key Features
- Real-time WebSocket communication
- Redis-based message brokering
- Priority-based alert system
- Simulated sensor/social data streams
- React dashboard for monitoring

## Running the System
```bash
# Start core services
make

# Shutdown the containers
make down

# Full Clean
make clean

# In separate terminals:
python simulation/simulate_sensors.py
python simulation/simulate_social_media.py

# Access dashboard at:
http://localhost:3000
