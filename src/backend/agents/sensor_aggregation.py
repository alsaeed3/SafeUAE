class SensorAggregator:
    @staticmethod
    async def process(data):
        return {
            "type": "sensor_agg",
            "status": determine_anomaly(data['value']),
            "location": data['location'],
            "timestamp": data['timestamp']
        }

def determine_anomaly(value):
    return "CRITICAL" if value > 85 else "WARNING" if value > 70 else "NORMAL"