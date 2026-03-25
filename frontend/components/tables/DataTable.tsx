"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const handlePrevious = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <Card variant="elevated" hoverable className="overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {rows.length} Records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {pagedRows.length > 0 ? (
              pagedRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 group"
                >
                  {columns.map((column) => (
                    <td
                      key={column}
                      className="px-6 py-4 text-slate-700 group-hover:text-slate-900 font-medium transition-colors"
                    >
                      {String(row[column])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
        <p className="text-xs font-medium text-slate-600">
          Page <span className="font-bold text-slate-900">{page + 1}</span> of{" "}
          <span className="font-bold text-slate-900">{totalPages}</span>
          {" •  "}
          <span className="font-bold text-slate-900">{Math.min(pagedRows.length, pageSize)}</span> of{" "}
          <span className="font-bold text-slate-900">{rows.length}</span> Records
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={page === 0}
            className="inline-flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={handleNext}
            disabled={page === totalPages - 1}
            className="inline-flex items-center gap-2"
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
