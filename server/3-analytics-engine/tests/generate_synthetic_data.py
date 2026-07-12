import pandas as pd
import numpy as np
from datetime import datetime, timedelta, timezone
import uuid

np.random.seed(42)

def generate_synthetic_data():
    provider_id = "test-provider-1"
    account_ids = [str(uuid.uuid4()) for _ in range(5)]
    
    transactions = []
    
    # Base timestamp: 30 days ago
    start_time = datetime.now(timezone.utc) - timedelta(days=30)
    
    # 1. Steady-State Baseline (600 txs)
    # Distribute randomly over 30 days
    for _ in range(600):
        acc = np.random.choice(account_ids)
        amount = round(np.random.lognormal(mean=6.5, sigma=0.5), 2)
        random_seconds = np.random.randint(0, 30 * 24 * 3600)
        tx_time = start_time + timedelta(seconds=random_seconds)
        
        ttype = np.random.choice(['cash_in', 'cash_out'], p=[0.4, 0.6])
        
        transactions.append({
            'transaction_id': str(uuid.uuid4()),
            'provider': provider_id,
            'account_id': acc,
            'amount': amount,
            'timestamp': tx_time,
            'type': ttype,
            'anomaly_category': 'steady_state'
        })
        
    # 2. Normal-but-Busy Baseline (Pre-Eid Spike)
    # 50 txs concentrated in a 4-hour window on Day 15
    eid_start = start_time + timedelta(days=15)
    for _ in range(50):
        acc = np.random.choice(account_ids)
        amount = round(np.random.lognormal(mean=7.2, sigma=0.4), 2)
        tx_time = eid_start + timedelta(seconds=np.random.randint(0, 4 * 3600))
        
        transactions.append({
            'transaction_id': str(uuid.uuid4()),
            'provider': provider_id,
            'account_id': acc,
            'amount': amount,
            'timestamp': tx_time,
            'type': 'cash_out',
            'anomaly_category': 'pre_eid_spike'
        })
        
    # 3. Velocity Anomalies (10 txs)
    # Very rapid transactions on Day 2
    vel_start = start_time + timedelta(days=2)
    acc_vel = account_ids[0]
    for i in range(10):
        amount = round(np.random.lognormal(mean=6.5, sigma=0.5), 2)
        tx_time = vel_start + timedelta(seconds=i*2) # 2 seconds apart
        transactions.append({
            'transaction_id': str(uuid.uuid4()),
            'provider': provider_id,
            'account_id': acc_vel,
            'amount': amount,
            'timestamp': tx_time,
            'type': 'cash_out',
            'anomaly_category': 'velocity'
        })
        
    # 4. Amount Anomalies (5 txs)
    # Huge amounts scattered
    for i in range(5):
        acc = np.random.choice(account_ids)
        amount = round(np.random.uniform(20000, 35000), 2)
        tx_time = start_time + timedelta(days=i*5 + 1)
        transactions.append({
            'transaction_id': str(uuid.uuid4()),
            'provider': provider_id,
            'account_id': acc,
            'amount': amount,
            'timestamp': tx_time,
            'type': 'cash_out',
            'anomaly_category': 'amount'
        })
        
    # 5. Fixed-Amount Clustering (15 txs)
    # Identical amounts over a short window on Day 10
    cluster_start = start_time + timedelta(days=10)
    for i in range(15):
        acc = np.random.choice(account_ids[:3]) 
        amount = 4999.00
        tx_time = cluster_start + timedelta(seconds=i*30)
        transactions.append({
            'transaction_id': str(uuid.uuid4()),
            'provider': provider_id,
            'account_id': acc,
            'amount': amount,
            'timestamp': tx_time,
            'type': 'cash_in',
            'anomaly_category': 'clustering'
        })
        
    # 6. Multi-Dimensional Anomalies (8 txs)
    # Moderately high amount + moderately high velocity on Day 20
    multi_start = start_time + timedelta(days=20)
    acc_multi = account_ids[1]
    for i in range(8):
        amount = round(np.random.uniform(7000, 9000), 2)
        tx_time = multi_start + timedelta(seconds=i*15)
        transactions.append({
            'transaction_id': str(uuid.uuid4()),
            'provider': provider_id,
            'account_id': acc_multi,
            'amount': amount,
            'timestamp': tx_time,
            'type': 'cash_out',
            'anomaly_category': 'multi_dimensional'
        })
        
    df = pd.DataFrame(transactions)
    # Sort by timestamp globally
    df = df.sort_values(by="timestamp").reset_index(drop=True)
    
    # Save to CSV
    output_path = "tests/data/synthetic_validation_set.csv"
    df.to_csv(output_path, index=False)
    
    print(f"Generated {len(df)} synthetic transactions at {output_path}")
    
    counts = df['anomaly_category'].value_counts()
    print("Category Counts:\n", counts)
    
    assert counts.get('steady_state', 0) == 600, "Missing steady_state baseline"
    assert counts.get('pre_eid_spike', 0) == 50, "Missing pre_eid_spike baseline"
    assert counts.get('velocity', 0) == 10, "Missing velocity anomalies"
    assert counts.get('amount', 0) == 5, "Missing amount anomalies"
    assert counts.get('clustering', 0) == 15, "Missing clustering anomalies"
    assert counts.get('multi_dimensional', 0) == 8, "Missing multi_dimensional anomalies"
    print("All assertions passed. Dataset is structurally correct.")

if __name__ == "__main__":
    generate_synthetic_data()
