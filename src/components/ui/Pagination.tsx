// src/components/ui/Pagination.tsx
"use client";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
};

export default function Pagination({ page, pageSize, total, onChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        className="btn"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        ‹
      </button>
      <span className="text-sm">
        {page} / {totalPages}
      </span>
      <button
        className="btn"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        ›
      </button>
    </div>
  );
}
