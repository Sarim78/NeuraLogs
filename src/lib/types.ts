// A single message inside a conversation
export type Message = {
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

// A single conversation thread
export type Conversation = {
  id: string
  title: string
  source: "claude" | "chatgpt"
  topic?: string
  messages: Message[]
  createdAt?: string
}

// A node on the neural graph
export type GraphNode = {
  id: string
  title: string
  topic: string
  messageCount: number
  source: "claude" | "chatgpt"
}

// An edge connecting two nodes
export type GraphEdge = {
  source: string
  target: string
}

// The full graph data passed to D3
export type GraphData = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

// Topic cluster colors
export type Topic =
  | "Tech"
  | "Health"
  | "Finance"
  | "Career"
  | "Creative"
  | "Learning"
  | "Personal"
  | "Other"