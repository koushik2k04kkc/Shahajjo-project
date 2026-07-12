export function normalizeAlertPayload(payload) {
  if (!payload) return null;

  if (payload.alert && typeof payload.alert === 'object') {
    return {
      ...payload.alert,
      caseId: payload.case?.id || payload.alert.caseId || payload.alert.case_id,
      title: payload.alert.title || payload.localizedTitle?.en || payload.alert.titleBn || payload.alert.title_en || 'Alert',
      titleBn: payload.alert.titleBn || payload.alert.title_bn || payload.localizedTitle?.bn || payload.alert.title,
      provider: payload.alert.provider || payload.alert.provider_id || 'Unknown',
      confidence: payload.alert.confidence ?? payload.alert.confidence_level ?? 0,
      severity: payload.alert.severity || payload.alert.risk_level || 'medium',
    };
  }

  return payload;
}
