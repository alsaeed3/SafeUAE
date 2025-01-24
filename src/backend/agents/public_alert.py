class PublicAlert:
    @staticmethod
    async def process(data):
        return {
            "type": "alert",
            "message": generate_alert_message(data),
            "priority": data['priority'],
            "channels": ["sms", "app"]
        }

def generate_alert_message(data):
    templates = {
        3: "EMERGENCY ALERT: {type} reported in your area. Avoid the vicinity.",
        2: "PUBLIC NOTICE: Incident reported in {location}. Exercise caution.",
        1: "INCIDENT REPORT: Minor event in {location}. No immediate danger."
    }
    return templates[data['priority']].format(**data)