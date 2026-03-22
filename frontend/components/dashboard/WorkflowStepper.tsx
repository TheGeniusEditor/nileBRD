export function WorkflowStepper({
  steps,
  current,
}: {
  steps: string[];
  current: string;
}) {
  return (
    <div className="grid gap-2 md:grid-cols-6">
      {steps.map((step, index) => {
        const activeIndex = steps.indexOf(current);
        const state = index < activeIndex ? "complete" : index === activeIndex ? "active" : "pending";
        return (
          <div
            key={step}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
              state === "complete"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : state === "active"
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-slate-50 text-slate-500"
            }`}
          >
            {step}
          </div>
        );
      })}
    </div>
  );
}
