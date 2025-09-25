// src/app/[locale]/book/ui/BookingClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAvailableByStudio } from "@/lib/api/timeslots";
import { createOwnBooking } from "@/lib/api/bookings";
import { createPayment } from "@/lib/api/payments";
import { useAuthStore } from "@/stores/auth";
import StripeProvider from "@/components/StripeProvider";
import PaymentPanel from "./PaymentPanel";

type Studio = { id?: number; name: string; address: string };

export default function BookingClient({
  locale,
  studios,
  tTitle
}: {
  locale: "ru" | "uk" | "de";
  studios: Studio[];
  tTitle: string;
}) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [studioId, setStudioId] = useState<number | null>(studios[0]?.id ?? null);
  const [range, setRange] = useState<[string, string]>(() => {
    const d = new Date();
    const start = d.toISOString().slice(0, 10);
    d.setDate(d.getDate() + 14);
    const end = d.toISOString().slice(0, 10);
    return [start, end];
  });
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!studioId) return;
    setLoading(true);
    getAvailableByStudio(studioId, range[0], range[1])
      .then((list) => {
        const norm = list.map((s: any) => ({
          ...s,
          startText: toHm(s.startTime),
          endText: toHm(s.endTime)
        }));
        setSlots(norm);
      })
      .finally(() => setLoading(false));
  }, [studioId, range]);

  function toHm(t: any) {
    if (!t) return "";
    if (typeof t === "string") return t.slice(0, 5); // "14:30"
    if (typeof t === "object" && typeof t.hour === "number")
      return `${String(t.hour).padStart(2, "0")}:${String(t.minute ?? 0).padStart(2, "0")}`;
    return "";
    }

  async function book(slotId: number) {
    if (!accessToken) {
      router.push(`/${locale}/auth/login?returnTo=/${locale}/book`);
      return;
    }
    setLoading(true);
    try {

      const booking = await createOwnBooking({ timeSlotId: slotId });

      const payment = await createPayment({ bookingId: booking.id! });
      if (payment.clientSecret) {
        setClientSecret(payment.clientSecret);
      } else {
        alert("Не удалось получить clientSecret для оплаты.");
      }
    } finally {
      setLoading(false);
    }
  }

  function closePayment() {
    setClientSecret(null);
  }

  function onPaid() {
    setClientSecret(null);

    router.replace(`/${locale}/profile`);
  }

  return (
    <section className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">{tTitle}</h1>

      <div className="flex flex-col gap-3 mb-6">
        <select
          className="border rounded px-3 py-2"
          value={studioId ?? ""}
          onChange={(e) => setStudioId(Number(e.target.value))}
        >
          {studios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.address}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={range[0]}
            onChange={(e) => setRange([e.target.value, range[1]])}
          />
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={range[1]}
            onChange={(e) => setRange([range[0], e.target.value])}
          />
        </div>
      </div>

      {loading ? (
        <p className="animate-pulse text-gray-500">Загружаем доступные слоты…</p>
      ) : slots.length === 0 ? (
        <p className="text-gray-600">Нет доступных слотов на выбранный период.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {slots.map((s) => (
            <li key={s.id} className="rounded-2xl shadow p-4 bg-white flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  {s.date} {s.startText} — {s.endText}
                </div>
                {s.trial && <div className="text-xs text-accent">Пробная тренировка</div>}
                <div className="text-sm text-gray-600">{(s.priceCents / 100).toFixed(2)} €</div>
              </div>
              <button className="btn-primary" onClick={() => book(s.id)}>
                Выбрать
              </button>
            </li>
          ))}
        </ul>
      )}

      {clientSecret && (
        <StripeProvider clientSecret={clientSecret}>
          <PaymentPanel onClose={closePayment} onSuccess={onPaid} />
        </StripeProvider>
      )}
    </section>
  );
}
