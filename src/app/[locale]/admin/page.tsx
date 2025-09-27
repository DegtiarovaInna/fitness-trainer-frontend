// src/app/[locale]/admin/page.tsx
export { metadata } from "./metadata";
"use client";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function AdminHome() {
  const locale = useLocale();
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Admin</h1>
      <ul className="list-disc pl-6 space-y-1">
        <li><Link href={`/${locale}/admin/users`}>Users</Link></li>
        <li><Link href={`/${locale}/admin/studios`}>Studios</Link></li>
        <li><Link href={`/${locale}/admin/bookings`}>Bookings</Link></li>
        <li><Link href={`/${locale}/admin/analytics`}>Analytics</Link></li>
      </ul>
    </div>
  );
}
