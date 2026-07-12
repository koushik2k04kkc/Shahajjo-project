import csv
import sys
import json
import requests
from collections import defaultdict
from datetime import datetime

API_URL = "http://localhost:8000/api/v1/analyze"

def map_provider(pid):
    # Consistently map UUIDs to allowed enums
    hash_val = hash(pid) % 3
    if hash_val == 0: return "bkash"
    elif hash_val == 1: return "nagad"
    return "rocket"

def map_type(t):
    t = t.lower()
    if t == 'send_money': return 'p2p'
    if t == 'payment': return 'merchant_pay'
    if t == 'top_up': return 'cash_out'
    if t == 'bill_payment': return 'merchant_pay'
    if t == 'cash_in': return 'cash_in'
    if t == 'cash_out': return 'cash_out'
    return 'cash_out' # Default

def process(input_csv, output_json):
    agents = defaultdict(lambda: {
        "area": "dhaka",
        "shared_physical_cash": 100000,
        "provider_balances": {
            "bkash": 50000,
            "nagad": 50000,
            "rocket": 50000
        },
        "recent_transactions": []
    })

    print(f"Reading {input_csv}...")
    try:
        with open(input_csv, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                agent = row.get('agent_name', row.get('account_id', 'unknown_agent'))
                
                # Parse timestamp "2026-04-13 12:29:19" to ISO
                raw_time = row['time']
                try:
                    dt = datetime.strptime(raw_time, "%Y-%m-%d %H:%M:%S")
                    iso_time = dt.isoformat() + "Z"
                except:
                    iso_time = raw_time # fallback
                
                agents[agent]["recent_transactions"].append({
                    "transaction_id": row['transaction_id'],
                    "provider": map_provider(row['provider_id']),
                    "agent_id": agent,
                    "amount": float(row['amount_bdt']),
                    "type": map_type(row['type']),
                    "timestamp": iso_time,
                    "account_id": row.get('counterparty_account', 'unknown')
                })
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return

    results = []

    print(f"Sending {len(agents)} agents to Analytics Engine...")
    for agent_id, data in agents.items():
        # Build API payload
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
            out_data = res.json()
            results.append({
                "agent_id": agent_id,
                "request_payload_summary": f"{len(data['recent_transactions'])} txns",
                "analytics_response": out_data
            })
        except Exception as e:
            print(f"Error on {agent_id}: {e}")
            if hasattr(e, 'response') and e.response:
                print(e.response.text)

    print(f"Writing full JSON outputs to {output_json}...")
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print("Done!")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python process_transactions_csv.py <input.csv> <output.json>")
        sys.exit(1)
    
    process(sys.argv[1], sys.argv[2])
