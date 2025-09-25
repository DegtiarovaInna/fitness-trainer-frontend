// src/lib/api/base.ts
import Cookies from "js-cookie";

type Extra = {
  auth?: boolean;
};


export async function api<T>(
  path: string,
  options: RequestInit = {},
  extra: Extra = { auth: true }
): Promise<T> {
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


  const doFetch = async (): Promise<Response> =>
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

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
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
      });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}