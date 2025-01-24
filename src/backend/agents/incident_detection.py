class IncidentDetector:
    @staticmethod
    async def process(data):
        # Simulated NLP processing with fast inference
        return {
            "type": "incident",
            "priority": calculate_priority(data['text']),
            "location": extract_location(data['text'])
        }

def calculate_priority(text):
    # Simplified priority logic
    keywords = {'fire': 3, 'accident': 2, 'flood': 3}
    return max([keywords.get(word, 1) for word in text.lower().split()])

def extract_location(text):
    # Mock location extraction
    return "25.2048° N, 55.2708° E"  # Dubai coordinates