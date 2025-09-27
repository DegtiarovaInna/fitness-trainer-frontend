// src/lib/api/base.ts
import { fakeApi } from "./fake";
import Cookies from "js-cookie";

type Extra = { auth?: boolean };

export async function api<T>(
  path: string,
  options: RequestInit = {},
  extra: Extra = { auth: true }
): Promise<T> {
  // <<< ДОБАВКА: ранний выход в режиме фейка
  if (process.env.NEXT_PUBLIC_FAKE_API === "1") {
    // @ts-expect-error generic passthrough
    return fakeApi<T>({ path, options });
  }
  // >>> КОНЕЦ ДОБАВКИ

  const base = process.env.NEXT_PUBLIC_API_URL!;
  const url = `${base}${path}`;

  const headers = new Headers({
    "Content-Type": "application/json",
    ...(options.headers || {}),
  });

  if (extra.auth !== false) {
    const at = Cookies.get("accessToken");
    if (at) headers.set("Authorization", `Bearer ${at}`);
  }

  const doFetch = () =>
    fetch(url, {
      ...options,
      credentials: "include",
      headers,
    });

  let res = await doFetch();

  if (res.status === 401 && extra.auth !== false) {
    const ok = await trySilentRefresh();
    if (ok) {
      const newAt = Cookies.get("accessToken");
      if (newAt) headers.set("Authorization", `Bearer ${newAt}`);
      res = await doFetch();
    }
  }

  if (res.ok) {
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    if (!text) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }

  let message = `HTTP ${res.status}`;
  try {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await res.json();
      message = data?.message || data?.error || JSON.stringify(data) || message;
    } else {
      message = (await res.text()) || message;
    }
  } catch {
    // ignore
  }
  throw new Error(message);
}

async function trySilentRefresh(): Promise<boolean> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL!;
    const res = await fetch(`${base}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return false;

    const data = (await res.json()) as { accessToken?: string | null };
    if (data?.accessToken) {
      Cookies.set("accessToken", data.accessToken, {
        sameSite: "lax",
        path: "/",
      });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
