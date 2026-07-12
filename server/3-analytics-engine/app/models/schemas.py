from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
from enum import Enum

class ProviderEnum(str, Enum):
    BKASH = "bkash"
    NAGAD = "nagad"
    ROCKET = "rocket"

class TransactionType(str, Enum):
    CASH_IN = "cash_in"
    CASH_OUT = "cash_out"
    P2P = "p2p"
    MERCHANT_PAY = "merchant_pay"
    BUY_FLOAT = "buy_float"

class Transaction(BaseModel):
    transaction_id: str
    provider: ProviderEnum
    agent_id: str
    amount: float
    type: TransactionType
    timestamp: datetime
    account_id: str

class ProviderBalance(BaseModel):
    provider: ProviderEnum
    balance: float
    last_updated: datetime

class AgentState(BaseModel):
    agent_id: str
    area: str
    shared_physical_cash: float
    provider_balances: List[ProviderBalance]
    recent_transactions: List[Transaction]

class RiskLevel(str, Enum):
    NORMAL = "Normal"
    WARNING = "Warning"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class ConfidenceLevel(str, Enum):
    HIGH = "High Confidence"
    MEDIUM = "Medium Confidence"
    LOW = "Low Confidence"

class Alert(BaseModel):
    alert_id: str
    agent_id: str
    provider: Optional[ProviderEnum] = None
    alert_type: str # e.g., "Liquidity Pressure", "Unusual Activity"
    risk_level: RiskLevel
    message_en: str
    message_bn: str
    message_banglish: str
    recommended_action: str
    evidence_details: Dict
    confidence_level: ConfidenceLevel
    timestamp: datetime

class AnalysisResult(BaseModel):
    agent_id: str
    alerts: List[Alert]
    data_quality_score: float
    analysis_timestamp: datetime
