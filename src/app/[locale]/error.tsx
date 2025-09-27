// src/app/[locale]/error.tsx
"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const { locale } = useParams() as { locale: "ru" | "uk" | "de" };

  const t500 = useTranslations("errors.500");
  const t404 = useTranslations("errors.404");

  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <img
        src={`/images/errors/500.webp`}
        alt="Error"
        width={512}
        height={360}
        loading="lazy"
        style={{ display: "block", margin: "0 auto 16px" }}
      />
      <h1 className="text-2xl font-bold mb-2">500 — {t500("title")}</h1>
      <p className="text-gray-600 mb-6">{t500("text")}</p>
      <button className="btn-primary mr-2" onClick={() => reset()}>
        {t500("retry")}
      </button>
      <a className="btn" href={`/${locale}`}>
        {t404("back")}
      </a>
    </div>
  );
}
