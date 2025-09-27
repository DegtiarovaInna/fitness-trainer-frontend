//src/app/[locale]/not-found.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const { locale } = useParams() as { locale: "ru" | "uk" | "de" };
  const t404 = useTranslations("errors.404");

  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <img
        src={`/images/errors/404.webp`}
        alt="Not found"
        width={512}
        height={360}
        loading="lazy"
        style={{ display: "block", margin: "0 auto 16px" }}
      />
      <h1 className="text-2xl font-bold mb-2">404 — {t404("title")}</h1>
      <p className="text-gray-600 mb-6">{t404("text")}</p>
      <Link href={`/${locale}`} className="btn-primary">{t404("back")}</Link>
    </div>
  );
}
