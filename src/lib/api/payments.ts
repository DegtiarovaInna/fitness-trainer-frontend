import { api } from "./base";
import type { operations } from "./schema";


export type PaymentDTO = operations["create"]["responses"][200]["content"]["*/*"];
export type PaymentCreate = operations["create"]["requestBody"]["content"]["application/json"];
export type PaymentSearchParams = NonNullable<
  operations["search"]["parameters"]["query"]
>;
export type PaymentPage = operations["search"]["responses"][200]["content"]["*/*"];
export type PaymentGet = operations["get"]["responses"][200]["content"]["*/*"];


export function searchPayments(params?: PaymentSearchParams): Promise<PaymentPage> {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : "";
  return api<PaymentPage>(`/api/payments${query}`, { method: "GET" });
}


export function createPayment(data: PaymentCreate): Promise<PaymentDTO> {
  return api<PaymentDTO>(`/api/payments`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}


export function getPayment(id: number): Promise<PaymentGet> {
  return api<PaymentGet>(`/api/payments/${id}`, { method: "GET" });
}


export function refundPayment(id: number, amountCents: number): Promise<void> {
  const query = `?amountCents=${encodeURIComponent(amountCents)}`;
  return api<void>(`/api/payments/${id}/refund${query}`, { method: "POST" });
}
