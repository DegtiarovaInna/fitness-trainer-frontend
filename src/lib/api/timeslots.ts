// src/lib/api/timeslots.ts
import { api } from "./base";
import type { operations } from "./schema";

export type TimeSlotDTO = operations["getTimeSlot"]["responses"][200]["content"]["*/*"];

export function getAvailableByStudio(studioId: number, start: string, end: string): Promise<TimeSlotDTO[]> {
  const qs = `?${new URLSearchParams({ start, end }).toString()}`;
  return api<TimeSlotDTO[]>(`/api/timeslots/studio/${studioId}/available${qs}`, { method: "GET" });
}

export function getTimeSlot(id: number): Promise<TimeSlotDTO> {
  return api<TimeSlotDTO>(`/api/timeslots/${id}`, { method: "GET" });
}

