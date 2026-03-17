"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/DataTable";
import { usePortal } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type TestCase } from "@/data/types";

const columns: ColumnDef<TestCase>[] = [
  { accessorKey: "id", header: "Test Case" },
  {
    accessorKey: "status",
    header: "Result",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = status === "Pass" ? "success" : status === "Fail" ? "danger" : "warning";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  { accessorKey: "executedBy", header: "Executed By" },
  { accessorKey: "date", header: "Date" },
];

export default function SITTestingPage() {
  const { testCases, setWorkflowStatus } = usePortal();
  const passCount = testCases.filter((testCase) => testCase.status === "Pass").length;
  const failCount = testCases.filter((testCase) => testCase.status === "Fail").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Step 12: SIT Testing Dashboard</h2>
        <Button onClick={() => setWorkflowStatus("SIT Completed")}>Mark SIT Completed</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Execution Progress</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-900">{testCases.length} Total Cases</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pass</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-emerald-600">{passCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fail</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-rose-600">{failCount}</CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={testCases} />
    </div>
  );
}
