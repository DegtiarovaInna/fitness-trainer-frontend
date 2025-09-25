//src/app/[locale]/(protected)/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useAuthStore } from "@/stores/auth";
import { getMe } from "@/lib/api/users";
import { getMyUpcoming, getMyHistory } from "@/lib/api/bookings";

export default function ProfilePage() {
  const locale = useLocale();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [me, setMe] = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      try {
        const [me, up, hist] = await Promise.all([
          getMe(),
          getMyUpcoming(),
          getMyHistory()
        ]);
        setMe(me);
        setUpcoming(up);
        setHistory(hist);
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken]);

  if (!accessToken) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        Нужно войти в аккаунт. <a className="text-accent underline" href={`/${locale}/auth/login?returnTo=/${locale}/profile`}>Войти</a>
      </div>
    );
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto py-8 px-4 animate-pulse text-gray-500">Загружаем профиль…</div>;
  }

  return (
    <section className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Профиль</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Данные</h2>
          <div className="text-sm text-gray-700">
            <div><b>Имя:</b> {me?.name}</div>
            <div><b>Email:</b> {me?.email}</div>
            <div><b>Телефон:</b> {me?.phoneNumber}</div>
            <div><b>Роль:</b> {me?.role}</div>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Ближайшие бронирования</h2>
          {upcoming.length === 0 ? (
            <p className="text-gray-600">Нет записей</p>
          ) : (
            <ul className="text-sm space-y-2">
              {upcoming.map((b) => (
                <li key={b.id} className="border rounded p-2">
                  <div>ID {b.id} • слот {b.timeSlotId} • статус {b.status}</div>
                  <div className="text-gray-500">{new Date(b.createdAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded shadow p-4 mt-6">
        <h2 className="font-semibold mb-2">История</h2>
        {history.length === 0 ? (
          <p className="text-gray-600">Пусто</p>
        ) : (
          <ul className="text-sm grid md:grid-cols-2 gap-2">
            {history.map((b) => (
              <li key={b.id} className="border rounded p-2">
                <div>ID {b.id} • слот {b.timeSlotId} • {b.status}</div>
                <div className="text-gray-500">{new Date(b.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
