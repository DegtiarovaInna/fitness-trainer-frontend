// src/app/[locale]/admin/studios/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getAllStudios, createStudio, updateStudio, deleteStudio, type StudioDTO } from "@/src/lib/api/studios";
import toast from "react-hot-toast";

export default function AdminStudiosPage() {
  const [studios, setStudios] = useState<StudioDTO[]>([]);
  const [q, setQ] = useState("");

  async function load() {
    try {
      const s = await getAllStudios();
      setStudios(s);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load studios");
    }
  }

  useEffect(() => { load(); }, []);

  async function onCreate() {
    const name = prompt("Name");
    const address = name ? prompt("Address") : null;
    if (!name || !address) return;
    await createStudio({ name, address });
    toast.success("Created");
    await load();
  }

  async function onEdit(st: StudioDTO) {
    const name = prompt("Name", st.name || "");
    const address = name !== null ? prompt("Address", st.address || "") : null;
    if (name === null || address === null) return;
    await updateStudio(st.id!, { name, address });
    toast.success("Updated");
    await load();
  }

  async function onDelete(st: StudioDTO) {
    if (!confirm(`Delete "${st.name}"?`)) return;
    await deleteStudio(st.id!);
    toast.success("Deleted");
    await load();
  }

  const filtered = q
    ? studios.filter(s =>
        (s.name || "").toLowerCase().includes(q.toLowerCase()) ||
        (s.address || "").toLowerCase().includes(q.toLowerCase())
      )
    : studios;

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <input
          className="border rounded px-3 py-2"
          placeholder="Search..."
          value={q}
          onChange={e=>setQ(e.target.value)}
        />
        <button className="btn-primary" onClick={onCreate}>+ New</button>
      </div>

      <table className="min-w-[700px] w-full border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Address</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(st => (
            <tr key={st.id} className="border-t">
              <td className="p-2">{st.id}</td>
              <td className="p-2">{st.name}</td>
              <td className="p-2">{st.address}</td>
              <td className="p-2">
                <button className="btn mr-2" onClick={() => onEdit(st)}>Edit</button>
                <button className="btn-danger" onClick={() => onDelete(st)}>Delete</button>
              </td>
            </tr>
          ))}
          {!filtered.length && (
            <tr><td className="p-2 text-sm text-gray-600" colSpan={4}>No items</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
