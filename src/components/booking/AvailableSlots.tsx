// src/components/booking/AvailableSlots.tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getAvailableByStudio } from "@/src/lib/api/timeslots";
import type { TimeSlotDTO } from "@/src/lib/api/timeslots";

type Props = {
  studioId: number | null;
  start: string;
  end: string;
  onPickSlot: (slot: TimeSlotDTO) => void;
};

export default function AvailableSlots({ studioId, start, end, onPickSlot }: Props) {
  const t = useTranslations();
  const [slots, setSlots] = useState<TimeSlotDTO[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studioId || !start || !end) {
      setSlots(null);
      return;
    }
    setLoading(true);
    let mounted = true;
    getAvailableByStudio(studioId, start, end)
      .then((data) => mounted && setSlots(data))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [studioId, start, end]);

  if (!studioId) return null;

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse h-12 rounded-md bg-gray-200" />
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return <p className="text-sm text-gray-600">{t("booking.noSlots")}</p>;
  }

  return (
    <ul className="space-y-2">
      {slots.map((s) => {
        const startHH = pad2(s.startTime.hour ?? 0);
        const startMM = pad2(s.startTime.minute ?? 0);
        const endHH = pad2(s.endTime.hour ?? 0);
        const endMM = pad2(s.endTime.minute ?? 0);
        const price = (s.priceCents / 100).toFixed(2);

        return (
          <li key={s.id} className="flex items-center justify-between border rounded-md p-3">
            <div>
              <div className="font-medium">{s.date} • {startHH}:{startMM}–{endHH}:{endMM}</div>
              <div className="text-sm text-gray-600">
                {t("booking.price")}: €{price}{s.trial ? ` • ${t("booking.trial")}` : ""}
              </div>
            </div>
            <button className="btn-primary" onClick={() => onPickSlot(s)}>
              {t("booking.book")}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
