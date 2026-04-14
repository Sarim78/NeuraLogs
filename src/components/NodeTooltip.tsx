interface NodeTooltipProps {
  title: string
  topic: string
  messageCount: number
  source: "claude" | "chatgpt"
  x: number
  y: number
}

export default function NodeTooltip({
  title,
  topic,
  messageCount,
  source,
  x,
  y,
}: NodeTooltipProps) {
  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{ left: x + 12, top: y - 12 }}
    >
      <div className="bg-black/80 border border-white/10 rounded-xl px-3 py-2 backdrop-blur-sm">
        <p className="text-white text-xs font-medium max-w-[200px] truncate">
          {title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white/40 text-xs">{topic}</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-white/40 text-xs">{messageCount} messages</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-white/40 text-xs">{source}</span>
        </div>
      </div>
    </div>
  )
}