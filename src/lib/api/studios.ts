//src/lib/api/studios.ts
import { api } from "./base";
import type { operations } from "./schema";

export type StudioDTO = operations["getStudio"]["responses"][200]["content"]["*/*"];
export type StudioCreateUpdate = operations["createStudio"]["requestBody"]["content"]["application/json"];

export function getAllStudios(): Promise<StudioDTO[]> {
  return api<StudioDTO[]>(`/api/studios`, { method: "GET" });
}

export function getStudio(id: number): Promise<StudioDTO> {
  return api<StudioDTO>(`/api/studios/${id}`, { method: "GET" });
}

export function createStudio(data: StudioCreateUpdate): Promise<StudioDTO> {
  return api<StudioDTO>(`/api/studios`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateStudio(id: number, data: StudioCreateUpdate): Promise<StudioDTO> {
  return api<StudioDTO>(`/api/studios/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteStudio(id: number): Promise<void> {
  return api<void>(`/api/studios/${id}`, { method: "DELETE" });
}
