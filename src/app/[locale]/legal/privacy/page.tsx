"use client";

import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations("legal.privacy");

  return (
    <main className="prose mx-auto p-4">
      <h1>{t("title")}</h1>
      <p><em>{t("updated")}</em></p>

      <h2>{t("s1.title")}</h2>
      <p>{t("s1.p1")}</p>

      <h2>{t("s2.title")}</h2>
      <ul>
        <li>{t("s2.li1")}</li>
        <li>{t("s2.li2")}</li>
        <li>{t("s2.li3")}</li>
      </ul>

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
