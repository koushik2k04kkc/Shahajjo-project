from typing import List, Dict
import pandas as pd
from app.models.schemas import AgentState, ProviderEnum

from .zscore_velocity import detect_zscore_velocity
from .cv_amount_clustering import detect_cv_clustering

class AnomalyDetector:
    def __init__(self):
        pass

    def analyze(self, state: AgentState) -> List[Dict]:
        alerts_data = []
        if not state.recent_transactions:
            return alerts_data
            
        df = pd.DataFrame([t.dict() for t in state.recent_transactions])
        
        for provider in ProviderEnum:
            prov_df = df[df['provider'] == provider.value].copy()
            if prov_df.empty or len(prov_df) < 5:
                continue
                
            alerts_data.extend(detect_zscore_velocity(prov_df, provider))
            alerts_data.extend(detect_cv_clustering(prov_df, provider))

        return alerts_data
