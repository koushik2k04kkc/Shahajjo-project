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
        
        if max_z >= settings.Z_SCORE_HIGH:
            alerts.append({
                "type": "anomaly_high_value",
                "provider": provider_value,
                "risk_level": RiskLevel.HIGH,
                "evidence": f"Max Z-Score of {max_z:.2f} detected (High >={settings.Z_SCORE_HIGH})."
            })
        elif max_z >= settings.Z_SCORE_MEDIUM:
            alerts.append({
                "type": "anomaly_high_value",
                "provider": provider_value,
                "risk_level": RiskLevel.MEDIUM,
                "evidence": f"Max Z-Score of {max_z:.2f} detected (Medium >={settings.Z_SCORE_MEDIUM})."
            })
    return alerts
