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

// group into broad categories for display
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
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-1.5 bg-black/60 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm max-h-[80vh] overflow-y-auto">
      <p className="text-white/40 text-xs font-medium mb-1">Topics</p>
      {Object.entries(GROUPS).map(([group, subtopics]) => (
        <div key={group} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: GROUP_COLORS[group] }}
            />
            <span className="text-white/80 text-xs font-medium">{group}</span>
          </div>
          <div className="flex flex-col gap-0.5 pl-4">
            {subtopics.map((sub) => (
              <div key={sub} className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full opacity-70"
                  style={{ backgroundColor: TOPIC_COLORS[sub] }}
                />
                <span className="text-white/40 text-xs">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}