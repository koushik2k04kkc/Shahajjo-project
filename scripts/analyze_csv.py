import csv
import sys
import requests
import json
from datetime import datetime
from collections import defaultdict

API_URL = "http://localhost:8000/api/v1/analyze"

def process_csv(input_csv, output_csv):
    agents = defaultdict(lambda: {
        "area": "dhaka",
        "shared_physical_cash": 50000,
        "provider_balances": {},
        "recent_transactions": []
    })

    print(f"Reading data from {input_csv}...")
    try:
        with open(input_csv, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                agent_id = row['agent_id']
                provider = row['provider']
                
                # Update provider balance if provided
                if row.get('current_balance'):
                    agents[agent_id]["provider_balances"][provider] = float(row['current_balance'])
                
                # Add transaction
                if row.get('amount') and float(row['amount']) > 0:
                    agents[agent_id]["recent_transactions"].append({
                        "transaction_id": row.get('transaction_id', f"txn-{len(agents[agent_id]['recent_transactions'])}"),
                        "provider": provider,
                        "agent_id": agent_id,
                        "amount": float(row['amount']),
                        "type": row['type'],
                        "timestamp": row['timestamp'],
                        "account_id": row.get('account_id', 'unknown')
                    })
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return

    # Prepare output
    fieldnames = ['scenario_agent', 'alert_type', 'risk_level', 'confidence', 'message_en', 'message_bn', 'recommended_action', 'evidence_details']
    
    print(f"Analyzing {len(agents)} scenarios via Analytics Engine...")
    
    with open(output_csv, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for agent_id, data in agents.items():
            print(f" -> Processing {agent_id}...")
            
            # Format provider balances for API
            provider_balances = [
                {"provider": k, "balance": v, "last_updated": datetime.utcnow().isoformat()}
                for k, v in data["provider_balances"].items()
            ]
            
            payload = {
                "agent_id": agent_id,
                "area": data["area"],
                "shared_physical_cash": data["shared_physical_cash"],
                "provider_balances": provider_balances,
                "recent_transactions": data["recent_transactions"]
            }
            
            try:
                res = requests.post(API_URL, json=payload)
                res.raise_for_status()
                analysis = res.json()
                
                alerts = analysis.get("alerts", [])
                if not alerts:
                    writer.writerow({
                        'scenario_agent': agent_id,
                        'alert_type': 'NONE',
                        'message_en': 'No anomalies or liquidity pressure detected.'
                    })
                
                for alert in alerts:
                    writer.writerow({
                        'scenario_agent': agent_id,
                        'alert_type': alert.get('alert_type'),
                        'risk_level': alert.get('risk_level'),
                        'confidence': alert.get('confidence_level'),
                        'message_en': alert.get('message_en'),
                        'message_bn': alert.get('message_bn'),
                        'recommended_action': alert.get('recommended_action'),
                        'evidence_details': json.dumps(alert.get('evidence_details', {}))
                    })
            except Exception as e:
                print(f"   Error analyzing {agent_id}: {e}")

    print(f"Done! Detailed outputs saved to {output_csv}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python analyze_csv.py <input.csv> <output.csv>")
        sys.exit(1)
    
    process_csv(sys.argv[1], sys.argv[2])
