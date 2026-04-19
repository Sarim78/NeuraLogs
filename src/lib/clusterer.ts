import { Conversation } from "./types"

function detectTopic(text: string): string {
  const lower = text.toLowerCase()

  if (/code|python|javascript|typescript|bug|error|api|database|programming|software|github|react|next|node|css|html|function|class|array|object|algorithm|terminal|deploy|server|git|component|library|framework|debugging|compiler|syntax|variable|loop|recursion|sql|query|backend|frontend|fullstack|devops|docker|aws|cloud|linux|bash|script|json|rest|graphql|endpoint|authentication|encryption|cybersecurity|network|packet|firewall|malware|exploit|vulnerability|assembly|c\+\+|java|rust|golang|swift|kotlin|flutter|mobile|app|security|hacking|kali|nmap|wireshark|arm|register|memory|pointer|heap|stack|binary|hex|bit|byte|integer|string|data|struct|type|interface|module|import|export|build|compile|test|debug|fix|implement|create|project|system|tool|file|directory|path|command|install|setup|config|environment|machine learning|neural|model|training|dataset|ai|artificial|intelligence|nlp|computer|hardware|software|web|site|page|browser|chrome|firefox|http|https|url|domain|hosting|vercel|netlify|vite|webpack|eslint|prettier|tailwind|bootstrap|sass|css|svg|canvas|animation|api|fetch|axios|promise|async|await|callback|event|listener|dom|react|vue|angular|svelte|express|fastapi|django|flask|spring|rails|laravel|php|ruby|scala|haskell|elixir|clojure|erlang|ocaml|scheme|lisp|prolog|fortran|cobol|pascal|delphi|matlab|r|julia|dart|lua|perl|groovy|gradle|maven|npm|yarn|pip|cargo|gem|composer/.test(lower)) return "Tech"

  if (/workout|diet|sleep|doctor|health|pain|medicine|mental|anxiety|depression|fitness|nutrition|calories|exercise|symptom|diagnosis|therapy|wellness|meditation|stress|injury|hospital|supplement|vitamin|weight|muscle|cardio|running|yoga|stretching|recovery|immune|chronic|disease|condition|prescription|pharmacy|surgeon|nurse|clinic|appointment|checkup|blood|heart|lung|kidney|liver|brain|spine|joint|bone|skin|cancer|diabetes|allergy|asthma|migraine|fatigue|insomnia|nausea|fever|cold|flu|covid|vaccine|hygiene|dental|vision|hearing/.test(lower)) return "Health"

  if (/money|invest|budget|finance|crypto|stock|savings|debt|income|tax|bank|salary|price|revenue|profit|loss|market|trading|portfolio|dividend|mortgage|insurance|expense|wealth|fund|etf|bitcoin|ethereum|blockchain|nft|defi|wallet|transaction|payment|invoice|accounting|audit|financial|economic|gdp|inflation|interest|rate|loan|credit|debit|cash|currency|exchange|forex|commodity|gold|silver|real estate|property|rent|lease|asset|liability|equity|capital|venture|angel|seed|ipo|acquisition|merger|valuation|startup funding/.test(lower)) return "Finance"

  if (/resume|job|interview|career|internship|work|hire|linkedin|promotion|manager|workplace|offer|recruiter|cover letter|profession|employment|fired|quit|startup|business|entrepreneur|boss|colleague|team|meeting|deadline|project management|agile|scrum|sprint|roadmap|okr|kpi|performance|review|feedback|onboarding|remote|hybrid|office|salary negotiation|raise|benefits|equity|stock option|reference|network|connection|opportunity|role|position|title|company|organization|department|hr|human resources/.test(lower)) return "Career"

  if (/essay|write|story|creative|design|art|poem|script|blog|content|novel|draw|music|song|lyrics|paint|photograph|video|film|animation|brand|logo|color|typography|illustration|sketch|fiction|narrative|character|plot|setting|dialogue|scene|chapter|draft|edit|publish|portfolio|gallery|exhibition|performance|theater|dance|sculpture|pottery|craft|knit|sew|cook|recipe|bake|decorate|interior|fashion|style|aesthetic|mood board|inspiration|concept|pitch|storyboard|wireframe|prototype|mockup|ui|ux/.test(lower)) return "Creative"

  if (/study|learn|course|exam|school|university|homework|assignment|lecture|research|notes|textbook|degree|grade|professor|student|tutorial|explain|understand|concept|theory|math|physics|chemistry|biology|history|geography|literature|philosophy|psychology|sociology|economics|political|science|engineering|architecture|law|medicine|education|training|certification|bootcamp|workshop|seminar|conference|paper|thesis|dissertation|citation|reference|bibliography|experiment|hypothesis|analysis|conclusion|summary|review|quiz|test|midterm|final|gpa|scholarship|admission|application|college|high school|middle school|elementary|kindergarten|preschool/.test(lower)) return "Learning"

  if (/friend|family|relationship|feel|emotion|personal|life|advice|help|love|breakup|dating|marriage|divorce|loneliness|happiness|sad|angry|grateful|motivation|goal|habit|routine|mindset|confidence|self|identity|purpose|meaning|value|belief|spiritual|religion|faith|prayer|gratitude|journal|reflect|grow|heal|trauma|grief|loss|death|funeral|birthday|celebration|holiday|vacation|travel|trip|adventure|experience|memory|nostalgia|childhood|parent|sibling|child|partner|spouse|ex|crush|friend group|social|party|event|gathering|community|volunteer|charity|cause|activist|protest|politics|opinion|debate|argue|conflict|resolve|forgive|apologize|boundary|toxic|support|encourage|inspire/.test(lower)) return "Personal"

  return "Other"
}

export function clusterConversations(conversations: Conversation[]): Conversation[] {
  return conversations.map((convo) => {
    const text = [
      convo.title,
      convo.messages[0]?.content || "",
      convo.messages[1]?.content || "",
      convo.messages[2]?.content || "",
    ].join(" ")
    return { ...convo, topic: detectTopic(text) }
  })
}