import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import shap

def run_spike():
    # 1. Create dummy data (3 features: Amount, Velocity, Type)
    np.random.seed(42)
    # Normal data
    X_normal = pd.DataFrame({
        'amount': np.random.normal(500, 100, 100),
        'velocity': np.random.normal(5, 2, 100),
        'type_encoded': np.random.randint(0, 3, 100)
    })
    
    # Anomaly
    X_anomaly = pd.DataFrame({
        'amount': [50000],
        'velocity': [2],
        'type_encoded': [1]
    })
    
    X = pd.concat([X_normal, X_anomaly], ignore_index=True)
    
    # 2. Fit IsolationForest
    iso = IsolationForest(n_estimators=100, contamination=0.01, random_state=42)
    iso.fit(X)
    
    # 3. Predict anomaly scores
    # Negative scores are anomalies, positive are normal.
    scores = iso.decision_function(X)
    print("Scores range:", scores.min(), "to", scores.max())
    print("Anomaly score:", scores[-1]) # Should be negative
    
    # 4. Use SHAP TreeExplainer
    # TreeExplainer on IsolationForest gives path lengths (or anomaly scores).
    print("\nInitializing SHAP TreeExplainer...")
    explainer = shap.TreeExplainer(iso)
    
    # Get SHAP values for the anomaly
    shap_values = explainer.shap_values(X_anomaly)
    
    print("\nSHAP Values for anomaly:", shap_values)
    print("Features:", X.columns.tolist())
    
    # Determine the top contributing feature
    # For Isolation Forest, negative SHAP values push the score lower (towards anomaly).
    shap_df = pd.DataFrame(shap_values, columns=X.columns)
    contributions = shap_df.iloc[0].to_dict()
    print("\nFeature Contributions to Anomaly Score:")
    for feature, value in contributions.items():
        print(f"  {feature}: {value:.4f}")
        
    most_important = min(contributions, key=contributions.get)
    print(f"\nMost anomalous feature according to SHAP: {most_important}")

if __name__ == "__main__":
    run_spike()
