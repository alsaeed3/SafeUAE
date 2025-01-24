class ResourceAllocator:
    resources = {
        'fire_units': 10,
        'ambulances': 15,
        'police_units': 20
    }

    @staticmethod
    async def process(data):
        return {
            "type": "allocation",
            "deployment": calculate_deployment(data['priority']),
            "resources_remaining": update_resources()
        }

def calculate_deployment(priority):
    return {
        3: {'fire_units': 4, 'ambulances': 2},
        2: {'police_units': 3, 'ambulances': 1},
        1: {'police_units': 1}
    }.get(priority, {})