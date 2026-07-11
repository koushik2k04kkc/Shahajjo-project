import json
from typing import Dict
from openai import OpenAI
from app.core.config import settings
from app.models.schemas import ConfidenceLevel

from .confidence_scoring import generate_fallback_evidence

class EvidenceGenerator:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    def generate_alert_details(self, raw_alert: Dict, confidence: ConfidenceLevel) -> Dict:
        if not self.client:
            return generate_fallback_evidence(raw_alert, confidence)

        prompt = self._build_prompt(raw_alert, confidence)
        
        try:
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a financial risk analyst assistant for a multi-provider mobile financial service agent network in Bangladesh. Your job is to translate statistical anomalies and liquidity burn rates into clear, advisory alerts. You MUST output ONLY raw valid JSON (without markdown backticks). Do not claim fraud, use careful language like 'unusual' or 'requires review'. Never recommend automatic blocking."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                response_format={ "type": "json_object" }
            )
            
            result = json.loads(response.choices[0].message.content)
            return {
                "message_en": result.get("message_en", "Alert generated."),
                "message_bn": result.get("message_bn", "সতর্কতা তৈরি হয়েছে।"),
                "message_banglish": result.get("message_banglish", "Alert toiri hoyeche."),
                "recommended_action": result.get("recommended_action", "Please review."),
                "evidence_details": result.get("evidence_details", raw_alert)
            }
        except Exception as e:
            print(f"OpenAI Generation Error: {e}")
            return generate_fallback_evidence(raw_alert, confidence)

    def _build_prompt(self, raw_alert: Dict, confidence: ConfidenceLevel) -> str:
        return f"""
        Analyze the following raw risk data and generate a JSON response.
        
        Data Quality Confidence: {confidence.value}
        Raw Alert Data: {json.dumps(raw_alert, default=str)}
        
        Required JSON structure:
        {{
            "message_en": "Clear English advisory message.",
            "message_bn": "Clear Bengali advisory message.",
            "message_banglish": "Clear Banglish advisory message.",
            "recommended_action": "Who should act and what they should do safely.",
            "evidence_details": {{"key": "value - explain the math simply"}}
        }}
        """
