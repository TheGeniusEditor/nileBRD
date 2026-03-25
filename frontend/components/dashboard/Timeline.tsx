import { Card } from "@/components/ui/Card";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { type CSSProperties } from "react";

type TimelineItem = {
  id: string;
  title: string;
  time: string;
  status?: "complete" | "pending" | "alert";
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle size={18} className="text-emerald-500" />;
      case "alert":
        return <AlertCircle size={18} className="text-rose-500" />;
      default:
        return <Clock size={18} className="text-blue-500" />;
    }
  };

  return (
    <Card variant="elevated" hoverable>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Latest {items.length}
        </span>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 animate-rise stagger-item group cursor-pointer"
            style={{ "--stagger-delay": `${80 + index * 60}ms` } as CSSProperties}
          >
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(item.status)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                {item.title}
              </p>
              <p className="text-xs text-slate-500 mt-1">{item.time}</p>
            </div>
            <div className="flex-shrink-0 text-slate-300 group-hover:text-slate-400 transition-colors">
              →
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
