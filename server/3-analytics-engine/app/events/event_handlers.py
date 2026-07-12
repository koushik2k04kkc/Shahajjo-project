from app.models.schemas import AgentState
from app.services.engine import AnalyticsEngine

async def handle_agent_state_event(event_data: dict, engine: AnalyticsEngine):
    """
    Stretch Goal: Event Handler.
    Processes asynchronous AgentState events pulled from a queue (e.g. Redis).
    """
    try:
        # Parse raw dict into Pydantic model
        state = AgentState(**event_data)
        # Process the state
        result = engine.process_agent_state(state)
        # Forward result to alert routing system (e.g. back to another queue)
        # print(f"Processed async event for agent: {result.agent_id}")
        return result
    except Exception as e:
        print(f"Error handling event: {e}")
