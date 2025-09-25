// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const entry = document.cookie.split("; ").find((r) => r.startsWith(name + "="));
  return entry?.split("=")[1];
}

export default function Header() {
  const t = useTranslations();
  const locale = useLocale() as "ru" | "uk" | "de";
  const pathname = usePathname();
  const router = useRouter();

  const [isAuth, setIsAuth] = useState<boolean>(Boolean(getCookie("accessToken")));

  useEffect(() => {
    const i = setInterval(() => setIsAuth(Boolean(getCookie("accessToken"))), 1000);
    return () => clearInterval(i);
  }, []);

  // базовый префикс для ссылок текущей локали
  const L = `/${locale}`;

  const menu = [
    { key: "menu.home", href: `${L}` },
    { key: "menu.about", href: `${L}/about` },
    { key: "menu.services", href: `${L}/services` },
    { key: "menu.book", href: `${L}/book` },
    { key: "menu.blog", href: `${L}/blog` },
  ];

  // CHANGED: строго меняем первый сегмент локали и не плодим историю
  function changeLocale(next: "ru" | "uk" | "de") {
    const newPath = pathname.replace(/^\/(ru|uk|de)(?=\/|$)/, `/${next}`);
    router.replace(newPath);
  }

  // CHANGED: показываем "UA", хотя код локали — "uk"
  const labels: Record<"ru" | "uk" | "de", string> = { ru: "RU", uk: "UA", de: "DE" };

  return (
    <header className="h-16 bg-white/80 backdrop-blur sticky top-0 z-40 border-b">
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Лого/бренд */}
        <Link href={L} className="text-brand text-xl font-bold">
          Fitness Trainer
        </Link>

        {/* Меню */}
        <nav className="hidden md:flex gap-6 items-center">
          {menu.map((item) => (
            <Link key={item.key} href={item.href} className="text-gray-700 hover:text-brand-dark">
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Правый блок */}
        <div className="flex items-center gap-3">
          <Link href={`${L}/book`} className="btn-primary hidden sm:inline-block">
            {t("cta.book")}
          </Link>

          {/* CHANGED: единственный переключатель локали (вынеси лишний вышеудалённый блок) */}
          <div className="flex items-center gap-1 border rounded-md px-2 py-1">
            {(["ru", "uk", "de"] as const).map((lng) => (
              <button
                key={lng}
                onClick={() => changeLocale(lng)}
                className={`text-sm px-1 ${locale === lng ? "font-semibold underline" : ""}`}
                aria-label={`Switch to ${labels[lng]}`}
              >
                {labels[lng]}
              </button>
            ))}
          </div>

          {isAuth ? (
            <Link href={`${L}/profile`} className="text-gray-700 hover:text-brand-dark">
              {t("menu.profile")}
            </Link>
          ) : (
            <Link href={`${L}/auth/login`} className="text-gray-700 hover:text-brand-dark">
              {t("auth.login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}