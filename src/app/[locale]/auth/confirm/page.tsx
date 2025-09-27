//src/app/[locale]/auth/confirm/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { confirmEmail } from "@/src/lib/api/auth";

export default function ConfirmEmailPage() {
  const t = useTranslations();
  const sp = useSearchParams();
  const router = useRouter();
  const locale = useLocale();

  const [state, setState] = useState<"loading"|"ok"|"err">("loading");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    const token = sp.get("token");
    if (!token) { setState("err"); setMsg("Missing token"); return; }
    (async () => {
      try {
        const text = await confirmEmail(token);
        setMsg(text || "OK");
        setState("ok");
        setTimeout(() => router.replace(`/${locale}/auth/login`), 1500);
      } catch (e:any) {
        setMsg(e?.message || "Failed");
        setState("err");
      }
    })();
  }, [sp, router, locale]);

  return (
    <section className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-2">Email confirmation</h1>
      {state==="loading" && <div>...</div>}
      {state!=="loading" && <div className={state==="ok"?"text-green-700":"text-red-700"}>{msg}</div>}
    </section>
  );
}
