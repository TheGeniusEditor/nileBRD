import { cn } from "@/lib/utils";

const badgeStyles = {
  Pending: "bg-amber-100 text-amber-800 border border-amber-200",
  Approved: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  Rejected: "bg-rose-100 text-rose-800 border border-rose-200",
  "In Progress": "bg-blue-100 text-blue-800 border border-blue-200",
  Submitted: "bg-indigo-100 text-indigo-800 border border-indigo-200",
  Completed: "bg-emerald-100 text-emerald-800 border border-emerald-200",
};

type StatusType = keyof typeof badgeStyles;
type BadgeVariant = "solid" | "outline" | "soft";

const baseVariants: Record<BadgeVariant, string> = {
  solid: "px-3 py-1.5 text-xs font-semibold rounded-full border-0",
  outline: "px-3 py-1.5 text-xs font-semibold rounded-full border-2 bg-transparent",
  soft: "px-3 py-1.5 text-xs font-semibold rounded-lg",
};

export function StatusBadge({
  status,
  variant = "solid",
}: {
  status: StatusType | string;
  variant?: BadgeVariant;
}) {
  const tone = badgeStyles[status as StatusType] || "bg-slate-100 text-slate-700 border border-slate-200";
  return (
    <span
      className={cn(
        baseVariants[variant],
        tone,
        "inline-flex items-center gap-1.5 transition-all duration-200 hover-scale"
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}