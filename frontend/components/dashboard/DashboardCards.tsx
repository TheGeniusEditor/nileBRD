import { Card } from "@/components/ui/Card";
import { type CSSProperties } from "react";

type SummaryItem = {
  label: string;
  value: number;
  delta: string;
};

export function DashboardCards({ items }: { items: SummaryItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <Card
          key={item.label}
          className="p-4 animate-rise stagger-item"
          style={{ "--stagger-delay": `${60 + index * 70}ms` } as CSSProperties}
        >
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">{item.value}</p>
          <p className="mt-2 text-xs text-slate-500">{item.delta}</p>
        </Card>
      ))}
    </div>
  );
}
