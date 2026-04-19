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

  const edgeCount: Record<string, number> = {}

  // connect within same topic max 4 edges
  Object.values(topicMap).forEach((ids) => {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = ids[i]
        const b = ids[j]
        if ((edgeCount[a] || 0) >= 4) continue
        if ((edgeCount[b] || 0) >= 4) continue
        edges.push({ source: a, target: b })
        edgeCount[a] = (edgeCount[a] || 0) + 1
        edgeCount[b] = (edgeCount[b] || 0) + 1
      }
    }
  })

  // connect every topic to every other topic with 2 bridge edges
  const topicKeys = Object.keys(topicMap)
  for (let i = 0; i < topicKeys.length; i++) {
    for (let j = i + 1; j < topicKeys.length; j++) {
      const aIds = topicMap[topicKeys[i]]
      const bIds = topicMap[topicKeys[j]]
      if (aIds.length && bIds.length) {
        edges.push({ source: aIds[0], target: bIds[0] })
        if (aIds.length > 1 && bIds.length > 1) {
          edges.push({ source: aIds[1], target: bIds[1] })
        }
      }
    }
  }

  return { nodes, edges }
}