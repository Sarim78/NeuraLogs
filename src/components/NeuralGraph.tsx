"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { GraphData, GraphNode, GraphEdge } from "@/lib/types"

const TOPIC_COLORS: Record<string, string> = {
  Tech: "#6366f1",
  Health: "#22c55e",
  Finance: "#f59e0b",
  Career: "#3b82f6",
  Creative: "#ec4899",
  Learning: "#8b5cf6",
  Personal: "#f97316",
  Other: "#6b7280",
}

interface NeuralGraphProps {
  data: GraphData
  onNodeClick: (id: string) => void
}

export default function NeuralGraph({ data, onNodeClick }: NeuralGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // clear previous render
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)

    // D3 force simulation
    const simulation = d3
      .forceSimulation(data.nodes as any)
      .force(
        "link",
        d3
          .forceLink(data.edges as any)
          .id((d: any) => d.id)
          .distance(80)
      )
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(20))

    // draw edges
    const link = svg
      .append("g")
      .selectAll("line")
      .data(data.edges)
      .join("line")
      .attr("stroke", "rgba(255,255,255,0.08)")
      .attr("stroke-width", 1)

    // draw nodes
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", (d) => Math.max(4, Math.min(12, d.messageCount / 2)))
      .attr("fill", (d) => TOPIC_COLORS[d.topic] || TOPIC_COLORS.Other)
      .attr("fill-opacity", 0.85)
      .attr("stroke", (d) => TOPIC_COLORS[d.topic] || TOPIC_COLORS.Other)
      .attr("stroke-width", 1.5)
      .attr("cursor", "pointer")
      .on("click", (_event, d) => onNodeClick(d.id))
      .on("mouseover", function () {
        d3.select(this).attr("fill-opacity", 1).attr("r", function () {
          return +d3.select(this).attr("r") + 3
        })
      })
      .on("mouseout", function (_, d) {
        d3.select(this)
          .attr("fill-opacity", 0.85)
          .attr("r", Math.max(4, Math.min(12, d.messageCount / 2)))
      })
      .call(
        d3
          .drag<SVGCircleElement, GraphNode>()
          .on("start", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on("drag", (event, d: any) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on("end", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          })
      )

    // tick update
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)
    })

    return () => {
      simulation.stop()
    }
  }, [data, onNodeClick])

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ background: "transparent" }}
    />
  )
}