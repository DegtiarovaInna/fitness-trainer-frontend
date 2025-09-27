// src/app/[locale]/book/page.tsx
export { metadata } from "./metadata";
import BookingClient from "./ui/BookingClient";

export default function BookPage() {
  // ВАЖНО: это серверный компонент (без "use client").
  // Клиентский <BookingClient /> безопасно рендерим внутри.
  return <BookingClient />;
}
