"use client";

import { useTranslations } from "next-intl";

export default function AccessibilityPage() {
  const t = useTranslations("legal.accessibility");

  return (
    <main className="prose mx-auto p-4">
      <h1>{t("title")}</h1>
      <p>{t("p1")}</p>
      <p>{t("p2")}</p>
    </main>
  );
}
