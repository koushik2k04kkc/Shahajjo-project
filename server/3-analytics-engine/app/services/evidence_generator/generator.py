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
                    {"role": "system", "content": "You are a financial risk analyst assistant for a multi-provider mobile financial service agent network in Bangladesh. Your job is to translate statistical anomalies and liquidity burn rates into clear, advisory alerts. You MUST output ONLY raw valid JSON (without markdown backticks). Do not claim fraud, use careful language like 'unusual' or 'requires review'. Never recommend automatic blocking.\n\nCRITICAL FORMAT REQUIREMENTS:\n1. For liquidity alerts, explicitly predict the TIME when cash will run out based on the burn rate, and the exact AMOUNT of shortage.\n2. For anomaly alerts, mention the nature of the anomaly (e.g. repeated amounts, rapid succession), possible normal reasons (e.g. Eid-spike), and recommend human review.\n3. Keep the tone identical to these examples:\n- Example A (Liquidity): বর্তমান লেনদেনের ধারা অনুযায়ী বিকেল ৫টা ২০ মিনিটের মধ্যে আপনার নগদ টাকা শেষ হয়ে যেতে পারে। সবচেয়ে বেশি চাপ আসছে বিকাশ ক্যাশ-আউট থেকে। নিরাপদে সেবা চালু রাখতে কমপক্ষে ২০,০০০ টাকা অতিরিক্ত নগদ ব্যবস্থা করার পরামর্শ দেওয়া হচ্ছে।\n- Example B (Anomaly): গত ১২ মিনিটে স্বাভাবিকের তুলনায় অনেক বেশি ক্যাশ-আউট হয়েছে। কয়েকটি লেনদেনের পরিমাণ প্রায় একই এবং অল্প কয়েকটি অ্যাকাউন্ট থেকে বারবার অনুরোধ এসেছে। এটি ঈদ-পূর্ব স্বাভাবিক চাহিদাও হতে পারে, তবে বড় অঙ্কের নগদ পুনরায় সরবরাহের আগে লেনদেনগুলো পর্যালোচনা করা প্রয়োজন।"},
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
        from datetime import datetime, timezone, timedelta
        
        # Bangladesh Standard Time (UTC+6)
        bst_tz = timezone(timedelta(hours=6))
        current_time_bst = datetime.now(bst_tz).strftime("%I:%M %p")
        
        return f"""
        Analyze the following raw risk data and generate a JSON response.
        If it's a liquidity alert, use the current_balance and demand_1h to calculate approximately when the balance will hit zero (assuming current time is {current_time_bst}) and how much they need to safely operate. Mention these exact numbers/times in the messages.
        
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
