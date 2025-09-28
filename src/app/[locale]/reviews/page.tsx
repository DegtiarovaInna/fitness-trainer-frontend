"use client";

import { useTranslations } from "next-intl";

const data = [
  { name: "Anna", textKey: "r1" },
  { name: "Max",  textKey: "r2" },
  { name: "Oleh", textKey: "r3" },
];

export default function ReviewsPage() {
  const t = useTranslations("reviews");

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="text-gray-600">{t("subtitle")}</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {data.map((r) => (
          <div key={r.name} className="border rounded-2xl p-5 shadow-sm">
            <div className="font-semibold">{r.name}</div>
            <p className="mt-2 text-gray-700">{t(`items.${r.textKey}`)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
