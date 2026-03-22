"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { approvals as seedApprovals } from "@/lib/mockData";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState(seedApprovals);
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = approvals.find((item) => item.id === activeId);

  const updateStatus = (status: string) => {
    if (!activeId) return;
    setApprovals((prev) => prev.map((item) => (item.id === activeId ? { ...item, status } : item)));
    setActiveId(null);
  };

  return (
    <div className="space-y-4">
      {approvals.map((item) => (
        <Card key={item.id} className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase text-slate-500">{item.docType}</p>
            <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={item.status} />
            <Button variant="secondary" onClick={() => setActiveId(item.id)}>
              Review
            </Button>
          </div>
        </Card>
      ))}

      <Modal isOpen={Boolean(active)} title={active?.title || "Approval"} onClose={() => setActiveId(null)}>
        <p className="mb-4 text-sm text-slate-600">Review the generated artifact and choose an action.</p>
        <div className="flex gap-2">
          <Button onClick={() => updateStatus("Approved")}>Approve</Button>
          <Button variant="danger" onClick={() => updateStatus("Rejected")}>
            Request Changes
          </Button>
        </div>
      </Modal>
    </div>
  );
}
