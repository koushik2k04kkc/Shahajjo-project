import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import shap
from app.models.schemas import RiskLevel

def detect_isolation_forest(prov_df: pd.DataFrame, provider_value: str) -> list:
    alerts = []
    
    # Sort by timestamp to calculate velocity
    df = prov_df.sort_values(by="timestamp").copy()
    
    # 1. Feature Engineering
    # Amount and Z-score
    amounts = df['amount'].values
    mean_amt = df['amount'].mean()
    std_amt = df['amount'].std()
    if std_amt > 0:
        df['z_score'] = (df['amount'] - mean_amt) / std_amt
    else:
        df['z_score'] = 0.0
    # Velocity (seconds since previous transaction)
    df['time_diff'] = df['timestamp'].diff().dt.total_seconds()
    # For the first transaction, assume it's normal (e.g. 1 hour)
    df['time_diff'] = df['time_diff'].fillna(3600)
    velocities = df['time_diff'].values
    
    # Type Encoding
    type_mapping = {"cash_in": 1, "cash_out": 0}
    df['type_encoded'] = df['type'].map(type_mapping).fillna(0)
    types = df['type_encoded'].values
    
    X = pd.DataFrame({
        'amount': amounts,
        'velocity': velocities,
        'type_encoded': types
    })
    
    # 2. Train Isolation Forest
    # We use contamination='auto' but since we might have many normal, we can use a small fixed one or auto.
    # The user recommended 0.05 or 'auto'. Let's use contamination=0.05 to ensure we flag top 5%.
    # Wait, the user specifically mentioned: "contamination='auto' will produce unstable... fall back to Z-score".
    # Since we enforce min 30 txns, contamination='auto' is safer.
    iso = IsolationForest(n_estimators=100, contamination='auto', random_state=42)
    iso.fit(X)
    
    # 3. Predict anomaly scores
    # Negative values are anomalies
    scores = iso.decision_function(X)
    predictions = iso.predict(X) # -1 for anomaly, 1 for normal
    
    df['anomaly_score'] = scores
    df['is_anomaly'] = predictions == -1
    
    anomalous_df = df[df['is_anomaly']]
    
    if anomalous_df.empty:
        return alerts
        
    # 4. SHAP Explanations
    from app.services.evidence_generator.shap_explainer import ShapExplainer
    
    shap_explainer = ShapExplainer(iso)
    X_anomalous = X[df['is_anomaly'].values]
    explanations = shap_explainer.explain(X_anomalous)
    
    for i, (idx, row) in enumerate(anomalous_df.iterrows()):
        contributions = explanations[i]
        
        # Most negative SHAP value is the strongest push towards anomaly
        most_important = min(contributions, key=contributions.get)
        
        # Map feature name to readable string
        feature_names = {
            'amount': 'Unusual Amount',
            'velocity': 'High Velocity (rapid succession)',
            'type_encoded': 'Unusual Transaction Type'
        }
        
        reason = feature_names.get(most_important, "Complex interaction of features")
        
        alerts.append({
            "type": "anomaly_multidimensional",
            "provider": provider_value,
            "risk_level": RiskLevel.HIGH, # IF flagged it
            "evidence": f"Multi-dimensional anomaly detected via Isolation Forest. Primary driver: {reason}. (Score: {row['anomaly_score']:.2f})",
            "evidence_details": {
                "transaction_ids": [row['transaction_id']],
                "anomaly_score": float(row['anomaly_score']),
                "shap_contributions": contributions,
                "amount": float(row['amount']),
                "z_score": float(row['z_score']),
                "velocity_seconds": float(row['time_diff'])
            },
            "confidence_override": "High Confidence" # ML Model is high confidence
        })
        
    return alerts
