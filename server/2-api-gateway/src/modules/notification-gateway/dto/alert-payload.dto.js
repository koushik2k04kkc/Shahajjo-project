export class AlertPayloadDto {
  constructor(alert, caseData) {
    this.alert = alert;
    this.case = caseData;
    this.timestamp = new Date().toISOString();
  }
}