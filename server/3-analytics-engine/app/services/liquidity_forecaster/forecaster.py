from typing import List, Dict
from datetime import datetime, timezone, timedelta
from app.models.schemas import AgentState, ProviderEnum, RiskLevel, TransactionType

from .burn_rate import calculate_burn_rate, get_risk_level
from .exponential_smoothing import apply_exponential_smoothing
import pandas as pd

class LiquidityForecaster:
    def __init__(self):
        pass

    def analyze(self, state: AgentState) -> List[Dict]:
        alerts_data = []
        now = datetime.now(timezone.utc)
        one_hour_ago = now - timedelta(hours=1)
        
        provider_vols = {p.value: {"cash_in": 0.0, "cash_out": 0.0} for p in ProviderEnum}
        
        # In a more advanced version, we'd use apply_exponential_smoothing on historical 
        # time-bucketed data. For MVP, we sum the recent hour.
        for tx in state.recent_transactions:
            try:
                tx_time = tx.timestamp.replace(tzinfo=timezone.utc)
            except:
                tx_time = tx.timestamp
                
            if tx_time >= one_hour_ago:
                if tx.type == TransactionType.CASH_IN:
                    provider_vols[tx.provider.value]["cash_in"] += tx.amount
                elif tx.type == TransactionType.CASH_OUT:
                    provider_vols[tx.provider.value]["cash_out"] += tx.amount

        # Check e-money liquidity (pressure from cash-ins)
        for pb in state.provider_balances:
            prov = pb.provider.value
            emoney_demand = provider_vols[prov]["cash_in"]
            burn_rate = calculate_burn_rate(pb.balance, emoney_demand)
            risk = get_risk_level(burn_rate)
            
            if risk in [RiskLevel.WARNING, RiskLevel.HIGH, RiskLevel.CRITICAL]:
                alerts_data.append({
                    "type": "liquidity_emoney",
                    "provider": pb.provider,
                    "burn_rate": burn_rate,
                    "risk_level": risk,
                    "current_balance": pb.balance,
                    "demand_1h": emoney_demand
                })

        # Check physical cash liquidity
        total_cash_out = sum(v["cash_out"] for v in provider_vols.values())
        physical_burn_rate = calculate_burn_rate(state.shared_physical_cash, total_cash_out)
        physical_risk = get_risk_level(physical_burn_rate)
        
        if physical_risk in [RiskLevel.WARNING, RiskLevel.HIGH, RiskLevel.CRITICAL]:
            alerts_data.append({
                "type": "liquidity_physical_cash",
                "provider": None,
                "burn_rate": physical_burn_rate,
                "risk_level": physical_risk,
                "current_balance": state.shared_physical_cash,
                "demand_1h": total_cash_out
            })

        return alerts_data
