// src/app/[locale]/services/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { createTranslator } from "next-intl";

export async function generateMetadata({
  params
}: { params: Promise<{ locale: "ru" | "uk" | "de" }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = { ru: "Услуги", uk: "Послуги", de: "Leistungen" }[locale];
  const desc  = { ru: "Тренировки и коучинг.", uk: "Тренування та коучинг.", de: "Training und Coaching." }[locale];
  return { title: `${title} — Fitness Trainer`, description: desc };
}

export default async function ServicesPage({
  params
}: { params: Promise<{ locale: "ru" | "uk" | "de" }> }) {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace: "services" });

  const cards = ["offline", "online", "coach"] as const;

  return (
    <section className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((k) => (
          <div key={k} className="rounded-2xl shadow p-6 bg-white">
            <h3 className="text-xl font-semibold mb-2">{t(`cards.${k}.title`)}</h3>
            <p className="text-gray-600 mb-4">{t(`cards.${k}.desc`)}</p>
            <Link href="../book" className="btn-primary">
              {t("cta")}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
