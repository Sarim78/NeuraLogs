"use client"

import { useEffect, useRef } from "react"
import { Conversation } from "../lib/types"

interface ConvoDrawerProps {
  conversation: Conversation | null
  onClose: () => void
}

export default function ConvoDrawer({
  conversation,
  onClose,
}: ConvoDrawerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [conversation?.id])

  if (!conversation) return null

  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-black/95 md:border-l border-white/10 z-50 flex flex-col backdrop-blur-sm">

      {/* header */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
        <div className="flex flex-col gap-1 flex-1 mr-3">
          <p className="text-white text-sm font-medium leading-snug">
            {conversation.title}
          </p>
          <div className="flex items-center gap-2">
            <span
              className="text-xs px-2 py-0.5 rounded-full border"
              style={{
                color: getTopicColor(conversation.topic || "Other"),
                borderColor: getTopicColor(conversation.topic || "Other") + "40",
                backgroundColor: getTopicColor(conversation.topic || "Other") + "15",
              }}
            >
              {conversation.topic || "Other"}
            </span>
            <span className="text-white/30 text-xs">
              {conversation.messages.length} messages
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/30 hover:text-white transition-colors text-lg flex-shrink-0 mt-0.5"
        >
          ✕
        </button>
      </div>

      {/* scroll hint */}
      <div className="flex items-center justify-center py-1.5 border-b border-white/5">
        <p className="text-white/15 text-xs">scroll to read</p>
      </div>

      {/* messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
      >
        {conversation.messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col gap-1 ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <span className="text-white/25 text-xs">
              {msg.role === "user" ? "You" : "Assistant"}
            </span>
            <div
              className={`rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[300px] ${
                msg.role === "user"
                  ? "bg-white/10 text-white/90"
                  : "bg-white/5 text-white/70"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div className="h-4" />
      </div>
    </div>
  )
}

function getTopicColor(topic: string): string {
  const colors: Record<string, string> = {
    "Cybersecurity": "#ef4444",
    "AI & ML": "#8b5cf6",
    "Web Dev": "#3b82f6",
    "Backend": "#06b6d4",
    "Cloud & DevOps": "#f59e0b",
    "Programming": "#6366f1",
    "Data & Analytics": "#10b981",
    "Fitness": "#22c55e",
    "Mental Health": "#a78bfa",
    "Medical": "#f43f5e",
    "Investing": "#fbbf24",
    "Personal Finance": "#84cc16",
    "Business": "#fb923c",
    "Job Search": "#38bdf8",
    "Career Growth": "#0ea5e9",
    "Writing": "#e879f9",
    "Design": "#f472b6",
    "Music": "#c084fc",
    "Math": "#4ade80",
    "School": "#60a5fa",
    "Research": "#34d399",
    "Relationships": "#fb7185",
    "Self Improvement": "#fcd34d",
    "Travel": "#67e8f9",
    "Food": "#fdba74",
    "Other": "#6b7280",
  }
  return colors[topic] || "#6b7280"
}