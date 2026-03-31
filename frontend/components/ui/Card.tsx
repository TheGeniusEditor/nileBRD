import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

type CardVariant = "default" | "elevated" | "outlined" | "glass" | "gradient-subtle";

const variantClasses: Record<CardVariant, string> = {
  default:
    "rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200",
  elevated:
    "rounded-xl border border-slate-200 bg-white p-5 shadow-md transition-all duration-200",
  outlined:
    "rounded-xl border-2 border-slate-200 bg-transparent p-5 transition-all duration-200",
  glass:
    "rounded-xl glass-effect p-5 transition-all duration-200",
  "gradient-subtle":
    "rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200",
};

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  hoverable?: boolean;
};

export function Card({
  className,
  variant = "default",
  hoverable = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        variantClasses[variant],
        hoverable && "hover:border-slate-300 hover:shadow-md cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}
