import { Conversation } from "@/lib/types"

interface ConvoDrawerProps {
  conversation: Conversation | null
  onClose: () => void
}

export default function ConvoDrawer({
  conversation,
  onClose,
}: ConvoDrawerProps) {
  if (!conversation) return null

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-black/90 border-l border-white/10 z-50 flex flex-col backdrop-blur-sm">
      {/* header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div>
          <p className="text-white text-sm font-medium truncate max-w-[280px]">
            {conversation.title}
          </p>
          <p className="text-white/40 text-xs mt-0.5">{conversation.topic}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors text-lg"
        >
          ✕
        </button>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {conversation.messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col gap-1 ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <span className="text-white/30 text-xs">
              {msg.role === "user" ? "You" : "Assistant"}
            </span>
            <div
              className={`rounded-xl px-3 py-2 text-sm max-w-[320px] ${
                msg.role === "user"
                  ? "bg-white/10 text-white"
                  : "bg-white/5 text-white/80"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}