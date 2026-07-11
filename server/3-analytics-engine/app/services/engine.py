import uuid
from datetime import datetime, timezone
from typing import List

from app.models.schemas import AgentState, AnalysisResult, Alert, ConfidenceLevel
from app.services.data_quality import DataQualityMonitor
from app.services.liquidity_forecaster.forecaster import LiquidityForecaster
from app.services.anomaly_detector.detector import AnomalyDetector
from app.services.evidence_generator.generator import EvidenceGenerator

class AnalyticsEngine:
    def __init__(self):
        self.dq_monitor = DataQualityMonitor()
        self.liquidity_forecaster = LiquidityForecaster()
        self.anomaly_detector = AnomalyDetector()
        self.evidence_generator = EvidenceGenerator()

    def process_agent_state(self, state: AgentState) -> AnalysisResult:
        # 1. Data Quality Check
        dq_score = self.dq_monitor.evaluate(state)
        confidence = self.dq_monitor.get_confidence_level(dq_score)

        alerts = []
        
        # 2. Liquidity Analysis
        liquidity_raw_alerts = self.liquidity_forecaster.analyze(state)
        
        # 3. Anomaly Detection
        anomaly_raw_alerts = self.anomaly_detector.analyze(state)
        
        # 4. Compile Results & Generate Evidence
        all_raw_alerts = liquidity_raw_alerts + anomaly_raw_alerts
        
        for raw_alert in all_raw_alerts:
            # Call OpenAI (or fallback) for natural language evidence
            enriched_data = self.evidence_generator.generate_alert_details(raw_alert, confidence)
            
            alert = Alert(
                alert_id=str(uuid.uuid4()),
                agent_id=state.agent_id,
                provider=raw_alert.get("provider"),
                alert_type=raw_alert.get("type"),
                risk_level=raw_alert.get("risk_level"),
                message_en=enriched_data["message_en"],
                message_bn=enriched_data["message_bn"],
                message_banglish=enriched_data["message_banglish"],
                recommended_action=enriched_data["recommended_action"],
                evidence_details=enriched_data["evidence_details"],
                confidence_level=confidence,
                timestamp=datetime.now(timezone.utc)
            )
            alerts.append(alert)

        return AnalysisResult(
            agent_id=state.agent_id,
            alerts=alerts,
            data_quality_score=dq_score,
            analysis_timestamp=datetime.now(timezone.utc)
        )
