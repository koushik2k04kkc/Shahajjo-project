import pandas as pd
from app.models.schemas import RiskLevel
from app.core.config import settings

def detect_cv_clustering(prov_df: pd.DataFrame, provider_value: str) -> list:
    alerts = []
    amounts = prov_df['amount']
    mean_amt = amounts.mean()
    std_amt = amounts.std()
    
    if mean_amt > 0 and std_amt is not None and not pd.isna(std_amt):
        cv = std_amt / mean_amt
        
        # Check for abnormally low variation (e.g. repeated same amounts)
        if cv < settings.CV_MODERATE:
            tx_ids = prov_df['transaction_id'].tolist()
            alerts.append({
                "type": "anomaly_clustering",
                "provider": provider_value,
                "risk_level": RiskLevel.MEDIUM if cv > 0.1 else RiskLevel.HIGH,
                "evidence": f"Unusually stable transaction amounts detected (CV={cv:.2f} < {settings.CV_MODERATE}). Possible repeated amounts.",
                "evidence_details": {"transaction_ids": tx_ids, "cv": cv}
            })
            
    return alerts
