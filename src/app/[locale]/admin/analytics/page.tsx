// src/app/[locale]/admin/analytics/page.tsx
"use client";
import { useEffect, useState } from "react";
import { getAllStudios } from "@/src/lib/api/studios";
import type { StudioDTO } from "@/src/lib/api/studios";
import { getOccupancy, getUniqueClientsNumber } from "@/src/lib/api/studio-analytics";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import toast from "react-hot-toast";

type OccRow = { date: string; count: number };

export default function AdminAnalytics() {
  const [studios, setStudios] = useState<StudioDTO[]>([]);
  const [studioId, setStudioId] = useState<number | null>(null);
  const [range, setRange] = useState(() => {
    const d = new Date();
    const end = d.toISOString().slice(0,10);
    d.setDate(d.getDate() - 14);
    const start = d.toISOString().slice(0,10);
    return { start, end };
  });
  const [chart, setChart] = useState<OccRow[]>([]);
  const [uniqueClients, setUniqueClients] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await getAllStudios();
        setStudios(s);
        if (s.length) setStudioId(s[0].id!);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load studios");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!studioId) return;
      try {
        const occ = await getOccupancy(studioId, range.start, range.end);
        const rows: OccRow[] = Object.entries(occ)
          .sort(([a],[b]) => a.localeCompare(b))
          .map(([date, count]) => ({ date, count: count as number }));
        setChart(rows);

        const uniq = await getUniqueClientsNumber(studioId, range.start, range.end);
        setUniqueClients(uniq);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load stats");
      }
    })();
  }, [studioId, range]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">Analytics</h1>

      <div className="flex gap-3 items-end">
        <label className="flex flex-col">
          <span className="text-sm">Studio</span>
          <select className="border rounded-md p-2" value={studioId ?? ""} onChange={e => setStudioId(Number(e.target.value))}>
            {studios.map(s => <option key={s.id} value={s.id!}>{s.name}</option>)}
          </select>
        </label>
        <label className="flex flex-col">
          <span className="text-sm">Start</span>
          <input type="date" className="border rounded-md p-2" value={range.start} onChange={e => setRange(r => ({...r, start: e.target.value}))}/>
        </label>
        <label className="flex flex-col">
          <span className="text-sm">End</span>
          <input type="date" className="border rounded-md p-2" value={range.end} onChange={e => setRange(r => ({...r, end: e.target.value}))}/>
        </label>
      </div>

      <div className="h-64 w-full border rounded-md p-2 bg-white">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-lg">
        Unique clients: <strong>{uniqueClients ?? "—"}</strong>
      </div>
    </div>
  );
}
