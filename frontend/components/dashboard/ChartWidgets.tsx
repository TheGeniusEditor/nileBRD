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
    <Card>
      <h3 className="mb-3 text-base font-semibold text-slate-800">{title}</h3>
      <div className="h-64">
        {!isClient ? (
          <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
            {lineKey ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey={lineKey} stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey={barKey || "value"} fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

export function DistributionChart({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  const isClient = useIsClient();

  return (
    <Card>
      <h3 className="mb-3 text-base font-semibold text-slate-800">{title}</h3>
      <div className="h-64">
        {!isClient ? (
          <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
            <PieChart>
              <Tooltip />
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} fill="#3b82f6" label />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
