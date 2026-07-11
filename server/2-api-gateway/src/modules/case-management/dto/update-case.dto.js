export class UpdateCaseDto {
  constructor(status, resolution_notes) {
    this.status = status;
    this.resolution_notes = resolution_notes;
  }
}