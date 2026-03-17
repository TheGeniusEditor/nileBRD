"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/DataTable";
import { usePortal } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { type Bug } from "@/data/types";

const columns: ColumnDef<Bug>[] = [
  { accessorKey: "id", header: "Bug ID" },
  { accessorKey: "severity", header: "Severity" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = status === "Resolved" ? "success" : status === "In Progress" ? "warning" : "danger";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  { accessorKey: "assignedTeam", header: "Assigned Team" },
  { accessorKey: "createdDate", header: "Created Date" },
];

export default function BugsPage() {
  const { bugs } = usePortal();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Step 14: Bug Tracking</h2>
      <DataTable columns={columns} data={bugs} />
    </div>
  );
}
