//src/app/[locale]/profile/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuthStore } from "@/src/stores/auth";
import { getMe, updateMe } from "@/src/lib/api/users";

export default function ProfileEditPage() {
  const t = useTranslations("profile");
  const locale = useLocale() as "ru" | "uk" | "de";
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      router.replace(`/${locale}/auth/login?returnTo=/${locale}/profile/edit`);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const me = await getMe();
        setName(me.name || "");
        setPhone(me.phoneNumber || "");
      } catch (e: any) {
        toast.error(e?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken, locale, router]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      await updateMe({ name, phoneNumber: phone } as any);
      toast.success(t("saved"));
      router.push(`/${locale}/profile`);
    } catch (e: any) {
      toast.error(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-4">Loading…</div>;

  return (
    <section className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{t("editTitle")}</h1>

      <form onSubmit={saveProfile} className="space-y-3 border rounded p-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="flex flex-col">
            <span className="text-sm">Name</span>
            <input className="border rounded p-2" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="flex flex-col">
            <span className="text-sm">Phone</span>
            <input className="border rounded p-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
        </div>
        <div className="flex gap-2">
          <button className="btn-success" disabled={saving}>{t("save")}</button>
          <button type="button" className="btn" onClick={() => router.push(`/${locale}/profile`)}>
            {t("back")}
          </button>
        </div>
      </form>

      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">{t("changePassword")}</h2>
        <button className="btn" onClick={() => router.push(`/${locale}/profile/password`)}>
          {t("goToPasswordPage")}
        </button>
      </div>
    </section>
  );
}
