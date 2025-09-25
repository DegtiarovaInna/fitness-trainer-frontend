// src/i18n/request.ts
import {getRequestConfig} from "next-intl/server";

function normalizeLocale(input?: string): "ru" | "uk" | "de" {
  const l = (input || "").toLowerCase();
  if (l.startsWith("ua")) return "uk"; // alias
  if (l.startsWith("uk")) return "uk";
  if (l.startsWith("de")) return "de";
  return "ru";
}

export default getRequestConfig(async ({locale}) => {
  const l = normalizeLocale(locale);
  console.log("[next-intl] incoming:", locale, "resolved:", l);
  const messages = (await import(`../locales/${l}.json`)).default;
  return {locale: l, messages};
});
