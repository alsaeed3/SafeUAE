from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import redis
import json
from agents.incident_detection import IncidentDetector
from agents.prediction_agent import PredictionAgent
from agents.public_alert import PublicAlert
from agents.resource_allocation import ResourceAllocator
from agents.sensor_aggregation import SensorAggregator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

r = redis.Redis(host='redis', port=6379, db=0)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        # Route messages to appropriate agents
        await handle_message(json.loads(data), websocket)

async def handle_message(data, ws):
    agent_type = data.get('type')
    if agent_type == 'incident':
        response = await IncidentDetector.process(data)
    elif agent_type == 'sensor':
        response = await SensorAggregator.process(data)
    elif agent_type == 'prediction':
        response = await PredictionAgent.process(data)
    elif agent_type == 'public':
        response = await PublicAlert.process(data)
    elif agent_type == 'resource':
        response = await ResourceAllocator.process(data)
    else:
        response = {"error": "Unknown data type"}
    
    await ws.send_text(json.dumps(response))