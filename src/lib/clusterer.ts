import { Conversation } from "./types"

function detectTopic(text: string): string {
  const lower = text.toLowerCase()

  // Tech subtopics
  if (/cybersecurity|security|hacking|kali|nmap|wireshark|exploit|vulnerability|malware|firewall|penetration|pentest|ctf|reverse engineer|forensic|incident|threat|attack|defense|encryption|decrypt|cipher|hash|ssl|tls|certificate|authentication|authorization|oauth|jwt|xss|sql injection|csrf|buffer overflow|privilege escalation|payload|shellcode|rootkit|backdoor|trojan|ransomware|phishing|social engineering/.test(lower)) return "Cybersecurity"

  if (/machine learning|neural network|deep learning|model|training|dataset|ai|artificial intelligence|nlp|natural language|computer vision|tensorflow|pytorch|scikit|keras|hugging face|llm|gpt|claude|chatgpt|embedding|vector|transformer|attention|reinforcement|supervised|unsupervised|classification|regression|clustering|feature|epoch|gradient|backprop|overfitting|underfitting|accuracy|precision|recall|f1/.test(lower)) return "AI & ML"

  if (/react|next|vue|angular|svelte|html|css|tailwind|bootstrap|sass|frontend|ui|ux|component|webpage|website|landing page|responsive|mobile design|figma|wireframe|prototype|design system|typography|color|layout|grid|flexbox|animation|transition|hover|click|button|form|input|modal|navbar|sidebar|dashboard|dark mode/.test(lower)) return "Web Dev"

  if (/sql|database|postgres|mysql|mongodb|redis|firebase|supabase|prisma|orm|query|schema|table|index|join|migration|crud|nosql|graphql|rest api|endpoint|backend|express|fastapi|django|flask|node|server|microservice|docker|kubernetes|nginx|load balancer/.test(lower)) return "Backend"

  if (/aws|azure|gcp|cloud|vercel|netlify|heroku|lambda|serverless|s3|ec2|iam|vpc|terraform|ansible|ci\/cd|github actions|devops|deployment|infrastructure|monitoring|logging|scaling|container|pipeline/.test(lower)) return "Cloud & DevOps"

  if (/python|javascript|typescript|java|c\+\+|c#|rust|golang|swift|kotlin|ruby|php|scala|haskell|assembly|arm|register|memory|pointer|heap|stack|binary|hex|bit|byte|compiler|interpreter|syntax|variable|loop|recursion|algorithm|data structure|linked list|tree|graph|sorting|searching|big o|complexity/.test(lower)) return "Programming"

  if (/data|analytics|visualization|tableau|power bi|excel|pandas|numpy|matplotlib|seaborn|plotly|d3|dashboard|report|insight|metric|kpi|etl|pipeline|warehouse|spark|hadoop|kafka|airflow|dbt|looker|bi|business intelligence/.test(lower)) return "Data & Analytics"

  // Health subtopics
  if (/workout|fitness|exercise|gym|muscle|cardio|running|yoga|stretching|weight|calories|protein|nutrition|diet|meal|supplement|vitamin|sleep|recovery|injury|pain|physio/.test(lower)) return "Fitness"
  if (/mental|anxiety|depression|stress|therapy|mindfulness|meditation|emotion|mood|wellbeing|psychology|counseling|burnout|trauma|grief|loneliness/.test(lower)) return "Mental Health"
  if (/doctor|hospital|medicine|symptom|diagnosis|prescription|surgery|nurse|clinic|appointment|checkup|blood|heart|lung|kidney|disease|condition|allergy|vaccine/.test(lower)) return "Medical"

  // Finance subtopics
  if (/stock|invest|market|trading|portfolio|etf|dividend|crypto|bitcoin|ethereum|defi|nft|blockchain|fund|index/.test(lower)) return "Investing"
  if (/budget|expense|savings|debt|income|tax|salary|mortgage|insurance|bank|loan|credit|cash|financial plan/.test(lower)) return "Personal Finance"
  if (/startup|business|revenue|profit|loss|venture|funding|pitch|investor|valuation|acquisition|merger|entrepreneur/.test(lower)) return "Business"

  // Career subtopics
  if (/resume|interview|job|hire|recruiter|cover letter|linkedin|offer|application|portfolio/.test(lower)) return "Job Search"
  if (/promotion|manager|leadership|team|meeting|workplace|performance|review|feedback|career growth/.test(lower)) return "Career Growth"

  // Creative subtopics
  if (/write|essay|story|novel|fiction|poem|script|blog|content|narrative|character|plot|draft|edit|publish/.test(lower)) return "Writing"
  if (/design|art|draw|paint|illustration|sketch|logo|brand|color|typography|ui|ux|figma|graphic|visual/.test(lower)) return "Design"
  if (/music|song|lyrics|beat|produce|record|guitar|piano|melody|chord|mix|master/.test(lower)) return "Music"

  // Learning subtopics
  if (/math|calculus|algebra|statistics|probability|discrete|linear algebra|differential/.test(lower)) return "Math"
  if (/study|exam|school|university|homework|assignment|lecture|notes|textbook|degree|grade|professor|course|tutorial/.test(lower)) return "School"
  if (/research|paper|thesis|dissertation|experiment|hypothesis|analysis|science|physics|chemistry|biology|history|philosophy/.test(lower)) return "Research"

  // Personal subtopics
  if (/friend|family|relationship|love|breakup|dating|marriage|divorce|partner|spouse/.test(lower)) return "Relationships"
  if (/goal|habit|routine|mindset|confidence|motivation|self|identity|purpose|meaning|grow|improve|productivity/.test(lower)) return "Self Improvement"
  if (/travel|trip|vacation|adventure|explore|country|city|hotel|flight|itinerary/.test(lower)) return "Travel"
  if (/food|recipe|cook|bake|restaurant|meal|cuisine|ingredient|kitchen/.test(lower)) return "Food"

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