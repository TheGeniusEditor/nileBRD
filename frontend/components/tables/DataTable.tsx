"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Row = Record<string, string | number | boolean>;

export function DataTable({
  title,
  rows,
  pageSize = 5,
}: {
  title: string;
  rows: Row[];
  pageSize?: number;
}) {
  const [page, setPage] = useState(0);
  const columns = useMemo(() => Object.keys(rows[0] || {}), [rows]);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pagedRows = rows.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <Card>
      <h3 className="mb-4 text-base font-semibold text-slate-800">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              {columns.map((column) => (
                <th key={column} className="px-2 py-2">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-100 text-slate-700">
                {columns.map((column) => (
                  <td key={column} className="px-2 py-3">
                    {String(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Page {page + 1} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setPage((p) => Math.max(0, p - 1))}>
            Previous
          </Button>
          <Button variant="secondary" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}>
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
