//src/app/[locale]/auth/login/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { login as apiLogin } from "@/src/lib/api/auth";
import { useAuthStore } from "@/src/stores/auth";

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale() as "ru" | "uk" | "de";
  const router = useRouter();
  const search = useSearchParams();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const returnTo = search.get("returnTo");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const { accessToken } = await apiLogin(email, password);
      setAccessToken(accessToken || null);

      if (returnTo && returnTo.startsWith("/")) {
        router.replace(returnTo);
        return;
      }
      router.replace(`/${locale}`);
    } catch (err: any) {
      setError(err?.message || t("errors.unknown"));
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">{t("login")}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">{t("email")}</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">{t("password")}</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="btn-primary w-full">{t("login")}</button>
      </form>

      <p className="mt-4 text-center">
        {t("noAccount")}{" "}
        <a href={`/${locale}/auth/register`} className="text-accent underline">
          {t("register")}
        </a>
      </p>
    </div>
  );
}
