// src/app/[locale]/profile/password/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuthStore } from "@/src/stores/auth";
import { changeMyPassword } from "@/src/lib/api/users";

export default function ProfilePasswordPage() {
  const t = useTranslations("profile");
  const locale = useLocale() as "ru" | "uk" | "de";
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      router.replace(`/${locale}/auth/login?returnTo=/${locale}/profile/password`);
    }
  }, [accessToken, locale, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setChanging(true);
      await changeMyPassword({ oldPassword: oldPwd, newPassword: newPwd } as any);
      toast.success(t("passwordChanged"));
      setOldPwd(""); setNewPwd("");
      router.push(`/${locale}/profile`);
    } catch (e: any) {
      toast.error(e?.message || "Failed to change password");
    } finally {
      setChanging(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{t("changePassword")}</h1>
      <form onSubmit={onSubmit} className="space-y-3 border rounded p-4">
        <label className="flex flex-col">
          <span className="text-sm">{t("oldPassword")}</span>
          <input type="password" className="border rounded p-2" value={oldPwd} onChange={e => setOldPwd(e.target.value)} />
        </label>
        <label className="flex flex-col">
          <span className="text-sm">{t("newPassword")}</span>
          <input type="password" className="border rounded p-2" value={newPwd} onChange={e => setNewPwd(e.target.value)} />
        </label>
        <div className="flex gap-2">
          <button className="btn-primary" disabled={changing}>{t("changePassword")}</button>
          <button type="button" className="btn" onClick={() => router.push(`/${locale}/profile`)}>
            {t("back")}
          </button>
        </div>
      </form>
    </section>
  );
}
