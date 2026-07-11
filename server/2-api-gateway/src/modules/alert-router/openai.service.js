import OpenAI from "openai";
import { config } from "../../config/configuration.js";

const openai = new OpenAI({ apiKey: config.openaiKey });

const systemPrompts = {
  bn: "You are a Bangladeshi MFS operations assistant. Explain alerts in simple Bengali. Use respectful tone. Never say fraud. Use unusual or requires review. Keep under 3 sentences.",
  en: "You are an MFS operations analyst. Explain anomalies in clear cautious English. Never declare fraud. Use unusual pattern or requires human review. Include confidence and possible normal causes.",
  banglish: "You are a Bangladeshi MFS assistant. Explain in Banglish Roman Bengali using simple words. Never say fraud.",
};

export const generateAlertExplanation = async (evidence, lang = "bn") => {
  const prompt = `Evidence: ${JSON.stringify(evidence)} Confidence: ${evidence.confidence_score} Causes: ${evidence.possible_causes?.join(", ")}. Generate concise actionable alert. Include what is happening why it might be normal and safe next step.`;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompts[lang] || systemPrompts.en },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });
    return completion.choices[0].message.content.trim();
  } catch (err) {
    return generateFallback(evidence, lang);
  }
};

export const summarizeCaseForEscalation = async (caseData, auditLogs) => {
  const prompt = `Case: ${JSON.stringify(caseData)} History: ${JSON.stringify(auditLogs)} Summarize in 2 bullets what has been done and what next owner should focus on.`;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an MFS escalation coordinator. Be factual concise and action-oriented." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 150,
    });
    return completion.choices[0].message.content.trim();
  } catch (err) {
    return "Escalation summary unavailable. Please review case details manually.";
  }
};

function generateFallback(evidence, lang) {
  const c = Math.round((evidence.confidence_score || 0) * 100);
  const t = {
    bn: `সতর্কতা: ${evidence.alert_type || "unknown"}। কনফিডেন্স: ${c}%। দয়া করে রিভিউ করুন।`,
    en: `Alert: ${evidence.alert_type || "unknown"}. Confidence: ${c}%. Please review.`,
    banglish: `Alert: ${evidence.alert_type || "unknown"}. Confidence ${c}%. Ektu check koren.`,
  };
  return t[lang] || t.en;
}