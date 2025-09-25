// src/app/[locale]/blog/page.tsx
import type { Metadata } from "next";
import { createTranslator } from "next-intl";

export async function generateMetadata({
  params
}: { params: Promise<{ locale: "ru" | "uk" | "de" }> }): Promise<Metadata> {
  const { locale } = await params;
  const titleMap = { ru: "Блог", uk: "Блог", de: "Blog" };
  return { title: `${titleMap[locale]} — Fitness Trainer`, description: titleMap[locale] };
}

export default async function BlogPage({
  params
}: { params: Promise<{ locale: "ru" | "uk" | "de" }> }) {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace: "blog" });

  return (
    <section className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-3">{t("title")}</h1>
      <p className="text-gray-600">{t("soon")}</p>
    </section>
  );
}
