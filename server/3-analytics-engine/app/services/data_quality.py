from datetime import datetime, timezone
from app.models.schemas import AgentState, ConfidenceLevel
from app.core.config import settings

class DataQualityMonitor:
    def __init__(self):
        pass
        
    def evaluate(self, state: AgentState) -> float:
        """
        Evaluates data quality based on the recency of provider balances
        and returns a confidence score between 0.0 and 1.0.
        """
        if not state.provider_balances:
            return 0.0
            
        now = datetime.now(timezone.utc)
        scores = []
        
        for pb in state.provider_balances:
            # Assume pb.last_updated is timezone aware. If not, this needs adjustment.
            # Convert to UTC if necessary, but we'll assume standard UTC input for the prototype.
            try:
                time_diff = (now - pb.last_updated.replace(tzinfo=timezone.utc)).total_seconds()
            except Exception:
                time_diff = (now - pb.last_updated).total_seconds()
                
            # If data is less than 1 min old, score 1.0
            # If data is 5 mins old, score ~0.8
            # If data is 15+ mins old, score drops significantly
            if time_diff < 60:
                scores.append(1.0)
            elif time_diff < 300:
                scores.append(0.85)
            elif time_diff < 900:
                scores.append(0.60)
            else:
                scores.append(0.30)
                
        # Average confidence across all providers
        avg_score = sum(scores) / len(scores) if scores else 0.0
        return round(avg_score, 2)

    def get_confidence_level(self, score: float) -> ConfidenceLevel:
        if score >= settings.CONFIDENCE_HIGH:
            return ConfidenceLevel.HIGH
        elif score >= settings.CONFIDENCE_MEDIUM:
            return ConfidenceLevel.MEDIUM
        return ConfidenceLevel.LOW
