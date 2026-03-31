import { cn } from "@/lib/utils";

const badgeStyles: Record<string, string> = {
  "Pending":      "bg-amber-50  text-amber-700  border-amber-200",
  "Approved":     "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Completed":    "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Rejected":     "bg-rose-50   text-rose-700   border-rose-200",
  "In Progress":  "bg-blue-50   text-blue-700   border-blue-200",
  "Submitted":    "bg-indigo-50 text-indigo-600  border-indigo-200",
  "BA Assigned":  "bg-violet-50 text-violet-700  border-violet-200",
  "BRD":          "bg-sky-50    text-sky-700     border-sky-200",
  "FRD":          "bg-cyan-50   text-cyan-700    border-cyan-200",
  "Dev":          "bg-amber-50  text-amber-700   border-amber-200",
  "UAT":          "bg-teal-50   text-teal-700    border-teal-200",
  "Closed":       "bg-slate-100 text-slate-500   border-slate-200",
  "Pass":         "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Fail":         "bg-rose-50   text-rose-700   border-rose-200",
  "High":         "bg-orange-50 text-orange-700 border-orange-200",
  "Medium":       "bg-amber-50  text-amber-700  border-amber-200",
  "Low":          "bg-slate-100 text-slate-500   border-slate-200",
  "Critical":     "bg-rose-50   text-rose-700   border-rose-200",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = badgeStyles[status] ?? "bg-slate-100 text-slate-500 border-slate-200";
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
      tone,
    )}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
