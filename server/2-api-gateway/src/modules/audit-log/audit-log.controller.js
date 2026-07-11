import { getAuditTrail } from "./audit-log.service.js";

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await getAuditTrail(req.params.caseId);
    res.json(logs);
  } catch (err) { next(err); }
};