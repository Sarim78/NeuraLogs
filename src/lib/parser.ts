import { Conversation, Message } from "./types"

function detectSource(data: any): "claude" | "chatgpt" {
  if (data[0]?.chat_messages) return "claude"
  if (data[0]?.mapping) return "chatgpt"
  return "claude"
}

function parseClaude(raw: any[]): Conversation[] {
  return raw.map((convo) => {
    const messages: Message[] = (convo.chat_messages || []).map((msg: any) => ({
      role: msg.sender === "human" ? "user" : "assistant",
      content: msg.text || "",
      timestamp: msg.created_at || undefined,
    }))

    return {
      id: convo.uuid || crypto.randomUUID(),
      title: convo.name || "Untitled",
      source: "claude",
      messages,
      createdAt: convo.created_at || undefined,
    }
  })
}

function parseChatGPT(raw: any[]): Conversation[] {
  return raw.map((convo) => {
    const messages: Message[] = []

    const mapping = convo.mapping || {}
    Object.values(mapping).forEach((node: any) => {
      const msg = node?.message
      if (!msg || !msg.content?.parts?.length) return

      const role = msg.author?.role
      if (role !== "user" && role !== "assistant") return

      messages.push({
        role,
        content: msg.content.parts.join(" "),
        timestamp: msg.create_time
          ? new Date(msg.create_time * 1000).toISOString()
          : undefined,
      })
    })

    return {
      id: convo.id || crypto.randomUUID(),
      title: convo.title || "Untitled",
      source: "chatgpt",
      messages,
      createdAt: convo.create_time
        ? new Date(convo.create_time * 1000).toISOString()
        : undefined,
    }
  })
}

export function parseConversations(raw: any[]): Conversation[] {
  if (!Array.isArray(raw) || raw.length === 0) return []
  const source = detectSource(raw)
  if (source === "claude") return parseClaude(raw)
  if (source === "chatgpt") return parseChatGPT(raw)
  return []
}