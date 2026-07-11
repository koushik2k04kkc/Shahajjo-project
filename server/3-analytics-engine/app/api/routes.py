from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import AgentState, AnalysisResult
from app.services.engine import AnalyticsEngine

router = APIRouter()

# Dependency to get a fresh instance of the engine per request
def get_engine():
    return AnalyticsEngine()

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_agent_state(state: AgentState, engine: AnalyticsEngine = Depends(get_engine)):
    """
    Receives an AgentState (balances, recent transactions) from the API Gateway,
    processes it through the Analytics Engine, and returns generated alerts.
    """
    try:
        result = engine.process_agent_state(state)
        return result
    except Exception as e:
        # In a real system, log the exception
        raise HTTPException(status_code=500, detail=f"Analytics processing failed: {str(e)}")
