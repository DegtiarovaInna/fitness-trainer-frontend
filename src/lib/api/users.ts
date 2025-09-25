import { api } from "./base";
import type { operations } from "./schema";

export type UserDTO = operations["getUser"]["responses"][200]["content"]["*/*"];
export type UpdateUserRequest = operations["updateUser"]["requestBody"]["content"]["application/json"];
export type ChangePasswordRequest = operations["changePassword"]["requestBody"]["content"]["application/json"];


export function getUser(
  id: number
): Promise<UserDTO> {
  return api<UserDTO>(`/api/users/${id}`, { method: "GET" });
}


export function updateMe(
  data: UpdateUserRequest
): Promise<UserDTO> {
  return api<UserDTO>(`/api/users/me`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}


export function changeMyPassword(
  data: ChangePasswordRequest
): Promise<void> {
  return api<void>(`/api/users/me/password`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}


export function getAllUsers(): Promise<UserDTO[]> {
  return api<UserDTO[]>(`/api/users`, { method: "GET" });
}


export function deleteUser(
  id: number
): Promise<void> {
  return api<void>(`/api/users/${id}`, { method: "DELETE" });
}


export function updateUser(
  id: number,
  data: UpdateUserRequest
): Promise<UserDTO> {
  return api<UserDTO>(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}


export function changePassword(
  id: number,
  data: ChangePasswordRequest
): Promise<void> {
  return api<void>(`/api/users/${id}/password`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}



export function getMe(): Promise<UserDTO> {
  return api<UserDTO>(`/api/users/me`, { method: "GET" });
}