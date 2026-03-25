import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success" | "outline" | "gradient-primary";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 border border-slate-200",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200",
  danger: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm hover:shadow-md",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm hover:shadow-md",
  outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100",
  "gradient-primary": "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg active:shadow-md",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-out cursor-pointer",
        "focus:outline-none focus-ring",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        !disabled && "hover-lift",
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2 inline-block animate-spin">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      {children}
    </button>
  );
}