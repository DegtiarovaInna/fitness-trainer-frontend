//src/components/Footer.tsx
"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");

  return (
    <footer className="mt-10 border-t bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-sm">
        <div className="text-gray-700">© {new Date().getFullYear()} Fitness Trainer</div>
        <nav className="flex flex-wrap gap-x-4 gap-y-2">
          <Link className="hover:underline" href={`/${locale}/legal/privacy`}>{t("privacy")}</Link>
          <Link className="hover:underline" href={`/${locale}/legal/terms`}>{t("terms")}</Link>
          <Link className="hover:underline" href={`/${locale}/legal/cookies`}>{t("cookies")}</Link>
          <Link className="hover:underline" href={`/${locale}/legal/imprint`}>{t("imprint")}</Link>
          <Link className="hover:underline" href={`/${locale}/legal/refunds`}>{t("refunds")}</Link>
          <Link className="hover:underline" href={`/${locale}/legal/accessibility`}>{t("accessibility")}</Link>
          <Link className="hover:underline" href={`/${locale}/contacts`}>{t("contacts")}</Link>
        </nav>
      </div>
    </footer>
  );
}
