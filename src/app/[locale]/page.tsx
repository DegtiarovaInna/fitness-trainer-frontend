//src/app/[locale]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { createTranslator } from "next-intl";

export async function generateMetadata({ params }: { params: Promise<{locale:"ru"|"uk"|"de"}> }): Promise<Metadata> {
  const { locale } = await params;
  const titles = { ru: "Главная — Fitness Trainer", uk: "Головна — Fitness Trainer", de: "Startseite — Fitness Trainer" };
  const descs  = { ru: "Личные тренировки онлайн и офлайн.", uk: "Персональні тренування онлайн і офлайн.", de: "Personaltraining online und offline." };
  return { title: titles[locale], description: descs[locale] };
}

export default async function HomePage({ params }: { params: Promise<{locale:"ru"|"uk"|"de"}> }) {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace: "home" });

  return (
    <section className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-lg mb-6">{t("subtitle")}</p>
      <Link href="book" className="btn-primary">{t("cta")}</Link>
    </section>
  );
}