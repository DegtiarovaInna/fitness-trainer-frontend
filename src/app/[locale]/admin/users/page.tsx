// src/app/[locale]/admin/users/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { getAllUsers } from "@/src/lib/api/users";
import type { UserDTO } from "@/src/lib/api/users";
import Pagination from "@/src/components/ui/Pagination";

export { metadata } from "../metadata";

export default function AdminUsersPage() {
  const t = useTranslations();
  const [all, setAll] = useState<UserDTO[]>([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    getAllUsers().then(setAll).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const norm = q.trim().toLowerCase();
    if (!norm) return all;
    return all.filter(u =>
      (u.name || "").toLowerCase().includes(norm) ||
      (u.email || "").toLowerCase().includes(norm)
    );
  }, [all, q]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  useEffect(() => setPage(1), [q]);

  return (
    <section className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Admin — Users</h1>

      <div className="flex items-center justify-between">
        <input
          className="border rounded px-3 py-2"
          placeholder="Search by name/email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Pagination page={page} pageSize={pageSize} total={filtered.length} onChange={setPage} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((u) => (
              <tr key={u.id}>
                <td className="p-2 border">{u.id}</td>
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.role}</td>
              </tr>
            ))}
            {!pageItems.length && (
              <tr><td className="p-3 text-center text-gray-500" colSpan={4}>—</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
