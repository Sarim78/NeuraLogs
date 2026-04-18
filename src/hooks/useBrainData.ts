import { useState } from "react"
import { Conversation, GraphData } from "../lib/types"
import { extractConversations } from "../lib/unzip"
import { parseConversations } from "../lib/parser"
import { clusterConversations } from "../lib/clusterer"
import { buildGraph } from "../lib/graph"

type Status = "idle" | "unzipping" | "parsing" | "clustering" | "done" | "error"

export function useBrainData() {
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [graphData, setGraphData] = useState<GraphData | null>(null)

  async function processFile(file: File) {
    try {
      // step 1 — unzip
      setStatus("unzipping")
      const raw = await extractConversations(file)

      // step 2 — parse
      setStatus("parsing")
      const parsed = parseConversations(raw)

      // step 3 — cluster topics via keywords
      setStatus("clustering")
      const clustered = clusterConversations(parsed)
      setConversations(clustered)

      // step 4 — build graph
      const graph = buildGraph(clustered)
      setGraphData(graph)

      setStatus("done")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
      setStatus("error")
    }
  }

  function reset() {
    setStatus("idle")
    setError(null)
    setConversations([])
    setGraphData(null)
  }

  return {
    status,
    error,
    conversations,
    graphData,
    processFile,
    reset,
  }
}