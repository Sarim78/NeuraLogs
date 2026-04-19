"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { GraphData, GraphNode } from "../lib/types"

const TOPIC_COLORS: Record<string, string> = {
  "Cybersecurity": "#ef4444",
  "AI & ML": "#8b5cf6",
  "Web Dev": "#3b82f6",
  "Backend": "#06b6d4",
  "Cloud & DevOps": "#f59e0b",
  "Programming": "#6366f1",
  "Data & Analytics": "#10b981",
  "Fitness": "#22c55e",
  "Mental Health": "#a78bfa",
  "Medical": "#f43f5e",
  "Investing": "#fbbf24",
  "Personal Finance": "#84cc16",
  "Business": "#fb923c",
  "Job Search": "#38bdf8",
  "Career Growth": "#0ea5e9",
  "Writing": "#e879f9",
  "Design": "#f472b6",
  "Music": "#c084fc",
  "Math": "#4ade80",
  "School": "#60a5fa",
  "Research": "#34d399",
  "Relationships": "#fb7185",
  "Self Improvement": "#fcd34d",
  "Travel": "#67e8f9",
  "Food": "#fdba74",
  "Other": "#6b7280",
}

interface NeuralGraphProps {
  data: GraphData
  onNodeClick: (id: string) => void
  onNodeHover: (node: GraphNode | null, x: number, y: number) => void
}

export default function NeuralGraph({
  data,
  onNodeClick,
  onNodeHover,
}: NeuralGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)

    const container = svg.append("g")

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.05, 20])
      .filter((event) => {
        return event.type !== "dblclick"
      })
      .on("zoom", (event) => {
        container.attr("transform", event.transform)
      })

    svg.call(zoom)

    const simulation = d3
      .forceSimulation(data.nodes as any)
      .force(
        "link",
        d3
          .forceLink(data.edges as any)
          .id((d: any) => d.id)
          .distance(100)
          .strength(0.3)
      )
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => Math.max(5, Math.min(16, d.messageCount / 2)) + 5))
      .alphaDecay(0.03)
      .stop()

    for (let i = 0; i < 300; i++) simulation.tick()

    const link = container
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.edges)
      .join("line")
      .attr("stroke", (d: any) => TOPIC_COLORS[d.source.topic] || "#ffffff")
      .attr("stroke-opacity", 0.12)
      .attr("stroke-width", 0.5)
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y)

    const node = container
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", (d) => Math.max(3, Math.min(12, d.messageCount / 2)))
      .attr("fill", (d) => TOPIC_COLORS[d.topic] || TOPIC_COLORS.Other)
      .attr("fill-opacity", 0.85)
      .attr("stroke", (d) => TOPIC_COLORS[d.topic] || TOPIC_COLORS.Other)
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.5)
      .attr("cursor", "pointer")
      .attr("cx", (d: any) => d.x)
      .attr("cy", (d: any) => d.y)
      .on("click", (event, d) => {
        event.stopPropagation()
        onNodeClick(d.id)
      })
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("fill-opacity", 1)
          .attr("r", Math.max(3, Math.min(12, d.messageCount / 2)) + 3)
        onNodeHover(d, event.pageX, event.pageY)
      })
      .on("mousemove", function (event) {
        onNodeHover(
          d3.select(this).datum() as GraphNode,
          event.pageX,
          event.pageY
        )
      })
      .on("mouseout", function (_, d) {
        d3.select(this)
          .attr("fill-opacity", 0.85)
          .attr("r", Math.max(3, Math.min(12, d.messageCount / 2)))
        onNodeHover(null, 0, 0)
      })
      .call(
        d3
          .drag<SVGCircleElement, GraphNode>()
          .on("start", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.1).restart()
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

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)
      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y)
    })

    simulation.restart()

    return () => {
      simulation.stop()
    }
  }, [data, onNodeClick, onNodeHover])

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ background: "transparent", cursor: "grab" }}
    />
  )
}