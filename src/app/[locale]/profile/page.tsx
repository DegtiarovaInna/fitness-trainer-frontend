// src/app/[locale]/profile/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { useAuthStore } from "@/src/stores/auth";
import {
  getMyUpcoming,
  getMyHistory,
  cancelBooking,
  type BookingDTO,
} from "@/src/lib/api/bookings";
import { getTimeSlot, type TimeSlotDTO } from "@/src/lib/api/timeslots";
import { getStudio, type StudioDTO } from "@/src/lib/api/studios";

import StatusBadge from "@/src/components/ui/StatusBadge";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import { formatDateTimeRange } from "@/src/lib/format";

type Enriched = BookingDTO & {
  slot?: TimeSlotDTO | null;
  studio?: StudioDTO | null;
};

function useEnrichBookings(list: BookingDTO[]) {
  const [enriched, setEnriched] = useState<Enriched[]>([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const uniqSlotIds = Array.from(
        new Set(list.map((b) => b.timeSlotId).filter(Boolean))
      ) as number[];
      const slots = await Promise.all(uniqSlotIds.map((id) => getTimeSlot(id)));
      const slotMap = new Map<number, TimeSlotDTO>();
      slots.forEach((s) => s.id && slotMap.set(s.id, s));

      const uniqStudioIds = Array.from(
        new Set(slots.map((s) => s.studioId).filter(Boolean))
      ) as number[];
      const studios = await Promise.all(uniqStudioIds.map((id) => getStudio(id)));
      const studioMap = new Map<number, StudioDTO>();
      studios.forEach((st) => st.id && studioMap.set(st.id, st));

      const result: Enriched[] = list.map((b) => {
        const slot = b.timeSlotId ? slotMap.get(b.timeSlotId) : null;
        const studio = slot?.studioId ? studioMap.get(slot.studioId) : null;
        return { ...b, slot: slot ?? null, studio: studio ?? null };
      });

      if (mounted) setEnriched(result);
    })().catch(() => {});
    return () => {
      mounted = false;
    };
  }, [JSON.stringify(list)]);
  return enriched;
}

function BookingCard({
  b,
  locale,
  onCancel,
}: {
  b: Enriched;
  locale: "ru" | "uk" | "de";
  onCancel?: (id: number) => void;
}) {
  const t = useTranslations();

  const when = useMemo(() => {
    if (b.slot) {
      return formatDateTimeRange(
        b.slot.date,
        b.slot.startTime.hour,
        b.slot.startTime.minute,
        b.slot.endTime.hour,
        b.slot.endTime.minute,
        locale
      );
    }
    return b.createdAt ? new Date(b.createdAt).toLocaleString(locale) : "—";
  }, [b.slot, b.createdAt, locale]);

  return (
    <li className="border rounded-md p-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="font-medium truncate">
          #{b.id} • {b.studio?.name ?? "—"} • {when}
        </div>
        <div className="text-sm text-gray-600 truncate">{b.studio?.address ?? ""}</div>
        <div className="mt-1">
          <StatusBadge status={b.status as any} />
        </div>
      </div>

      {onCancel && b.status === "CONFIRMED" && (
        <button className="btn-danger shrink-0" onClick={() => onCancel(b.id!)}>
          {t("profile.cancel")}
        </button>
      )}
    </li>
  );
}

export default function ProfilePage() {
  const t = useTranslations();
  const locale = useLocale() as "ru" | "uk" | "de";
  const router = useRouter();
  const sp = useSearchParams();
  const accessToken = useAuthStore((s) => s.accessToken);

  const initialTab = (sp.get("tab") as "upcoming" | "history") || "upcoming";
  const [tab, setTab] = useState<"upcoming" | "history">(initialTab);
  const [loading, setLoading] = useState(false);
  const [upcoming, setUpcoming] = useState<BookingDTO[]>([]);
  const [history, setHistory] = useState<BookingDTO[]>([]);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    if (!accessToken) {
      router.replace(`/${locale}/auth/login?returnTo=/${locale}/profile`);
    }
  }, [accessToken, locale, router]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const [u, h] = await Promise.all([getMyUpcoming(), getMyHistory()]);
        if (!mounted) return;
        setUpcoming(u);
        setHistory(h);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    if (accessToken) load();
    return () => {
      mounted = false;
    };
  }, [accessToken]);

  useEffect(() => {
    router.replace(`/${locale}/profile?tab=${tab}`);
  }, [tab, router, locale]);

  const enrUpcoming = useEnrichBookings(upcoming);
  const enrHistory = useEnrichBookings(history);

  async function doCancel(id: number) {
    try {
      await cancelBooking(id);
      toast.success(t("profile.cancelled"));
      const next = await getMyUpcoming();
      setUpcoming(next);
    } catch (e: any) {
      toast.error(e?.message || "Failed to cancel");
    } finally {
      setConfirmId(null);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("profile.title")}</h1>
        <button className="btn" onClick={() => router.push(`/${locale}/profile/edit`)}>
          {t("profile.editTitle")}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-md border ${tab === "upcoming" ? "bg-brand text-white" : "bg-white"}`}
          onClick={() => setTab("upcoming")}
        >
          {t("profile.tabs.upcoming")}
        </button>
        <button
          className={`px-4 py-2 rounded-md border ${tab === "history" ? "bg-brand text-white" : "bg-white"}`}
          onClick={() => setTab("history")}
        >
          {t("profile.tabs.history")}
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse h-14 bg-gray-200 rounded-md" />
          ))}
        </div>
      ) : tab === "upcoming" ? (
        enrUpcoming.length ? (
          <ul className="space-y-2">
            {enrUpcoming.map((b) => (
              <BookingCard key={b.id} b={b} locale={locale} onCancel={(id) => setConfirmId(id)} />
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-600">{t("profile.empty")}</div>
        )
      ) : enrHistory.length ? (
        <ul className="space-y-2">
          {enrHistory.map((b) => (
            <BookingCard key={b.id} b={b} locale={locale} />
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-600">{t("profile.empty")}</div>
      )}

      {confirmId !== null && (
        <ConfirmModal
          title={t("profile.cancelConfirmTitle")}
          text={t("profile.cancelConfirmText")}
          confirmText={t("profile.cancel")}
          onConfirm={() => doCancel(confirmId)}
          onClose={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
