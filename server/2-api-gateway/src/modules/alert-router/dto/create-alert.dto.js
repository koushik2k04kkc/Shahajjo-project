export class CreateAlertDto {
  constructor(data) {
    this.agent_id = data.agent_id;
    this.provider_id = data.provider_id;
    this.alert_type = data.alert_type;
    this.severity = data.severity;
    this.evidence = data.evidence;
    this.confidence_score = data.confidence_score;
  }
}