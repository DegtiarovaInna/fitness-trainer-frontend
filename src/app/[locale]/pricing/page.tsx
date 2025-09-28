"use client";

import { useTranslations } from "next-intl";

export default function PricingPage() {
  const t = useTranslations("pricing");

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="text-gray-600">{t("subtitle")}</p>

      <div className="grid sm:grid-cols-3 gap-4">
        {(["trial","single","pack"] as const).map((k) => (
          <div key={k} className="border rounded-2xl p-5 shadow-sm">
            <div className="text-xl font-semibold">{t(`plans.${k}.title`)}</div>
            <div className="mt-1 text-gray-600">{t(`plans.${k}.desc`)}</div>
            <div className="mt-4 text-2xl font-bold">{t(`plans.${k}.price`)}</div>
            <button className="btn-primary mt-4 w-full">{t("cta")}</button>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500">{t("note")}</p>
    </main>
  );
}
