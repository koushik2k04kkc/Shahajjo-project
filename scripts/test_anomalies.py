import requests
import json
from datetime import datetime, timedelta
import uuid

API_URL = "http://localhost:8000/api/v1/analyze"

def generate_base_state(agent_id, num_txns=0):
    state = {
        "agent_id": agent_id,
        "area": "dhaka_north",
        "shared_physical_cash": 100000,
        "provider_balances": [
            {
                "provider": "bkash",
                "balance": 50000,
                "last_updated": datetime.utcnow().isoformat()
            }
        ],
        "recent_transactions": []
    }
    return state

def run_scenario(name, state):
    print(f"\n{'='*50}")
    print(f"Running Scenario: {name}")
    print(f"Total Transactions Sent: {len(state['recent_transactions'])}")
    print(f"{'='*50}")
    
    try:
        response = requests.post(API_URL, json=state)
        response.raise_for_status()
        data = response.json()
        
        alerts = data.get("alerts", [])
        if not alerts:
            print("[OK] No anomalies detected (Normal).")
        else:
            print(f"[ALERT] {len(alerts)} Alert(s) Detected:")
            for idx, alert in enumerate(alerts, 1):
                print(f"\n  Alert #{idx}: {alert.get('alert_type', 'Unknown')} ({alert.get('risk_level', 'Unknown')} Risk)")
                print(f"  Confidence: {alert.get('confidence_level', '')}")
                print(f"  Evidence:   {alert.get('evidence', '')}")
                print(f"  Advice:     {alert.get('recommended_action', '')}")
    except Exception as e:
        print(f"Error calling API: {e}")
        if hasattr(e, 'response') and e.response:
            print(e.response.text)

# ---------------------------------------------------------
# Scenario 1: Normal Behavior (30 regular transactions)
# ---------------------------------------------------------
normal_state = generate_base_state("AGT-NORMAL")
base_time = datetime.utcnow() - timedelta(hours=10)

for i in range(30):
    normal_state["recent_transactions"].append({
        "transaction_id": str(uuid.uuid4()),
        "provider": "bkash",
        "agent_id": "AGT-NORMAL",
        "amount": 500.0 + (i * 10), # Slight variance
        "type": "cash_in" if i % 2 == 0 else "cash_out",
        "timestamp": (base_time + timedelta(minutes=i*20)).isoformat(), # Spaced out
        "account_id": f"ACC-{i}"
    })

run_scenario("Normal Agent (No anomalies expected)", normal_state)


# ---------------------------------------------------------
# Scenario 2: CV Clustering (5 identical transactions rapidly)
# ---------------------------------------------------------
cv_state = generate_base_state("AGT-CLUSTERING")
base_time = datetime.utcnow()

for i in range(6):
    cv_state["recent_transactions"].append({
        "transaction_id": str(uuid.uuid4()),
        "provider": "bkash",
        "agent_id": "AGT-CLUSTERING",
        "amount": 15000.0, # Exact same amount triggers CV collapse
        "type": "cash_out",
        "timestamp": (base_time + timedelta(seconds=i*30)).isoformat(),
        "account_id": f"ACC-{i}"
    })

run_scenario("Clustering Anomaly (CV/Z-Score fallback)", cv_state)


# ---------------------------------------------------------
# Scenario 3: Isolation Forest (35 txns, last 2 are massive spikes)
# ---------------------------------------------------------
ml_state = generate_base_state("AGT-ML-ATTACK")
base_time = datetime.utcnow() - timedelta(hours=5)

# 30 Normal transactions
for i in range(30):
    ml_state["recent_transactions"].append({
        "transaction_id": str(uuid.uuid4()),
        "provider": "bkash",
        "agent_id": "AGT-ML-ATTACK",
        "amount": 400.0 + (i * 5),
        "type": "cash_in",
        "timestamp": (base_time + timedelta(minutes=i*10)).isoformat(),
        "account_id": f"ACC-{i}"
    })

# 2 Highly anomalous transactions (massive amount, fast velocity)
for i in range(2):
    ml_state["recent_transactions"].append({
        "transaction_id": str(uuid.uuid4()),
        "provider": "bkash",
        "agent_id": "AGT-ML-ATTACK",
        "amount": 500000.0,
        "type": "cash_out",
        "timestamp": (base_time + timedelta(minutes=300, seconds=i*5)).isoformat(),
        "account_id": f"ACC-HACKER-{i}"
    })

run_scenario("Isolation Forest ML Anomaly", ml_state)
