// src/lib/api/studio-analytics.ts
import { api } from "./base";

// /api/studios/{studioId}/occupancy -> { [date]: number }
export function getOccupancy(studioId: number, start: string, end: string): Promise<Record<string, number>> {
  const qs = `?${new URLSearchParams({ start, end })}`;
  return api<Record<string, number>>(`/api/studios/${studioId}/occupancy${qs}`, { method: "GET" });
}

// /api/studios/{studioId}/unique-clients -> number
export function getUniqueClientsNumber(studioId: number, start: string, end: string): Promise<number> {
  const qs = `?${new URLSearchParams({ start, end })}`;
  return api<number>(`/api/studios/${studioId}/unique-clients${qs}`, { method: "GET" });
}
