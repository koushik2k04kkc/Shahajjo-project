import pytest
from datetime import datetime, timezone, timedelta
from app.services.liquidity_forecaster.forecaster import LiquidityForecaster
from app.models.schemas import AgentState, ProviderEnum, Transaction, TransactionType, ProviderBalance

def test_liquidity_forecaster_high_burn_rate():
    forecaster = LiquidityForecaster()
    now = datetime.now(timezone.utc)
    
    # Agent has low balance
    pb = ProviderBalance(
        provider=ProviderEnum.ROCKET,
        balance=1000.0,
        last_updated=now
    )
    
    # High cash-in demand (depletes agent's e-money)
    txs = []
    for i in range(3):
        txs.append(Transaction(
            transaction_id=f"tx_{i}",
            provider=ProviderEnum.ROCKET,
            agent_id="agent_1",
            amount=150.0,
            type=TransactionType.CASH_IN,
            timestamp=now - timedelta(minutes=5),
            account_id=f"acc_{i}"
        ))
        
    state = AgentState(
        agent_id="agent_1",
        area="Sylhet",
        shared_physical_cash=50000.0,
        provider_balances=[pb],
        recent_transactions=txs
    )
    
    # Total demand = 450. Balance = 1000. Burn rate = 45%.
    # 45% > 35% Critical threshold
    
    alerts = forecaster.analyze(state)
    assert len(alerts) > 0
    
    rocket_alert = next((a for a in alerts if a["provider"] == ProviderEnum.ROCKET), None)
    assert rocket_alert is not None
    assert rocket_alert["burn_rate"] == 0.45
    assert rocket_alert["risk_level"] == "Critical"
