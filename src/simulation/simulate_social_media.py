import random
import asyncio
import websockets
import json

emergency_keywords = ['fire', 'accident', 'flood', 'emergency', 'help']

async def generate_social_media():
    async with websockets.connect('ws://localhost:8000/ws') as ws:
        while True:
            message = {
                "type": "incident",
                "text": f"{random.choice(['🚨', '⚠️'])} {random.choice(emergency_keywords)} "
                        f"at {random.choice(['Downtown', 'Marina', 'Business Bay'])}",
                "timestamp": int(time.time())
            }
            await ws.send(json.dumps(message))
            await asyncio.sleep(random.uniform(0.5, 2.0))

asyncio.get_event_loop().run_until_complete(generate_social_media())