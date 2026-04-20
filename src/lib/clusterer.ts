import { Conversation } from "./types"

// clean and tokenize text
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
}

// compute term frequency for a document
function termFrequency(tokens: string[]): Record<string, number> {
  const tf: Record<string, number> = {}
  tokens.forEach((t) => {
    tf[t] = (tf[t] || 0) + 1
  })
  const total = tokens.length || 1
  Object.keys(tf).forEach((t) => {
    tf[t] = tf[t] / total
  })
  return tf
}

// compute inverse document frequency across all documents
function inverseDocumentFrequency(
  documents: string[][]
): Record<string, number> {
  const idf: Record<string, number> = {}
  const N = documents.length

  documents.forEach((tokens) => {
    const unique = new Set(tokens)
    unique.forEach((t) => {
      idf[t] = (idf[t] || 0) + 1
    })
  })

  Object.keys(idf).forEach((t) => {
    idf[t] = Math.log(N / idf[t])
  })

  return idf
}

// compute tfidf vector for a document
function tfidfVector(
  tf: Record<string, number>,
  idf: Record<string, number>
): Record<string, number> {
  const vector: Record<string, number> = {}
  Object.keys(tf).forEach((t) => {
    if (idf[t]) {
      vector[t] = tf[t] * idf[t]
    }
  })
  return vector
}

// cosine similarity between two vectors
function cosineSimilarity(
  a: Record<string, number>,
  b: Record<string, number>
): number {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  let dot = 0
  let magA = 0
  let magB = 0

  keys.forEach((k) => {
    const va = a[k] || 0
    const vb = b[k] || 0
    dot += va * vb
    magA += va * va
    magB += vb * vb
  })

  if (magA === 0 || magB === 0) return 0
  return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}

// get top N terms from a tfidf vector
function topTerms(vector: Record<string, number>, n: number): string[] {
  return Object.entries(vector)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([term]) => term)
}

// map top terms to a human readable topic label
function labelFromTerms(terms: string[]): string {
  const termSet = new Set(terms)

  if (terms.some((t) => TOPIC_KEYWORDS.cybersecurity.has(t))) return "Cybersecurity"
  if (terms.some((t) => TOPIC_KEYWORDS.aiml.has(t))) return "AI & ML"
  if (terms.some((t) => TOPIC_KEYWORDS.webdev.has(t))) return "Web Dev"
  if (terms.some((t) => TOPIC_KEYWORDS.backend.has(t))) return "Backend"
  if (terms.some((t) => TOPIC_KEYWORDS.cloud.has(t))) return "Cloud & DevOps"
  if (terms.some((t) => TOPIC_KEYWORDS.data.has(t))) return "Data & Analytics"
  if (terms.some((t) => TOPIC_KEYWORDS.programming.has(t))) return "Programming"
  if (terms.some((t) => TOPIC_KEYWORDS.health.has(t))) return "Health"
  if (terms.some((t) => TOPIC_KEYWORDS.finance.has(t))) return "Finance"
  if (terms.some((t) => TOPIC_KEYWORDS.career.has(t))) return "Career"
  if (terms.some((t) => TOPIC_KEYWORDS.creative.has(t))) return "Creative"
  if (terms.some((t) => TOPIC_KEYWORDS.learning.has(t))) return "Learning"
  if (terms.some((t) => TOPIC_KEYWORDS.personal.has(t))) return "Personal"

  return "Other"
}

// cluster conversations using tfidf similarity
export function clusterConversations(conversations: Conversation[]): Conversation[] {
  if (conversations.length === 0) return []

  // extract text from each conversation
  const documents = conversations.map((convo) => {
    const text = [
      convo.title,
      convo.messages[0]?.content || "",
      convo.messages[1]?.content || "",
      convo.messages[2]?.content || "",
    ].join(" ")
    return tokenize(text)
  })

  // compute idf across all documents
  const idf = inverseDocumentFrequency(documents)

  // compute tfidf vector for each document
  const vectors = documents.map((tokens) => {
    const tf = termFrequency(tokens)
    return tfidfVector(tf, idf)
  })

  // assign topic based on top terms in each vector
  return conversations.map((convo, i) => {
    const terms = topTerms(vectors[i], 10)
    const topic = labelFromTerms(terms)
    return { ...convo, topic }
  })
}

// stop words to ignore
const STOP_WORDS = new Set([
  "the", "and", "for", "that", "this", "with", "from", "are", "was",
  "were", "have", "has", "had", "not", "but", "what", "when", "where",
  "who", "how", "can", "could", "would", "should", "will", "may", "might",
  "does", "did", "its", "also", "just", "like", "use", "used", "using",
  "make", "made", "need", "want", "get", "got", "let", "set", "see",
  "one", "two", "new", "all", "any", "more", "some", "out", "into",
  "than", "then", "them", "they", "their", "there", "here", "your",
  "you", "our", "about", "which", "very", "well", "good", "know",
  "think", "help", "try", "way", "much", "many", "say", "said",
  "now", "still", "even", "back", "way", "after", "before", "through",
  "over", "under", "each", "other", "same", "different", "work",
  "working", "right", "left", "between", "while", "without", "within",
  "something", "nothing", "everything", "anything", "someone", "anyone",
])

