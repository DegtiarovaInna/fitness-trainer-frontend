// src/lib/details/fetchers.ts
import { getTimeSlot } from "@/src/lib/api/timeslots";
import { getStudio } from "@/src/lib/api/studios";
import type { TimeSlotDTO } from "@/src/lib/api/timeslots";
import type { StudioDTO } from "@/src/lib/api/studios";
import { mapCache } from "./cache";

const slotCache = mapCache<number, TimeSlotDTO>();
const studioCache = mapCache<number, StudioDTO>();

export async function getSlotCached(id: number): Promise<TimeSlotDTO> {
  const c = slotCache.get(id);
  if (c) return c;
  const data = await getTimeSlot(id);
  slotCache.set(id, data);
  return data;
}
export async function getStudioCached(id: number): Promise<StudioDTO> {
  const c = studioCache.get(id);
  if (c) return c;
  const data = await getStudio(id);
  studioCache.set(id, data);
  return data;
}
