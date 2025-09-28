
// src/app/[locale]/layout.tsx
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import ToasterMount from "@/src/components/ToasterMount";
 import CookieBanner from "@/src/components/CookieBanner";

import "@/src/styles/globals.css";

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: "ru" | "uk" | "de" }>;
}) {
  const { locale } = await params;

  const messages = (await import(`@/src/locales/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
      <ToasterMount />
      {/* <CookieBanner /> */}
    </NextIntlClientProvider>
  );
}
