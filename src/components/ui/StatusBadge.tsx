// src/components/ui/StatusBadge.tsx
"use client";
import { useTranslations } from "next-intl";

export default function StatusBadge({ status }: { status: "PENDING"|"CONFIRMED"|"CANCELLED"|"PAYMENT_FAILED" }) {
  const t = useTranslations("status");
  const map: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-gray-200 text-gray-700",
    PAYMENT_FAILED: "bg-red-100 text-red-700"
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${map[status] || "bg-gray-100"}`}>
      {t(status)}
    </span>
  );
}
