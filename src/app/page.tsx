"use client"

import { useState } from "react"
import { useBrainData } from "../hooks/useBrainData"
import NeuralGraph from "../components/NeuralGraph"
import FileUpload from "../components/FileUpload"
import ConvoDrawer from "../components/ConvoDrawer"
import DemoBanner from "../components/DemoBanner"
import TopicLegend from "../components/TopicLegend"
import NodeTooltip from "../components/NodeTooltip"
import { GraphNode } from "../lib/types"

export default function Home() {
  const { status, error, conversations, graphData, processFile, reset } =
    useBrainData()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showBanner, setShowBanner] = useState(true)
  const [tooltip, setTooltip] = useState<{
    node: GraphNode
    x: number
    y: number
  } | null>(null)

  const selectedConvo =
    conversations.find((c) => c.id === selectedId) || null

  const isDemo = status === "idle"

  function handleNodeClick(id: string) {
    setSelectedId(id)
  }

  function handleNodeHover(node: GraphNode | null, x: number, y: number) {
    if (node) {
      setTooltip({ node, x, y })
    } else {
      setTooltip(null)
    }
  }

  return (
    <main className="relative w-screen h-screen bg-[#0a0a0a] overflow-hidden">

      {/* demo banner */}
      {isDemo && showBanner && (
        <DemoBanner onDismiss={() => setShowBanner(false)} />
      )}

      {/* top bar */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 h-12 border-b border-white/5 backdrop-blur-sm">
        <p className="text-white font-bold text-xs">
          All processing happens locally. No data is collected or transmitted.
        </p>
        <div className="text-center absolute left-1/2 -translate-x-1/2">
          <h1 className="text-white text-sm font-semibold tracking-widest uppercase">
            Neuralogs
          </h1>
          <p className="text-white/30 text-xs">your mind, visualized</p>
        </div>
        {graphData && (
          <button
            onClick={reset}
            className="text-white/40 hover:text-white text-xs transition-colors border border-white/10 hover:border-white/30 rounded-lg px-3 py-1.5"
          >
            Reset
          </button>
        )}
        {!graphData && <div />}
      </div>

      {/* upload screen */}
      {!graphData ? (
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <div className="w-full max-w-md flex flex-col gap-4">
            <p className="text-white/40 text-xs text-center">
              Upload your Claude or ChatGPT export zip to get started
            </p>
            <FileUpload onUpload={processFile} status={status} />
            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* neural graph */}
          <div className="absolute inset-0 pt-12">
            <NeuralGraph
              data={graphData}
              onNodeClick={handleNodeClick}
              onNodeHover={handleNodeHover}
            />
          </div>

          {/* topic legend */}
          <TopicLegend />

          {/* conversation drawer */}
          <ConvoDrawer
            conversation={selectedConvo}
            onClose={() => setSelectedId(null)}
          />

          {/* tooltip */}
          {tooltip && (
            <NodeTooltip
              title={tooltip.node.title}
              topic={tooltip.node.topic}
              messageCount={tooltip.node.messageCount}
              source={tooltip.node.source}
              x={tooltip.x}
              y={tooltip.y}
            />
          )}
        </>
      )}
    </main>
  )
}