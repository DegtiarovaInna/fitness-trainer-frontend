// src/app/[locale]/admin/bookings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getAllBookings } from "@/src/lib/api/bookings";
import type { BookingDTO } from "@/src/lib/api/bookings";
import { useLocale } from "next-intl";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { fmtDate } from "@/src/lib/format";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminBookings() {
  const [data, setData] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const locale = useLocale() as "ru" | "uk" | "de";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getAllBookings();
        if (!mounted) return;
        setData(res);
      } catch (e: any) {
        toast.error(e?.message || "Failed");
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">Bookings</h1>
      {loading ? "Loading..." : (
        <div className="overflow-auto">
          <table className="min-w-[700px] w-full border">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-left">TimeSlot</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Created</th>
                <th className="p-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {data.map(b => (
                <tr key={b.id} className="border-t">
                  <td className="p-2">{b.id}</td>
                  <td className="p-2">{b.userId}</td>
                  <td className="p-2">{b.timeSlotId}</td>
                  <td className="p-2"><StatusBadge status={b.status!} /></td>
                  <td className="p-2">{b.createdAt ? fmtDate(b.createdAt, locale) : "—"}</td>
                  <td className="p-2">
                    <Link className="text-brand underline" href={`/${locale}/admin/bookings/${b.id}`}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
