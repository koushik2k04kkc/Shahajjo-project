import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
});

export const transactionSchema = Joi.object({
  agent_id: Joi.string().uuid().required(),
  provider_id: Joi.string().uuid().required(),
  transaction_type: Joi.string().valid("cash_in", "cash_out", "transfer").required(),
  amount: Joi.number().positive().required(),
  customer_ref_hash: Joi.string().required(),
});

export const resolveCaseSchema = Joi.object({
  resolution_notes: Joi.string().required(),
  false_positive: Joi.boolean().default(false),
});

export const assignCaseSchema = Joi.object({
  assigned_to_role: Joi.string().required(),
  assigned_to_id: Joi.string().uuid().required(),
});
