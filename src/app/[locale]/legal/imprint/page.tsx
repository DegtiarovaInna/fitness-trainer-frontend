"use client";

import { useTranslations } from "next-intl";

export default function ImprintPage() {
  const t = useTranslations("legal.imprint");

  return (
    <main className="prose mx-auto p-4">
      <h1>{t("title")}</h1>
      <p><b>{t("company")}:</b> [ВАША КОМПАНИЯ/ФЛП]</p>
      <p><b>{t("address")}:</b> [АДРЕС]</p>
      <p><b>{t("contact")}:</b> [EMAIL, ТЕЛЕФОН]</p>
      <p><b>{t("representative")}:</b> [ФИО]</p>
      <p><b>{t("register")}:</b> [РЕГИСТР/НОМЕР]</p>
      <p><b>{t("vat")}:</b> [USt-IdNr.]</p>
      <p>
        <b>{t("odr")}:</b>{" "}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer">
          https://ec.europa.eu/consumers/odr
        </a>
      </p>
      <p><b>{t("liabilityTitle")}</b> {t("liabilityText")}</p>
    </main>
  );
}
