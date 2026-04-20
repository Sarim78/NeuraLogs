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
  const zoomRef = useRef<d3.ZoomTransform>(d3.zoomIdentity)

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const cx = width / 2
    const cy = height / 2
    const isMobile = width < 768

    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)

    const container = svg.append("g")
    container.attr("transform", zoomRef.current.toString())

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.05, 20])
      .filter((event) => {
        // on mobile allow pinch zoom but not mouse drag conflicts
        if (isMobile) return event.type === "touchstart" || event.type === "touchmove" || event.type === "wheel"
        return event.type !== "dblclick"
      })
      .on("zoom", (event) => {
        zoomRef.current = event.transform
        container.attr("transform", event.transform)
      })

    svg.call(zoom)
    svg.call(zoom.transform, zoomRef.current)

    const topicGroups: Record<string, typeof data.nodes> = {}
    data.nodes.forEach((node) => {
      if (!topicGroups[node.topic]) topicGroups[node.topic] = []
      topicGroups[node.topic].push(node)
    })

    const topics = Object.keys(topicGroups)
    const numTopics = topics.length
    const outerRadius = Math.min(width, height) * (isMobile ? 0.32 : 0.38)
    const nodePositions: Record<string, { x: number; y: number }> = {}

    topics.forEach((topic, topicIndex) => {
      const angle = (topicIndex / numTopics) * 2 * Math.PI - Math.PI / 2
      const clusterCx = cx + outerRadius * Math.cos(angle)
      const clusterCy = cy + outerRadius * Math.sin(angle)
      const nodes = topicGroups[topic]
      const innerRadius = Math.min(isMobile ? 35 : 55, nodes.length * 3.5)

      nodes.forEach((node, nodeIndex) => {
        const nodeAngle = (nodeIndex / Math.max(nodes.length, 1)) * 2 * Math.PI
        const r = nodes.length === 1 ? 0 : innerRadius * (0.3 + (nodeIndex % 3) * 0.25)
        nodePositions[node.id] = {
          x: clusterCx + r * Math.cos(nodeAngle),
          y: clusterCy + r * Math.sin(nodeAngle),
        }
      })
    })

    const link = container
      .append("g")
      .selectAll("line")
      .data(data.edges)
      .join("line")
      .attr("stroke", (d: any) => {
        const sourceId = typeof d.source === "string" ? d.source : d.source?.id
        const sourceNode = data.nodes.find((n) => n.id === sourceId)
        return TOPIC_COLORS[sourceNode?.topic || "Other"] || "#ffffff"
      })
      .attr("stroke-opacity", 0.08)
      .attr("stroke-width", 0.4)
      .attr("x1", (d: any) => {
        const id = typeof d.source === "string" ? d.source : d.source?.id
        return nodePositions[id]?.x || cx
      })
      .attr("y1", (d: any) => {
        const id = typeof d.source === "string" ? d.source : d.source?.id
        return nodePositions[id]?.y || cy
      })
      .attr("x2", (d: any) => {
        const id = typeof d.target === "string" ? d.target : d.target?.id
        return nodePositions[id]?.x || cx
      })
      .attr("y2", (d: any) => {
        const id = typeof d.target === "string" ? d.target : d.target?.id
        return nodePositions[id]?.y || cy
      })

    const node = container
      .append("g")
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", (d) => Math.max(isMobile ? 4 : 3, Math.min(isMobile ? 8 : 10, d.messageCount / 2)))
      .attr("fill", (d) => TOPIC_COLORS[d.topic] || TOPIC_COLORS.Other)
      .attr("fill-opacity", 0.85)
      .attr("stroke", (d) => TOPIC_COLORS[d.topic] || TOPIC_COLORS.Other)
      .attr("stroke-width", 0.8)
      .attr("stroke-opacity", 0.5)
      .attr("cursor", "pointer")
      .attr("cx", (d) => nodePositions[d.id]?.x || cx)
      .attr("cy", (d) => nodePositions[d.id]?.y || cy)
      .on("click", (event, d) => {
        event.stopPropagation()
        onNodeClick(d.id)
      })

    // only add hover effects on desktop
    if (!isMobile) {
      node
        .on("mouseover", function (event, d) {
          d3.select(this)
            .transition().duration(120)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 2.5)
            .attr("r", Math.max(3, Math.min(10, d.messageCount / 2)) + 5)

          link
            .attr("stroke-opacity", (l: any) => {
              const s = typeof l.source === "string" ? l.source : l.source?.id
              const t = typeof l.target === "string" ? l.target : l.target?.id
              return s === d.id || t === d.id ? 0.9 : 0.03
            })
            .attr("stroke-width", (l: any) => {
              const s = typeof l.source === "string" ? l.source : l.source?.id
              const t = typeof l.target === "string" ? l.target : l.target?.id
              return s === d.id || t === d.id ? 1.5 : 0.4
            })

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
            .transition().duration(120)
            .attr("fill-opacity", 0.85)
            .attr("stroke-opacity", 0.5)
            .attr("stroke-width", 0.8)
            .attr("r", Math.max(3, Math.min(10, d.messageCount / 2)))

          link
            .attr("stroke-opacity", 0.08)
            .attr("stroke-width", 0.4)

          onNodeHover(null, 0, 0)
        })
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