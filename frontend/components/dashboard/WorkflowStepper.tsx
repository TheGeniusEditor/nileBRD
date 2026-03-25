import { CheckCircle, Circle } from "lucide-react";
import { type CSSProperties } from "react";

export function WorkflowStepper({
  steps,
  current,
}: {
  steps: string[];
  current: string;
}) {
  return (
    <div className="relative">
      {/* Connecting Line */}
      <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 hidden md:block" />

      <div className="grid gap-3 md:gap-0 md:grid-cols-6 relative z-10">
        {steps.map((step, index) => {
          const activeIndex = steps.indexOf(current);
          const state =
            index < activeIndex
              ? "complete"
              : index === activeIndex
                ? "active"
                : "pending";

          return (
            <div
              key={step}
              className="flex flex-col items-center animate-rise stagger-item"
              style={{
                "--stagger-delay": `${index * 60}ms`,
              } as CSSProperties}
            >
              {/* Icon/Circle */}
              <div className="mb-3 relative">
                {state === "complete" && (
                  <div className="rounded-full bg-emerald-100 p-2 shadow-md">
                    <CheckCircle size={20} className="text-emerald-600" />
                  </div>
                )}
                {state === "active" && (
                  <div className="rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 p-2 shadow-lg relative">
                    <Circle size={20} className="text-blue-600 animate-pulse-glow" />
                  </div>
                )}
                {state === "pending" && (
                  <div className="rounded-full bg-slate-100 p-2 shadow-sm">
                    <Circle size={20} className="text-slate-400" />
                  </div>
                )}
              </div>

              {/* Label */}
              <div
                className={`rounded-xl border-2 px-3 py-2 text-xs font-bold text-center transition-all duration-200 hover-scale ${
                  state === "complete"
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm"
                    : state === "active"
                      ? "border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700 shadow-lg"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                <span className="block uppercase tracking-wide">{step}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
