"use client";

import { useTranslations } from "next-intl";

export default function RefundsPage() {
  const t = useTranslations("legal.refunds");

  return (
    <main className="prose mx-auto p-4">
      <h1>{t("title")}</h1>
      <ul>
        <li>{t("r1")}</li>
        <li>{t("r2")}</li>
        <li>{t("r3")}</li>
      </ul>
      <p>{t("note")}</p>
    </main>
  );
}
