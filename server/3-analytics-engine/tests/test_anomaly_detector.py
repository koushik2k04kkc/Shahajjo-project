import pytest
from datetime import datetime, timezone
from app.services.anomaly_detector.detector import AnomalyDetector
from app.models.schemas import AgentState, ProviderEnum, Transaction, TransactionType

def test_anomaly_detector_z_score():
    detector = AnomalyDetector()
    
    # Create 5 normal transactions of 500
    txs = []
    for i in range(5):
        txs.append(Transaction(
            transaction_id=f"tx_{i}",
            provider=ProviderEnum.BKASH,
            agent_id="agent_1",
            amount=500.0,
            type=TransactionType.CASH_OUT,
            timestamp=datetime.now(timezone.utc),
            account_id=f"acc_{i}"
        ))
        
    # Add one massive transaction
    txs.append(Transaction(
        transaction_id="tx_anomaly",
        provider=ProviderEnum.BKASH,
        agent_id="agent_1",
        amount=50000.0,
        type=TransactionType.CASH_OUT,
        timestamp=datetime.now(timezone.utc),
        account_id="acc_anomaly"
    ))
    
    state = AgentState(
        agent_id="agent_1",
        area="Dhaka",
        shared_physical_cash=100000.0,
        provider_balances=[],
        recent_transactions=txs
    )
    
    alerts = detector.analyze(state)
    assert len(alerts) > 0
    assert alerts[0]["type"] == "anomaly_high_value"
