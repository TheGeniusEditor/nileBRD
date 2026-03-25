export function AILoader({ label = "AI is generating..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-4 text-sm font-medium text-blue-700 shadow-sm animate-slide-in-down">
      <div className="flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span>{label}</span>
    </div>
  );
}