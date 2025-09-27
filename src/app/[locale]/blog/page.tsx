// src/app/[locale]/blog/page.tsx
export { metadata } from "./metadata";

import { createTranslator } from "next-intl";

export default async function BlogPage({
  params
}: { params: Promise<{ locale: "ru" | "uk" | "de" }> }) {
  const { locale } = await params;
  const messages = (await import(`@/src/locales/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace: "blog" });

  return (
    <section className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
      <p className="text-gray-600">{t("soon")}</p>
    </section>
  );
}
