import pandas as pd
from app.models.schemas import RiskLevel
from app.core.config import settings

def detect_zscore_velocity(prov_df: pd.DataFrame, provider_value: str) -> list:
    alerts = []
    amounts = prov_df['amount']
    mean_amt = amounts.mean()
    std_amt = amounts.std()
    
    if std_amt > 0:
        prov_df['z_score'] = (amounts - mean_amt) / std_amt
        max_z = prov_df['z_score'].max()
        
        if max_z >= settings.Z_SCORE_MEDIUM:
            risk = RiskLevel.HIGH if max_z >= settings.Z_SCORE_HIGH else RiskLevel.MEDIUM
            anomalous_txs = prov_df[prov_df['z_score'] >= settings.Z_SCORE_MEDIUM]
            tx_ids = anomalous_txs['transaction_id'].tolist()
            
            alerts.append({
                "type": "anomaly_high_value",
                "provider": provider_value,
                "risk_level": risk,
                "evidence": f"Max Z-Score of {max_z:.2f} detected.",
                "evidence_details": {"transaction_ids": tx_ids, "z_scores": anomalous_txs['z_score'].tolist()}
            })
    return alerts
