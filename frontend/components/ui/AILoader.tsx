export function AILoader({ label = "AI is generating..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
      <span className="h-3 w-3 animate-pulse rounded-full bg-blue-500" />
      <span>{label}</span>
    </div>
  );
}