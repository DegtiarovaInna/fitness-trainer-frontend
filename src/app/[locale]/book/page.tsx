// src/app/[locale]/book/page.tsx
import { createTranslator } from "next-intl";
import { getAllStudios } from "@/lib/api/studios";
import BookingClient from "./ui/BookingClient";

export default async function BookPage({
  params
}: { params: Promise<{ locale: "ru" | "uk" | "de" }> }) {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace: "services" });

  const studios = await getAllStudios();
  return <BookingClient locale={locale} studios={studios} tTitle={t("title")} />;
}
