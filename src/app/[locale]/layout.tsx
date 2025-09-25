// src/app/[locale]/layout.tsx
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import Header from "@/components/Header";
import "../../styles/globals.css";

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: "ru" | "uk" | "de" }>;
}) {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <main>{children}</main>
    </NextIntlClientProvider>
  );
}