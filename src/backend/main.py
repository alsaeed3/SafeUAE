from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import redis
import json
from agents import *

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
    # Add other agents...
    
    await ws.send_text(json.dumps(response))