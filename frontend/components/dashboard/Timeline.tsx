import { Card } from "@/components/ui/Card";
import { type CSSProperties } from "react";

export function Timeline({ items }: { items: { id: string; title: string; time: string }[] }) {
  return (
    <Card>
      <h3 className="mb-4 text-base font-semibold text-slate-800">Recent Activity</h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="flex gap-3 animate-rise stagger-item"
            style={{ "--stagger-delay": `${80 + index * 60}ms` } as CSSProperties}
          >
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
            <div>
              <p className="text-sm text-slate-700">{item.title}</p>
              <p className="text-xs text-slate-500">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
