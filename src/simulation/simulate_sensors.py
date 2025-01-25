import random
import time
import websockets
import asyncio
import json

async def send_sensor_data():
    async with websockets.connect('ws://localhost:8000/ws') as ws:
        while True:
            data = {
                "type": "sensor",
                "sensor_id": random.randint(1000, 9999),
                "value": random.uniform(0, 100),
                "location": f"{random.uniform(24.3, 25.5):.4f}° N, {random.uniform(54.2, 56.1):.4f}° E"
            }
            await ws.send(json.dumps(data))
            await asyncio.sleep(0.1)  # High-frequency updates

asyncio.get_event_loop().run_until_complete(send_sensor_data())