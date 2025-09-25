// src/lib/api/auth.ts
import { api } from "./base";
import type { operations } from "./schema";


export type RegisterRequest = operations["registerUser"]["requestBody"]["content"]["application/json"];
export type RegisterResponse = operations["registerUser"]["responses"][200]["content"]["*/*"];
export type LoginResponse   = operations["login"]["responses"][200]["content"]["*/*"];
export type ConfirmEmailResponse = operations["confirmEmail"]["responses"][200]["content"]["*/*"];
export type ResendConfirmationParams = operations["resendConfirmation"]["parameters"]["query"];
export type RequestResetParams = operations["requestReset"]["parameters"]["query"];
export type ResetPasswordParams = operations["resetPassword"]["parameters"]["query"];


export function register(data: RegisterRequest): Promise<RegisterResponse> {
  return api<RegisterResponse>(
    `/auth/register`,
    { method: "POST", body: JSON.stringify(data) },
    { auth: false }
  );
}


export function login(email: string, password: string): Promise<LoginResponse> {
  const q = `?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
  return api<LoginResponse>(`/auth/login${q}`, { method: "POST" }, { auth: false });
}


export function refreshViaCookie(): Promise<{ accessToken: string | null }> {
  return api<{ accessToken: string | null }>(`/auth/refresh`, { method: "POST" }, { auth: false });
}


export function confirmEmail(token: string): Promise<void> {
  const q = `?token=${encodeURIComponent(token)}`;
  return api<void>(`/auth/confirm${q}`, { method: "GET" }, { auth: false });
}


export function resendConfirmation(params: ResendConfirmationParams): Promise<void> {
  const q = `?email=${encodeURIComponent(params.email)}`;
  return api<void>(`/auth/resend${q}`, { method: "POST" }, { auth: false });
}


export function requestReset(params: RequestResetParams): Promise<void> {
  const q = `?email=${encodeURIComponent(params.email)}`;
  return api<void>(`/auth/reset/request${q}`, { method: "POST" }, { auth: false });
}


export function resetPassword(params: ResetPasswordParams): Promise<void> {
  const q = `?token=${encodeURIComponent(params.token)}&newPassword=${encodeURIComponent(params.newPassword)}`;
  return api<void>(`/auth/resetPassword${q}`, { method: "POST" }, { auth: false });
}


export function checkResetToken(token: string): Promise<void> {
  const q = `?token=${encodeURIComponent(token)}`;
  return api<void>(`/auth/reset${q}`, { method: "GET" }, { auth: false });
}