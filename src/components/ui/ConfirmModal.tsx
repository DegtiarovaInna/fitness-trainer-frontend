// src/components/ui/ConfirmModal.tsx
"use client";
import { useTranslations } from "next-intl";

type Props = {
  open: boolean;
  title?: string;
  text?: string;
  onConfirm: () => void;
  onCancel: () => void;
};
export default function ConfirmModal({ open, title, text, onConfirm, onCancel }: Props) {
  const t = useTranslations("common");
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 shadow max-w-sm w-full">
        <h3 className="font-semibold text-lg mb-2">{title ?? "Confirm"}</h3>
        <p className="text-sm text-gray-700 mb-4">{text ?? ""}</p>
        <div className="flex gap-2 justify-end">
          <button className="btn" onClick={onCancel}>{t("close")}</button>
          <button className="btn-danger" onClick={onConfirm}>{t("confirm")}</button>
        </div>
      </div>
    </div>
  );
}


