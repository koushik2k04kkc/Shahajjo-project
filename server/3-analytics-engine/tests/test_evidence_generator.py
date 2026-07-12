import pytest
from app.services.evidence_generator.generator import EvidenceGenerator
from app.models.schemas import ConfidenceLevel, RiskLevel, ProviderEnum

def test_fallback_generation():
    generator = EvidenceGenerator()
    
    # Mock alert data
    raw_alert = {
        "type": "liquidity_emoney",
        "provider": ProviderEnum.NAGAD,
        "burn_rate": 0.25,
        "risk_level": RiskLevel.HIGH,
        "current_balance": 1000.0,
        "demand_1h": 250.0
    }
    
    # Force fallback by setting client to None (which it is by default if no key)
    generator.client = None
    
    result = generator.generate_alert_details(raw_alert, ConfidenceLevel.HIGH)
    
    assert "High liquidity pressure" in result["message_en"]
    assert "25.0%" in result["message_en"]
    assert result["evidence_details"] == raw_alert
