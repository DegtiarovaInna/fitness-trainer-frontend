"use client";

import { useTranslations } from "next-intl";

export default function CookiesPage() {
  const t = useTranslations("legal.cookies");

  return (
    <main className="prose mx-auto p-4">
      <h1>{t("title")}</h1>

      <h2>{t("s1.title")}</h2>
      <ul>
        <li>{t("s1.li1")}</li>
        <li>{t("s1.li2")}</li>
      </ul>

      <h2>{t("s2.title")}</h2>
      <p>{t("s2.p1")}</p>
    </main>
  );
}
