"use client";

import { useSyncExternalStore } from "react";

import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/Card";

function subscribe() {
  return () => undefined;
}

function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function TrendChart({
  title,
  data,
  lineKey,
  barKey,
}: {
  title: string;
  data: Record<string, string | number>[];
  lineKey?: string;
  barKey?: string;
}) {
  const isClient = useIsClient();

  return (
    <Card variant="elevated" hoverable>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {lineKey ? "Trend" : "Volume"}
        </span>
      </div>
      <div className="h-72 rounded-xl overflow-hidden">
        {!isClient ? (
          <div className="h-full w-full animate-pulse rounded-xl bg-gradient-to-r from-slate-100 to-slate-200" />
        ) : (
          <div className="bg-gradient-to-b from-slate-50 to-white p-2">
            <ResponsiveContainer width="100%" height={260} minWidth={280} minHeight={220}>
              {lineKey ? (
                <LineChart data={data}>
                  <defs>
                    <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(15,23,42,0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={lineKey}
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ fill: "#2563eb", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={data}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={1} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(15,23,42,0.1)",
                    }}
                  />
                  <Bar
                    dataKey={barKey || "value"}
                    fill="url(#colorBar)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}

export function DistributionChart({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  const isClient = useIsClient();

  const COLORS = ["#2563eb", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <Card variant="elevated" hoverable>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Distribution
        </span>
      </div>
      <div className="h-72 rounded-xl overflow-hidden">
        {!isClient ? (
          <div className="h-full w-full animate-pulse rounded-xl bg-gradient-to-r from-slate-100 to-slate-200" />
        ) : (
          <div className="bg-gradient-to-b from-slate-50 to-white p-2">
            <ResponsiveContainer width="100%" height={260} minWidth={280} minHeight={220}>
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(15,23,42,0.1)",
                  }}
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  fill="#3b82f6"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {data.map((_, index) => (
                    <text
                      key={`color-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}
