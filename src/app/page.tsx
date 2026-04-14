"use client"

import { useState } from "react"
import { useBrainData } from "@/hooks/useBrainData"
import NeuralGraph from "@/components/NeuralGraph"
import FileUpload from "@/components/FileUpload"
import ConvoDrawer from "@/components/ConvoDrawer"
import DemoBanner from "@/components/DemoBanner"
import TopicLegend from "@/components/TopicLegend"
import NodeTooltip from "@/components/NodeTooltip"
import { GraphNode } from "@/lib/types"

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

  return (
    <main className="relative w-screen h-screen bg-[#0a0a0a] overflow-hidden">
      {/* demo banner */}
      {isDemo && showBanner && (
        <DemoBanner onDismiss={() => setShowBanner(false)} />
      )}

      {/* title */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 text-center">
        <h1 className="text-white/80 text-sm font-medium tracking-widest uppercase">
          Neuralogs
        </h1>
        <p className="text-white/30 text-xs mt-0.5">
          your mind, visualized
        </p>
      </div>

      {/* upload or graph */}
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
          <div className="absolute inset-0">
            <NeuralGraph
              data={graphData}
              onNodeClick={(id) => setSelectedId(id)}
            />
          </div>

          {/* topic legend */}
          <TopicLegend />

          {/* reset button */}
          <button
            onClick={reset}
            className="absolute top-6 right-6 z-40 text-white/30 hover:text-white text-xs transition-colors border border-white/10 rounded-lg px-3 py-1.5"
          >
            Reset
          </button>

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