// topic keyword sets for label assignment
const TOPIC_KEYWORDS = {
  cybersecurity: new Set([
    "security", "hack", "exploit", "vulnerability", "malware", "firewall",
    "encryption", "decrypt", "cipher", "hash", "ssl", "tls", "certificate",
    "authentication", "xss", "injection", "csrf", "overflow", "payload",
    "shellcode", "rootkit", "backdoor", "trojan", "ransomware", "phishing",
    "pentest", "ctf", "forensic", "kali", "nmap", "wireshark", "metasploit",
    "burp", "reverse", "privilege", "escalation", "oscp", "cve", "zero",
  ]),
  aiml: new Set([
    "machine", "learning", "neural", "model", "training", "dataset", "deep",
    "nlp", "language", "computer", "vision", "tensorflow", "pytorch", "keras",
    "llm", "gpt", "embedding", "vector", "transformer", "attention",
    "reinforcement", "supervised", "unsupervised", "classification",
    "regression", "clustering", "gradient", "backprop", "overfitting",
    "accuracy", "precision", "recall", "inference", "fine", "tuning",
    "prompt", "token", "claude", "openai", "hugging", "bert", "stable",
  ]),
  webdev: new Set([
    "react", "next", "vue", "angular", "svelte", "html", "css", "tailwind",
    "bootstrap", "frontend", "component", "webpage", "website", "responsive",
    "figma", "design", "layout", "grid", "flexbox", "animation", "button",
    "form", "modal", "navbar", "dashboard", "dark", "styled", "emotion",
    "chakra", "radix", "shadcn", "framer", "gsap",
  ]),
  backend: new Set([
    "api", "server", "database", "sql", "postgres", "mysql", "mongodb",
    "redis", "firebase", "prisma", "orm", "query", "schema", "table",
    "endpoint", "express", "fastapi", "django", "flask", "node", "rest",
    "graphql", "microservice", "nginx", "load", "balancer", "websocket",
    "middleware", "cors", "jwt", "oauth", "session", "cookie", "cache",
  ]),
  cloud: new Set([
    "aws", "azure", "gcp", "cloud", "vercel", "netlify", "lambda",
    "serverless", "docker", "kubernetes", "terraform", "ansible", "cicd",
    "github", "actions", "devops", "deployment", "infrastructure", "monitoring",
    "logging", "scaling", "container", "pipeline", "vpc", "iam", "s3",
    "ec2", "eks", "ecs", "fargate", "cloudfront", "route53",
  ]),
  data: new Set([
    "data", "analytics", "visualization", "tableau", "power", "pandas",
    "numpy", "matplotlib", "seaborn", "plotly", "dashboard", "report",
    "metric", "kpi", "etl", "pipeline", "warehouse", "spark", "kafka",
    "airflow", "dbt", "looker", "bigquery", "snowflake", "databricks",
    "excel", "csv", "json", "parquet", "aggregation", "pivot",
  ]),
  programming: new Set([
    "python", "javascript", "typescript", "java", "rust", "golang", "swift",
    "kotlin", "assembly", "arm", "register", "memory", "pointer", "heap",
    "stack", "binary", "hex", "compiler", "interpreter", "algorithm",
    "structure", "linked", "list", "tree", "graph", "sorting", "searching",
    "complexity", "recursion", "dynamic", "programming", "leetcode", "dsa",
  ]),
  health: new Set([
    "workout", "fitness", "exercise", "gym", "muscle", "cardio", "running",
    "yoga", "diet", "nutrition", "calories", "protein", "sleep", "recovery",
    "injury", "pain", "doctor", "medicine", "symptom", "diagnosis", "therapy",
    "mental", "anxiety", "depression", "stress", "meditation", "mindfulness",
    "hospital", "surgery", "vitamin", "supplement", "weight", "health",
  ]),
  finance: new Set([
    "money", "invest", "stock", "crypto", "bitcoin", "market", "trading",
    "portfolio", "dividend", "savings", "debt", "income", "tax", "budget",
    "mortgage", "insurance", "bank", "loan", "credit", "salary", "revenue",
    "profit", "loss", "fund", "etf", "startup", "venture", "funding",
    "valuation", "acquisition", "business", "finance", "wealth",
  ]),
  career: new Set([
    "resume", "interview", "job", "hire", "recruiter", "linkedin", "offer",
    "career", "internship", "promotion", "manager", "workplace", "salary",
    "negotiation", "performance", "review", "feedback", "onboarding",
    "remote", "startup", "company", "team", "meeting", "deadline",
  ]),
  creative: new Set([
    "write", "essay", "story", "novel", "poem", "script", "blog", "content",
    "design", "art", "draw", "paint", "music", "song", "lyrics", "video",
    "film", "animation", "brand", "logo", "typography", "illustration",
    "photography", "creative", "fiction", "narrative", "character", "plot",
  ]),
  learning: new Set([
    "study", "learn", "course", "exam", "school", "university", "homework",
    "assignment", "lecture", "research", "notes", "textbook", "degree",
    "grade", "professor", "student", "tutorial", "math", "physics",
    "chemistry", "biology", "history", "philosophy", "science", "paper",
    "thesis", "dissertation", "experiment", "hypothesis",
  ]),
  personal: new Set([
    "friend", "family", "relationship", "love", "breakup", "dating",
    "marriage", "divorce", "partner", "goal", "habit", "routine", "mindset",
    "confidence", "motivation", "self", "identity", "purpose", "travel",
    "trip", "vacation", "food", "recipe", "cook", "restaurant", "personal",
    "life", "advice", "help", "emotion", "feel", "grow",
  ]),
}