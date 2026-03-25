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
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const isPositive = item.trend === "up" || (item.delta && item.delta.includes("+"));
        const isNegative = item.trend === "down" || (item.delta && item.delta.includes("-"));

        return (
          <Card
            key={item.label}
            variant="gradient-subtle"
            hoverable
            className="overflow-hidden group animate-rise stagger-item"
            style={{ "--stagger-delay": `${60 + index * 70}ms` } as CSSProperties}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 group-hover:text-slate-700 transition-colors">
                  {item.label}
                </p>
                <p className="mt-3 text-4xl font-bold text-slate-900">
                  {item.value.toLocaleString()}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  {isPositive && (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <TrendingUp size={16} />
                      <span className="text-xs font-semibold">{item.delta}</span>
                    </div>
                  )}
                  {isNegative && (
                    <div className="flex items-center gap-1 text-rose-600">
                      <TrendingDown size={16} />
                      <span className="text-xs font-semibold">{item.delta}</span>
                    </div>
                  )}
                  {!isPositive && !isNegative && (
                    <span className="text-xs font-medium text-slate-500">
                      {item.delta}
                    </span>
                  )}
                </div>
              </div>
              {item.icon && (
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-3 text-blue-600 group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors">
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
