"use client";

import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("legal.terms");

  return (
    <main className="prose mx-auto p-4">
      <h1>{t("title")}</h1>

      <h2>{t("s1.title")}</h2>
      <p>{t("s1.p1")}</p>

      <h2>{t("s2.title")}</h2>
      <p>{t("s2.p1")}</p>

      <h2>{t("s3.title")}</h2>
      <p>{t("s3.p1")}</p>

      <h2>{t("s4.title")}</h2>
      <p>{t("s4.p1")}</p>

      <h2>{t("s5.title")}</h2>
      <p>{t("s5.p1")}</p>

      <h2>{t("s6.title")}</h2>
      <p>{t("s6.p1")}</p>
    </main>
  );
}
