import { api } from "./base";
import type { operations } from "./schema";


export type StudioDTO = operations["getStudio"]["responses"][200]["content"]["*/*"];
export type StudioCreate = operations["createStudio"]["requestBody"]["content"]["application/json"];
export type StudioUpdate = operations["updateStudio"]["requestBody"]["content"]["application/json"];


export function getAllStudios(): Promise<StudioDTO[]> {
  return api<StudioDTO[]>(`/api/studios`, { method: "GET" });
}


export function createStudio(data: StudioCreate): Promise<StudioDTO> {
  return api<StudioDTO>(`/api/studios`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}


export function getStudio(id: number): Promise<StudioDTO> {
  return api<StudioDTO>(`/api/studios/${id}`, { method: "GET" });
}


export function updateStudio(id: number, data: StudioUpdate): Promise<StudioDTO> {
  return api<StudioDTO>(`/api/studios/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}


export function deleteStudio(id: number): Promise<void> {
  return api<void>(`/api/studios/${id}`, { method: "DELETE" });
}


export function getOccupancy(
  studioId: number,
  start: string,
  end: string
): Promise<Record<string, number>> {
  return api<Record<string, number>>(
    `/api/studios/${studioId}/occupancy?start=${start}&end=${end}`,
    { method: "GET" }
  );
}


export function getUniqueClientsCount(
  studioId: number,
  start: string,
  end: string
): Promise<number> {
  return api<number>(
    `/api/studios/${studioId}/unique-clients?start=${start}&end=${end}`,
    { method: "GET" }
  );
}


export function getUniqueClientsByStudio(
  studioId: number
): Promise<UserDTO[]> {
  return api<UserDTO[]>(
    `/api/studios/${studioId}/clients`,
    { method: "GET" }
  );
}