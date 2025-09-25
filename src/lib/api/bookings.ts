import { api } from "./base";
import type { operations } from "./schema";


export type BookingDTO = operations["getBooking"]["responses"][200]["content"]["*/*"];
export type BookingCreateForUser = operations["createBookingForUser"]["requestBody"]["content"]["application/json"];
export type BookingCreateOwn = operations["createOwnBooking"]["requestBody"]["content"]["application/json"];
export type BookingUpdate = operations["updateBooking"]["requestBody"]["content"]["application/json"];


export function getAllBookings(): Promise<BookingDTO[]> {
  return api<BookingDTO[]>(`/api/bookings`, { method: "GET" });
}


export function createBookingForUser(data: BookingCreateForUser): Promise<BookingDTO> {
  return api<BookingDTO>(`/api/bookings`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}


export function createOwnBooking(data: BookingCreateOwn): Promise<BookingDTO> {
  return api<BookingDTO>(`/api/bookings/me`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getBooking(id: number): Promise<BookingDTO> {
  return api<BookingDTO>(`/api/bookings/${id}`, { method: "GET" });
}

export function updateBooking(id: number, data: BookingUpdate): Promise<BookingDTO> {
  return api<BookingDTO>(`/api/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function cancelBooking(id: number): Promise<BookingDTO> {
  return api<BookingDTO>(`/api/bookings/${id}/cancel`, { method: "PUT" });
}

export function getMyUpcoming(): Promise<BookingDTO[]> {
  return api<BookingDTO[]>(`/api/bookings/me/upcoming`, { method: "GET" });
}


export function getMyHistory(): Promise<BookingDTO[]> {
  return api<BookingDTO[]>(`/api/bookings/me/history`, { method: "GET" });
}