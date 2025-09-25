// src/app/[locale]/register/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { register as apiRegister } from "@/lib/api/auth";

export default function RegisterPage() {
  const t = useTranslations("register");
  const ta = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiRegister({ name, email, password, phoneNumber });
      setDone(true);
    } catch (e: any) {
      setError(e?.message || "Error");
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-2">{t("successTitle")}</h2>
        <p className="text-gray-700">{t("successText")}</p>
        <button
          onClick={() => router.push(`/${locale}/auth/login`)}
          className="btn-primary w-full mt-6"
        >
          {t("toLogin")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">{t("title")}</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">{ta("name")}</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">{ta("email")}</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">{ta("phone")}</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={phoneNumber}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">{ta("password")}</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="btn-primary w-full">
          {t("submit")}
        </button>
        <p className="text-center text-sm mt-2">
          {ta("haveAccount")}{" "}
          <a className="text-accent underline" href={`/${locale}/auth/login`}>
            {ta("login")}
          </a>
        </p>
      </form>
    </div>
  );
}