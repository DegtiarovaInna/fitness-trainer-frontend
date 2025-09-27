// src/app/[locale]/admin/bookings/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBookingById, type BookingDTO } from "@/src/lib/api/bookings";
import { getTimeSlot, type TimeSlotDTO } from "@/src/lib/api/timeslots";
import { getStudio, type StudioDTO } from "@/src/lib/api/studios";
import { fmtDate } from "@/src/lib/format";

export default function AdminBookingDetailsPage() {
  const { id, locale } = useParams() as { id: string; locale: string };
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDTO | null>(null);
  const [slot, setSlot] = useState<TimeSlotDTO | null>(null);
  const [studio, setStudio] = useState<StudioDTO | null>(null);

  useEffect(() => {
    (async () => {
      const b = await getBookingById(Number(id));
      setBooking(b);
      if (b.timeSlotId) {
        const s = await getTimeSlot(b.timeSlotId);
        setSlot(s);
        if (s?.studioId) setStudio(await getStudio(s.studioId));
      }
    })().catch(() => {});
  }, [id]);

  if (!booking) return <div className="p-4">Loading…</div>;

  return (
    <div className="p-4 space-y-3">
      <button className="btn" onClick={() => router.push(`/${locale}/admin/bookings`)}>← Back</button>
      <h1 className="text-xl font-semibold">Booking #{booking.id}</h1>
      <div className="space-y-1">
        <div><b>Status:</b> {booking.status}</div>
        <div><b>Created:</b> {fmtDate(booking.createdAt, locale as any)}</div>
        {slot && (
          <div>
            <b>Slot:</b> {slot.date} {slot.startTime.hour}:{String(slot.startTime.minute).padStart(2,"0")}
            {" — "}
            {slot.endTime.hour}:{String(slot.endTime.minute).padStart(2,"0")}
          </div>
        )}
        {studio && (
          <div>
            <b>Studio:</b> {studio.name} — {studio.address}
          </div>
        )}
      </div>
    </div>
  );
}
