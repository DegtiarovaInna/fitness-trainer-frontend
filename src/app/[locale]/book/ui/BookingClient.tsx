// src/app/[locale]/book/ui/BookingClient.tsx
"use client";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

import StudioPicker from "@/src/components/booking/StudioPicker";
import DateRange from "@/src/components/booking/DateRange";
import AvailableSlots from "@/src/components/booking/AvailableSlots";
import PaymentSheet from "@/src/components/booking/PaymentSheet";

import { createOwnBooking } from "@/src/lib/api/bookings";
import { createPayment } from "@/src/lib/api/payments";
import type { TimeSlotDTO } from "@/src/lib/api/timeslots";
import { useAuthStore } from "@/src/stores/auth";

export default function BookingClient() {
  const t = useTranslations();
  const locale = useLocale() as "ru" | "uk" | "de";
  const router = useRouter();
  const sp = useSearchParams();

  const accessToken = useAuthStore((s) => s.accessToken);

  const [studioId, setStudioId] = useState<number | null>(null);
  const [range, setRange] = useState(() => {
    const today = new Date();
    const start = today.toISOString().slice(0, 10);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 7);
    const end = endDate.toISOString().slice(0, 10);
    return { start, end };
  });

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const justLoggedIn = sp.get("loggedIn") === "1";
    if (justLoggedIn) setInfo(t("auth.login") + " ✓");
  }, [sp, t]);

  async function handlePickSlot(slot: TimeSlotDTO) {
    setError(null);
    setInfo(null);

    if (!accessToken) {
      const returnTo = `/${locale}/book`;
      router.push(`/${locale}/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }

    try {
      setBusy(true);
      const booking = await createOwnBooking({ timeSlotId: slot.id! });
      const payment = await createPayment({ bookingId: booking.id! });
      if (!payment.clientSecret) throw new Error(t("payments.failed"));
      setClientSecret(payment.clientSecret);
    } catch (e: any) {
      setError(e?.message || t("payments.failed"));
    } finally {
      setBusy(false);
    }
  }

  function handlePaymentSuccess() {
    setClientSecret(null);
    setInfo(t("booking.paymentSucceeded"));
    router.push(`/${locale}/profile?tab=upcoming`);
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{t("booking.title")}</h1>

      {info && <div className="rounded-md bg-green-50 border border-green-200 p-3 text-green-800">{info}</div>}
      {error && <div className="rounded-md bg-red-50 border border-red-200 p-3 text-red-800">{error}</div>}

      <section className="space-y-3">
        <label className="block text-sm font-medium">{t("booking.studio")}</label>
        <StudioPicker value={studioId} onChange={setStudioId} />
      </section>

      <section className="space-y-3">
        <label className="block text-sm font-medium">{t("booking.dateRange")}</label>
        <DateRange
          start={range.start}
          end={range.end}
          onChange={(p) => setRange((r) => ({ ...r, ...p }))}
          labelStart={t("booking.start")}
          labelEnd={t("booking.end")}
        />
      </section>

      <section className="space-y-3">
        <label className="block text-sm font-medium">{t("booking.available")}</label>
        <AvailableSlots
          studioId={studioId}
          start={range.start}
          end={range.end}
          onPickSlot={handlePickSlot}
          noSlotsText={t("booking.noSlots")}
          bookText={t("booking.book")}
          priceLabel={t("booking.price")}
          trialLabel={t("booking.trial")}
        />
      </section>

      {busy && <div className="text-sm text-gray-600">{t("booking.processing")}</div>}

      {clientSecret && (
        <PaymentSheet
          clientSecret={clientSecret}
          onSuccess={handlePaymentSuccess}
          onClose={() => setClientSecret(null)}
          title={t("payments.title")}
          payNowText={t("payments.payNow")}
          processingOrActionText={t("payments.processingOrAction")}
          processingShortText={t("payments.processingShort")}
        />
      )}
    </div>
  );
}
