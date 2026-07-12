from typing import Dict
from app.models.schemas import ConfidenceLevel

def generate_fallback_evidence(raw_alert: Dict, confidence: ConfidenceLevel) -> Dict:
    """Fallback rule-based generation if OpenAI fails or is not configured."""
    alert_type = raw_alert.get("type", "")
    
    if "liquidity" in alert_type:
        msg = f"High liquidity pressure detected. Burn rate is {raw_alert.get('burn_rate', 0)*100:.1f}%."
        bn = f"অতিরিক্ত তারল্য চাপ সনাক্ত হয়েছে। বার্ন রেট {raw_alert.get('burn_rate', 0)*100:.1f}%।"
        banglish = f"Oti-rikto liquidity pressure paowa geche. Burn rate {raw_alert.get('burn_rate', 0)*100:.1f}%."
        rec = "Agent should arrange more funds or contact field officer."
    else:
        msg = f"Unusual transaction pattern detected: {raw_alert.get('evidence', '')}"
        bn = "অস্বাভাবিক লেনদেনের ধরন সনাক্ত হয়েছে। পর্যালোচনা প্রয়োজন।"
        banglish = "Oshavabik transaction pattern dekha geche. Review kora dorkar."
        rec = "Risk team to review recent transactions for this provider."

    return {
        "message_en": msg,
        "message_bn": bn,
        "message_banglish": banglish,
        "recommended_action": rec,
        "evidence_details": raw_alert
    }
