from app.core.config import settings
from app.models.schemas import RiskLevel

def calculate_burn_rate(current_balance: float, cash_out_volume: float) -> float:
    if current_balance <= 0:
        return 1.0 # 100% burn rate if empty
    return min(cash_out_volume / current_balance, 1.0)

def get_risk_level(burn_rate: float) -> RiskLevel:
    if burn_rate >= settings.BURN_RATE_CRITICAL:
        return RiskLevel.CRITICAL
    elif burn_rate >= settings.BURN_RATE_HIGH:
        return RiskLevel.HIGH
    elif burn_rate >= settings.BURN_RATE_WARNING:
        return RiskLevel.WARNING
    return RiskLevel.NORMAL
