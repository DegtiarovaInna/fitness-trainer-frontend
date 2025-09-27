// src/components/booking/DateRange.tsx
"use client";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

type Props = {
  start: string;
  end: string;
  onChange: (patch: { start?: string; end?: string }) => void;
};

export default function DateRange({ start, end, onChange }: Props) {
  const t = useTranslations("booking");
  const min = useMemo(() => new Date().toISOString().slice(0, 10), []);
  return (
    <div className="flex gap-3 items-center">
      <label className="flex items-center gap-2">
        <span className="text-sm">{t("start")}</span>
        <input
          type="date"
          className="border rounded-md p-2"
          value={start}
          min={min}
          onChange={(e) => onChange({ start: e.target.value })}
        />
      </label>
      <label className="flex items-center gap-2">
        <span className="text-sm">{t("end")}</span>
        <input
          type="date"
          className="border rounded-md p-2"
          value={end}
          min={start || min}
          onChange={(e) => onChange({ end: e.target.value })}
        />
      </label>
    </div>
  );
}
