import { Conversation } from "./types"

function detectTopic(text: string): string {
  const lower = text.toLowerCase()

  if (/code|python|javascript|typescript|bug|error|api|database|programming|software|github|react|next|node|css|html|function|class|array|object|algorithm|terminal|deploy|server|git|component|library|framework|debugging|compiler|syntax|variable|loop|recursion|sql|query|backend|frontend|fullstack|devops|docker|aws|cloud|linux|bash|script|json|rest|graphql|endpoint|authentication|encryption|cybersecurity|network|packet|firewall|malware|exploit|vulnerability|assembly|c\+\+|java|rust|golang|swift|kotlin|flutter|mobile|app/.test(lower)) return "Tech"
  if (/workout|diet|sleep|doctor|health|pain|medicine|mental|anxiety|depression|fitness|nutrition|calories|exercise|symptom|diagnosis|therapy|wellness|meditation|stress|injury|hospital|supplement|vitamin|weight|muscle|cardio|running|yoga/.test(lower)) return "Health"
  if (/money|invest|budget|finance|crypto|stock|savings|debt|income|tax|bank|salary|price|revenue|profit|loss|market|trading|portfolio|dividend|mortgage|insurance|expense|wealth|fund|etf|bitcoin|ethereum/.test(lower)) return "Finance"
  if (/resume|job|interview|career|internship|work|hire|linkedin|promotion|manager|workplace|salary negotiation|offer|recruiter|cover letter|skill|profession|employment|fired|quit|startup|business|entrepreneur/.test(lower)) return "Career"
  if (/essay|write|story|creative|design|art|poem|script|blog|content|novel|draw|music|song|lyrics|paint|photograph|video|film|animation|brand|logo|color|typography|illustration|sketch|fiction|narrative/.test(lower)) return "Creative"
  if (/study|learn|course|exam|school|university|homework|assignment|lecture|research|notes|textbook|degree|grade|professor|student|tutorial|explain|understand|concept|theory|math|physics|chemistry|biology|history|geography|literature|philosophy/.test(lower)) return "Learning"
  if (/friend|family|relationship|feel|emotion|personal|life|advice|help|love|breakup|dating|marriage|divorce|loneliness|happiness|sad|angry|grateful|motivation|goal|habit|routine|mindset|confidence|self|identity|purpose/.test(lower)) return "Personal"

  return "Other"
}

export function clusterConversations(conversations: Conversation[]): Conversation[] {
  return conversations.map((convo) => {
    const text = convo.title + " " + (convo.messages[0]?.content || "") + " " + (convo.messages[1]?.content || "")
    return { ...convo, topic: detectTopic(text) }
  })
}