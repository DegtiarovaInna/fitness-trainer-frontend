// src/app/[locale]/about/page.tsx
import type { Metadata } from "next";
import { createTranslator } from "next-intl";

export async function generateMetadata({
  params
}: { params: Promise<{ locale: "ru" | "uk" | "de" }> }): Promise<Metadata> {
  const { locale } = await params;
  const titleMap = { ru: "Обо мне", uk: "Про мене", de: "Über mich" };
  const descMap  = { ru: "Сертифицированный тренер.", uk: "Сертифікований тренер.", de: "Zertifizierter Trainer." };
  return { title: `${titleMap[locale]} — Fitness Trainer`, description: descMap[locale] };
}

export default async function AboutPage({
  params
}: { params: Promise<{ locale: "ru" | "uk" | "de" }> }) {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace: "about" });

  return (
    <section className="max-w-3xl mx-auto py-12 px-4 prose">
      <h1>{t("title")}</h1>
      <p>{t("p1")}</p>
      <p>{t("p2")}</p>
    </section>
  );
}
