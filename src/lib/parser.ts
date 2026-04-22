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
      content: typeof msg.text === "string" ? msg.text : "",
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

    // build a proper ordered list by following parent/child links
    const nodes = Object.values(mapping) as any[]

    // find root node
    const nodeMap: Record<string, any> = {}
    nodes.forEach((node: any) => {
      if (node?.id) nodeMap[node.id] = node
    })

    // traverse in order using children links
    const visited = new Set<string>()

    function traverse(nodeId: string) {
      if (!nodeId || visited.has(nodeId)) return
      visited.add(nodeId)

      const node = nodeMap[nodeId]
      if (!node) return

      const msg = node.message
      if (msg) {
        const role = msg.author?.role
        if (role === "user" || role === "assistant") {
          const parts = msg.content?.parts || []
          const content = parts
            .map((p: any) => (typeof p === "string" ? p : typeof p?.text === "string" ? p.text : ""))
            .filter(Boolean)
            .join(" ")
            .trim()

          if (content) {
            messages.push({
              role,
              content,
              timestamp: msg.create_time
                ? new Date(msg.create_time * 1000).toISOString()
                : undefined,
            })
          }
        }
      }

      // traverse children in order
      const children: string[] = node.children || []
      children.forEach((childId: string) => traverse(childId))
    }

    // find root nodes (nodes with no parent or null parent)
    const rootNodes = nodes.filter(
      (node: any) => !node.parent || !nodeMap[node.parent]
    )
    rootNodes.forEach((node: any) => traverse(node.id))

    // fallback — if traversal got nothing just do flat parse
    if (messages.length === 0) {
      nodes.forEach((node: any) => {
        const msg = node?.message
        if (!msg) return
        const role = msg.author?.role
        if (role !== "user" && role !== "assistant") return
        const parts = msg.content?.parts || []
        const content = parts
          .map((p: any) => (typeof p === "string" ? p : ""))
          .filter(Boolean)
          .join(" ")
          .trim()
        if (content) {
          messages.push({
            role,
            content,
            timestamp: msg.create_time
              ? new Date(msg.create_time * 1000).toISOString()
              : undefined,
          })
        }
      })
    }

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