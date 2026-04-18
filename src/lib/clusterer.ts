import { Conversation } from "./types"

function detectTopic(text: string): string {
  const lower = text.toLowerCase()

  if (/code|python|javascript|typescript|bug|error|api|database|programming|software|github|react|next|node|css|html|function|class|array|object/.test(lower)) return "Tech"
  if (/workout|diet|sleep|doctor|health|pain|medicine|mental|anxiety|depression|fitness|nutrition|calories|exercise/.test(lower)) return "Health"
  if (/money|invest|budget|finance|crypto|stock|savings|debt|income|tax|bank|salary|price/.test(lower)) return "Finance"
  if (/resume|job|interview|career|internship|work|hire|linkedin|portfolio|promotion|manager/.test(lower)) return "Career"
  if (/essay|write|story|creative|design|art|poem|script|blog|content|novel|draw/.test(lower)) return "Creative"
  if (/study|learn|course|exam|school|university|homework|assignment|lecture|research|notes/.test(lower)) return "Learning"
  if (/friend|family|relationship|feel|emotion|personal|life|advice|help|love|breakup/.test(lower)) return "Personal"

  return "Other"
}

export function clusterConversations(conversations: Conversation[]): Conversation[] {
  return conversations.map((convo) => {
    const text = convo.title + " " + (convo.messages[0]?.content || "")
    return { ...convo, topic: detectTopic(text) }
  })
}