import { cn } from "@/lib/utils";

const badgeStyles = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-rose-100 text-rose-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Submitted: "bg-indigo-100 text-indigo-800",
  Completed: "bg-emerald-100 text-emerald-800",
};

type StatusType = keyof typeof badgeStyles;

export function StatusBadge({ status }: { status: StatusType | string }) {
  const tone = badgeStyles[status as StatusType] || "bg-slate-100 text-slate-700";
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", tone)}>
      {status}
    </span>
  );
}