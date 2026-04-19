import { Conversation, GraphData, GraphNode, GraphEdge } from "./types"

export function buildGraph(conversations: Conversation[]): GraphData {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  conversations.forEach((convo) => {
    nodes.push({
      id: convo.id,
      title: convo.title,
      topic: convo.topic || "Other",
      messageCount: convo.messages.length,
      source: convo.source,
    })
  })

  const topicMap: Record<string, string[]> = {}

  conversations.forEach((convo) => {
    const topic = convo.topic || "Other"
    if (!topicMap[topic]) topicMap[topic] = []
    topicMap[topic].push(convo.id)
  })

  // limit each node to max 3 edges so clusters don't collapse into a ball
  const edgeCount: Record<string, number> = {}

  Object.values(topicMap).forEach((ids) => {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = ids[i]
        const b = ids[j]
        if ((edgeCount[a] || 0) >= 3) continue
        if ((edgeCount[b] || 0) >= 3) continue
        edges.push({ source: a, target: b })
        edgeCount[a] = (edgeCount[a] || 0) + 1
        edgeCount[b] = (edgeCount[b] || 0) + 1
      }
    }
  })

  return { nodes, edges }
}