//src/components/booking/StudioPicker.tsx
"use client";

import { useEffect, useState } from "react";
import { getAllStudios } from "@/src/lib/api/studios";
import type { StudioDTO } from "@/src/lib/api/studios";

type Props = {
  value?: number | null;
  onChange: (id: number | null) => void;
};

export default function StudioPicker({ value, onChange }: Props) {
  const [studios, setStudios] = useState<StudioDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAllStudios()
      .then((data) => mounted && setStudios(data))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse h-10 w-full rounded-md bg-gray-200" />
    );
  }

  return (
    <select
      className="w-full border rounded-md p-2"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
    >
      <option value="">— Select studio —</option>
      {studios.map((s) => (
        <option key={s.id} value={s.id}>{s.name} — {s.address}</option>
      ))}
    </select>
  );
}
