// src/stores/auth.ts
"use client";
import { create } from "zustand";
import Cookies from "js-cookie";

type AuthState = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: typeof window !== "undefined" ? Cookies.get("accessToken") ?? null : null,
  setAccessToken: (token) => {
    if (token) {
      Cookies.set("accessToken", token, { sameSite: "lax" });
    } else {
      Cookies.remove("accessToken");
    }
    set({ accessToken: token });
  },
  logout: () => {
    Cookies.remove("accessToken");
    set({ accessToken: null });

  },
}));