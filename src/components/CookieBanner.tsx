"use client";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

const KEY = "cookie-consent"; // "accepted" | "rejected"

export default function CookieBanner() {
  const t = useTranslations("cookieBanner");
  const locale = useLocale();
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem(KEY);
    if (!v) setSeen(true);
  }, []);

  if (!seen) return null;

  function accept() {
    localStorage.setItem(KEY, "accepted");
    location.reload();
  }
  function reject() {
    localStorage.setItem(KEY, "rejected");
    setSeen(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white border-t p-3 shadow z-50">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 items-center justify-between">
        <p className="text-sm">
          {t("text")}{" "}
          <a className="underline" href={`/${locale}/legal/cookies`}>{t("link")}</a>.
        </p>
        <div className="flex gap-2">
          <button className="btn" onClick={reject}>{t("reject")}</button>
          <button className="btn-primary" onClick={accept}>{t("accept")}</button>
        </div>
      </div>
    </div>
  );
}
