// src/app/[locale]/about/page.tsx
export { metadata } from "./metadata";

import { createTranslator } from "next-intl";

export default async function AboutPage({
  params
}: { params: Promise<{ locale: "ru" | "uk" | "de" }> }) {
  const { locale } = await params;
  const messages = (await import(`@/src/locales/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace: "about" });

  return (
    <section className="max-w-3xl mx-auto py-12 px-4 prose">
      <h1>{t("title")}</h1>
      <p>{t("p1")}</p>
      <p>{t("p2")}</p>
    </section>
  );
}
