import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

type CardVariant = "default" | "elevated" | "outlined" | "glass" | "gradient-subtle";

const variantClasses: Record<CardVariant, string> = {
  default:
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_-15px_rgba(15,23,42,0.25)] transition-all duration-300",
  elevated:
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.2)] transition-all duration-300",
  outlined:
    "rounded-2xl border-2 border-slate-200 bg-transparent p-5 transition-all duration-300",
  glass:
    "rounded-2xl glass-effect p-5 transition-all duration-300",
  "gradient-subtle":
    "rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 p-5 shadow-[0_10px_30px_-15px_rgba(15,23,42,0.25)] transition-all duration-300",
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
        hoverable && "hover-lift cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}