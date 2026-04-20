"use client"

import { useState } from "react"

const TOPIC_COLORS: Record<string, string> = {
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

const GROUPS: Record<string, string[]> = {
  "Tech": ["Cybersecurity", "AI & ML", "Web Dev", "Backend", "Cloud & DevOps", "Programming", "Data & Analytics"],
  "Health": ["Fitness", "Mental Health", "Medical"],
  "Finance": ["Investing", "Personal Finance", "Business"],
  "Career": ["Job Search", "Career Growth"],
  "Creative": ["Writing", "Design", "Music"],
  "Learning": ["Math", "School", "Research"],
  "Personal": ["Relationships", "Self Improvement", "Travel", "Food"],
  "Other": ["Other"],
}

const GROUP_COLORS: Record<string, string> = {
  "Tech": "#6366f1",
  "Health": "#22c55e",
  "Finance": "#f59e0b",
  "Career": "#3b82f6",
  "Creative": "#e879f9",
  "Learning": "#34d399",
  "Personal": "#fb7185",
  "Other": "#6b7280",
}

export default function TopicLegend() {
  const [open, setOpen] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-[160px]">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-xl px-3 py-2 backdrop-blur-sm hover:border-white/20 transition-colors"
        >
          <div className="flex gap-1">
            {Object.values(GROUP_COLORS).slice(0, 5).map((color, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="text-white/40 text-xs">Topics</span>
        </button>
      ) : (
        <div className="flex flex-col gap-1.5 bg-black/80 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm w-44">
          <div className="flex items-center justify-between mb-1">
            <p className="text-white/40 text-xs font-medium">Topics</p>
            <button
              onClick={() => setOpen(false)}
              className="text-white/20 hover:text-white/60 text-xs transition-colors"
            >
              ✕
            </button>
          </div>
          {Object.entries(GROUPS).map(([group, subtopics]) => (
            <div key={group}>
              <button
                onClick={() => setExpandedGroup(expandedGroup === group ? null : group)}
                className="flex items-center gap-2 w-full hover:opacity-80 transition-opacity"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: GROUP_COLORS[group] }}
                />
                <span className="text-white/70 text-xs font-medium">{group}</span>
                <span className="text-white/20 text-xs ml-auto">
                  {expandedGroup === group ? "−" : "+"}
                </span>
              </button>
              {expandedGroup === group && (
                <div className="flex flex-col gap-0.5 pl-4 mt-1">
                  {subtopics.map((sub) => (
                    <div key={sub} className="flex items-center gap-1.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full opacity-70 flex-shrink-0"
                        style={{ backgroundColor: TOPIC_COLORS[sub] }}
                      />
                      <span className="text-white/40 text-xs">{sub}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}