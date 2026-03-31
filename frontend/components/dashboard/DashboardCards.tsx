import { Card } from "@/components/ui/Card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { type CSSProperties } from "react";

type SummaryItem = {
  label: string;
  value: number;
  delta: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
};

export function DashboardCards({ items }: { items: SummaryItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const isPositive = item.trend === "up" || (item.delta && item.delta.includes("+"));
        const isNegative = item.trend === "down" || (item.delta && item.delta.includes("-"));

        return (
          <Card
            key={item.label}
            variant="default"
            hoverable
            className="group"
            style={{ "--stagger-delay": `${60 + index * 70}ms` } as CSSProperties}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-800">
                  {item.value.toLocaleString()}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  {isPositive && (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <TrendingUp size={13} />
                      <span className="text-xs font-medium">{item.delta}</span>
                    </div>
                  )}
                  {isNegative && (
                    <div className="flex items-center gap-1 text-rose-500">
                      <TrendingDown size={13} />
                      <span className="text-xs font-medium">{item.delta}</span>
                    </div>
                  )}
                  {!isPositive && !isNegative && (
                    <span className="text-xs text-slate-400">{item.delta}</span>
                  )}
                </div>
              </div>
              {item.icon && (
                <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-500">
                  {item.icon}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
