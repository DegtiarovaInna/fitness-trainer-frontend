import { api } from "./base";
import type { operations } from "./schema";


export type TimeSlotDTO = operations["getTimeSlot"]["responses"][200]["content"]["*/*"];
export type TimeSlotCreate = operations["createTimeSlot"]["requestBody"]["content"]["application/json"];
export type TimeSlotUpdate = operations["updateTimeSlot"]["requestBody"]["content"]["application/json"];


export function getAllTimeSlots(): Promise<TimeSlotDTO[]> {
  return api<TimeSlotDTO[]>(`/api/timeslots`, { method: "GET" });
}


export function createTimeSlot(data: TimeSlotCreate): Promise<TimeSlotDTO> {
  return api<TimeSlotDTO>(`/api/timeslots`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}


export function getTimeSlot(id: number): Promise<TimeSlotDTO> {
  return api<TimeSlotDTO>(`/api/timeslots/${id}`, { method: "GET" });
}


export function updateTimeSlot(id: number, data: TimeSlotUpdate): Promise<TimeSlotDTO> {
  return api<TimeSlotDTO>(`/api/timeslots/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}


export function deleteTimeSlot(id: number): Promise<void> {
  return api<void>(`/api/timeslots/${id}`, { method: "DELETE" });
}


export async function getAvailableByStudio(
  studioId: number,
  start: string,
  end: string
) {
  return api<TimeSlotDTO[]>(
    `/api/timeslots/studio/${studioId}/available?start=${start}&end=${end}`,
    { method: "GET" }
  );
}