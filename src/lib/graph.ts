import { Conversation, GraphData, GraphNode, GraphEdge } from "./types"

export function buildGraph(conversations: Conversation[]): GraphData {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  // build a node for each conversation
  conversations.forEach((convo) => {
    nodes.push({
      id: convo.id,
      title: convo.title,
      topic: convo.topic || "Other",
      messageCount: convo.messages.length,
      source: convo.source,
    })
  })

  // build edges between conversations that share the same topic
  const topicMap: Record<string, string[]> = {}

  conversations.forEach((convo) => {
    const topic = convo.topic || "Other"
    if (!topicMap[topic]) topicMap[topic] = []
    topicMap[topic].push(convo.id)
  })

  // connect nodes within the same topic cluster
  Object.values(topicMap).forEach((ids) => {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        edges.push({
          source: ids[i],
          target: ids[j],
        })
      }
    }
  })

  return { nodes, edges }
}