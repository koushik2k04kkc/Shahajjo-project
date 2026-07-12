import pandas as pd
import numpy as np
from datetime import datetime, timedelta, timezone
from app.services.anomaly_detector.detector import AnomalyDetector
from app.models.schemas import AgentState, ProviderEnum, Transaction, TransactionType

def generate_synthetic_data(num_normal=1000, num_eid=200, num_oversized=20, num_velocity=50, num_clustering=50):
    txs = []
    labels = []  # True if anomaly, False if normal
    types = []   # Label types for breakdown
    
    start_time = datetime.now(timezone.utc) - timedelta(days=30)
    
    # 1. Normal transactions
    for i in range(num_normal):
        txs.append(Transaction(
            transaction_id=f"tx_norm_{i}",
            provider=ProviderEnum.BKASH,
            agent_id="agent_1",
            amount=max(50.0, np.random.normal(500, 150)),
            type=TransactionType.CASH_OUT,
            timestamp=start_time + timedelta(minutes=i*30),
            account_id=f"acc_{i}"
        ))
        labels.append(False)
        types.append("normal")
        
    # 2. Eid-spike transactions (normal behavior during festivals, high amounts)
    # We want to see how often these trigger False Positives.
    for i in range(num_eid):
        txs.append(Transaction(
            transaction_id=f"tx_eid_{i}",
            provider=ProviderEnum.BKASH,
            agent_id="agent_1",
            amount=max(500.0, np.random.normal(3500, 500)),
            type=TransactionType.CASH_OUT,
            timestamp=start_time + timedelta(days=15, minutes=i*5), # clustered in time but not an anomaly intrinsically
            account_id=f"acc_eid_{i}"
        ))
        labels.append(False)
        types.append("eid_spike")
        
    # 3. Oversized anomalies
    for i in range(num_oversized):
        txs.append(Transaction(
            transaction_id=f"tx_over_{i}",
            provider=ProviderEnum.BKASH,
            agent_id="agent_1",
            amount=np.random.uniform(50000, 100000),
            type=TransactionType.CASH_OUT,
            timestamp=start_time + timedelta(days=np.random.randint(1, 30), minutes=i),
            account_id=f"acc_over_{i}"
        ))
        labels.append(True)
        types.append("oversized")
        
    # 4. Velocity anomalies (burst of small transactions)
    velocity_start = start_time + timedelta(days=20)
    for i in range(num_velocity):
        txs.append(Transaction(
            transaction_id=f"tx_vel_{i}",
            provider=ProviderEnum.BKASH,
            agent_id="agent_1",
            amount=np.random.uniform(100, 300),
            type=TransactionType.CASH_OUT,
            timestamp=velocity_start + timedelta(seconds=i*10), # 10 seconds apart!
            account_id=f"acc_vel_{i}"
        ))
        labels.append(True)
        types.append("velocity")
        
    # 5. Clustering anomalies (exact same amount repeated)
    clustering_start = start_time + timedelta(days=25)
    for i in range(num_clustering):
        txs.append(Transaction(
            transaction_id=f"tx_clus_{i}",
            provider=ProviderEnum.BKASH,
            agent_id="agent_1",
            amount=999.0, # exact same amount
            type=TransactionType.CASH_OUT,
            timestamp=clustering_start + timedelta(minutes=i*2),
            account_id=f"acc_clus_{i}"
        ))
        labels.append(True)
        types.append("clustering")
        
    return txs, labels, types

def evaluate():
    print("Generating synthetic validation dataset...")
    txs, true_labels, true_types = generate_synthetic_data()
    
    # Randomize order to simulate realistic stream (though detector sorts by time usually, it's fine)
    state = AgentState(
        agent_id="agent_1",
        area="Dhaka",
        shared_physical_cash=100000.0,
        provider_balances=[],
        recent_transactions=txs
    )
    
    detector = AnomalyDetector()
    alerts = detector.analyze(state)
    
    print(f"Generated {len(alerts)} alerts.")
    if len(alerts) > 0:
        print("First alert:", alerts[0])
    
    predicted_anomalous_tx_ids = set()
    # The detector might return multiple alerts, each alert might have evidence_details['transactions'] or something.
    # Let's see what detector returns. Z-score returns alerts per transaction for oversized. 
    # Velocity and clustering might return alerts for a group.
    
    predicted_anomalous_tx_ids = set()
    for alert in alerts:
        if 'evidence_details' in alert and 'transaction_id' in alert['evidence_details']:
            predicted_anomalous_tx_ids.add(alert['evidence_details']['transaction_id'])
        elif 'evidence_details' in alert and 'transaction_ids' in alert['evidence_details']:
            for tid in alert['evidence_details']['transaction_ids']:
                predicted_anomalous_tx_ids.add(tid)
                
    # Calculate metrics
    results = {
        "normal": {"TP": 0, "FP": 0, "TN": 0, "FN": 0},
        "eid_spike": {"TP": 0, "FP": 0, "TN": 0, "FN": 0},
        "oversized": {"TP": 0, "FP": 0, "TN": 0, "FN": 0},
        "velocity": {"TP": 0, "FP": 0, "TN": 0, "FN": 0},
        "clustering": {"TP": 0, "FP": 0, "TN": 0, "FN": 0}
    }
    
    for tx, is_anomaly, t_type in zip(txs, true_labels, true_types):
        predicted_anomaly = tx.transaction_id in predicted_anomalous_tx_ids
        
        if is_anomaly:
            if predicted_anomaly:
                results[t_type]["TP"] += 1
            else:
                results[t_type]["FN"] += 1
        else:
            if predicted_anomaly:
                results[t_type]["FP"] += 1
            else:
                results[t_type]["TN"] += 1
                
    print("\n--- Validation Results (Z-Score & CV Logic) ---")
    
    total_tp = sum(r["TP"] for r in results.values())
    total_fp = sum(r["FP"] for r in results.values())
    total_fn = sum(r["FN"] for r in results.values())
    
    precision = total_tp / (total_tp + total_fp) if (total_tp + total_fp) > 0 else 0
    recall = total_tp / (total_tp + total_fn) if (total_tp + total_fn) > 0 else 0
    
    print(f"Overall Precision: {precision:.2f}")
    print(f"Overall Recall:    {recall:.2f}")
    print("\nBreakdown by Type:")
    
    for t_type, r in results.items():
        total = r["TP"] + r["FP"] + r["TN"] + r["FN"]
        if r["TP"] + r["FN"] > 0: # True Anomaly class
            rec = r["TP"] / (r["TP"] + r["FN"])
            print(f"  {t_type.ljust(15)}: Recall = {rec:.2f} ({r['TP']}/{r['TP']+r['FN']})")
        else: # Normal class
            fpr = r["FP"] / (r["FP"] + r["TN"])
            print(f"  {t_type.ljust(15)}: FPR    = {fpr:.2f} ({r['FP']}/{r['FP']+r['TN']})")

if __name__ == "__main__":
    evaluate()
