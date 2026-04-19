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

  const edgeSet = new Set<string>()

  function addEdge(a: string, b: string) {
    const key = [a, b].sort().join("__")
    if (!edgeSet.has(key)) {
      edgeSet.add(key)
      edges.push({ source: a, target: b })
    }
  }

  // connect within same topic — chain style so it looks like a cluster
  Object.values(topicMap).forEach((ids) => {
    for (let i = 0; i < ids.length - 1; i++) {
      addEdge(ids[i], ids[i + 1])
    }
    // add a few extra connections for density
    for (let i = 0; i < Math.min(ids.length, 5); i++) {
      const j = Math.floor(Math.random() * ids.length)
      if (i !== j) addEdge(ids[i], ids[j])
    }
  })

  // connect every topic cluster to every other — makes one big brain
  const topicKeys = Object.keys(topicMap)
  for (let i = 0; i < topicKeys.length; i++) {
    for (let j = i + 1; j < topicKeys.length; j++) {
      const aIds = topicMap[topicKeys[i]]
      const bIds = topicMap[topicKeys[j]]
      // 3 bridge edges between every pair of topics
      const bridges = Math.min(3, aIds.length, bIds.length)
      for (let k = 0; k < bridges; k++) {
        addEdge(aIds[k % aIds.length], bIds[k % bIds.length])
      }
    }
  }

  return { nodes, edges }
}