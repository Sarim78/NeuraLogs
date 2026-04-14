const TOPIC_COLORS: Record<string, string> = {
  Tech: "#6366f1",
  Health: "#22c55e",
  Finance: "#f59e0b",
  Career: "#3b82f6",
  Creative: "#ec4899",
  Learning: "#8b5cf6",
  Personal: "#f97316",
  Other: "#6b7280",
}

export default function TopicLegend() {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 bg-black/60 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
      <p className="text-white/40 text-xs font-medium mb-1">Topics</p>
      {Object.entries(TOPIC_COLORS).map(([topic, color]) => (
        <div key={topic} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-white/60 text-xs">{topic}</span>
        </div>
      ))}
    </div>
  )
}