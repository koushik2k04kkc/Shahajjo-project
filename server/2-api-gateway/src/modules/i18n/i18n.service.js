import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const locales = {
  bn: JSON.parse(readFileSync(join(__dirname, "locales/bn.json"), "utf8")),
  en: JSON.parse(readFileSync(join(__dirname, "locales/en.json"), "utf8")),
  banglish: JSON.parse(readFileSync(join(__dirname, "locales/bn-banglish.json"), "utf8")),
};

export const t = (key, lang = "bn") => {
  const keys = key.split(".");
  let val = locales[lang] || locales.bn;
  for (const k of keys) {
    val = val?.[k];
    if (!val) break;
  }
  return val || key;
};