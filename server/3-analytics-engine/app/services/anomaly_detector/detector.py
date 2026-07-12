from typing import List, Dict
import pandas as pd
from app.models.schemas import AgentState, ProviderEnum

from .zscore_velocity import detect_zscore_velocity
from .cv_amount_clustering import detect_cv_clustering
from .isolation_forest import detect_isolation_forest

class AnomalyDetector:
    def __init__(self):
        pass

    def analyze(self, state: AgentState) -> List[Dict]:
        alerts_data = []
        if not state.recent_transactions:
            return alerts_data
            
        df = pd.DataFrame([t.model_dump() for t in state.recent_transactions])
        
        for provider in ProviderEnum:
            prov_df = df[df['provider'] == provider.value].copy()
            if prov_df.empty or len(prov_df) < 5:
                continue
                
            prov_alerts = []
            if len(prov_df) < 30:
                # Cold-start fallback: Use Z-score/CV logic
                prov_alerts.extend(detect_zscore_velocity(prov_df, provider))
                prov_alerts.extend(detect_cv_clustering(prov_df, provider))
                
                # Explicitly flag as LOW confidence due to cold-start
                for alert in prov_alerts:
                    alert["confidence_override"] = "Low Confidence"
            else:
                # Use IsolationForest ML Model
                prov_alerts.extend(detect_isolation_forest(prov_df, provider))

            alerts_data.extend(prov_alerts)

        return alerts_data
