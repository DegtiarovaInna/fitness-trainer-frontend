//src/app/[locale]/legal/contacts/page.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function ContactsPage() {
  const t = useTranslations("contacts");
  const locale = useLocale();
  const [s, setS] = useState<"idle"|"sent"|"err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", { method: "POST", body: fd });
    setS(res.ok ? "sent" : "err");
  }

  return (
    <main className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p>{t("company")}: [ВАША КОМПАНИЯ], {t("email")}: [EMAIL], {t("phone")}: [ТЕЛЕФОН]</p>
      <form onSubmit={onSubmit} className="space-y-2">
        <input name="name" className="border w-full p-2" placeholder={t("name")} required />
        <input name="email" type="email" className="border w-full p-2" placeholder="Email" required />
        <textarea name="message" className="border w-full p-2" placeholder={t("message")} required />
        <button className="btn-primary">{t("send")}</button>
      </form>
      {s==="sent" && <div className="text-green-600">{t("sent")}</div>}
      {s==="err" && <div className="text-red-600">{t("error")}</div>}

      <a className="underline text-sm" href={`/${locale}/legal/privacy`}>{t("privacyLink")}</a>
    </main>
  );
}
//На проде вместо console.log отправлять письмо/в CRM.