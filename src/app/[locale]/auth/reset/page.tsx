//src/app/[locale]/auth/reset/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { checkResetToken, resetPassword } from "@/src/lib/api/auth";

export default function ResetPasswordPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const locale = useLocale();

  const token = sp.get("token") ?? "";
  const [valid, setValid] = useState<boolean | null>(null);
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) { setValid(false); return; }
    (async () => {
      try { await checkResetToken(token); setValid(true); }
      catch { setValid(false); }
    })();
  }, [token]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !pass) return;
    setBusy(true);
    try {
      await resetPassword(token, pass);
      setMsg("Password updated");
      setTimeout(() => router.replace(`/${locale}/auth/login`), 1200);
    } catch (e:any) {
      setMsg(e?.message || "Failed");
    } finally { setBusy(false); }
  }

  if (valid === null) return <div className="p-6 text-center">...</div>;
  if (valid === false) return <div className="p-6 text-center text-red-700">Invalid token</div>;

  return (
    <section className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Set new password</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="password"
          className="w-full border rounded-md p-2"
          placeholder="New password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button className="btn-success" disabled={busy}>Save</button>
      </form>
      {msg && <div className="text-sm">{msg}</div>}
    </section>
  );
}
