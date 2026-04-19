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
    const cx = width / 2
    const cy = height / 2

    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)

    const container = svg.append("g")

    // zoom without jumping
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.05, 20])
      .filter((event) => event.type !== "dblclick")
      .on("zoom", (event) => {
        container.attr("transform", event.transform)
      })

    svg.call(zoom)

    // group nodes by topic
    const topicGroups: Record<string, typeof data.nodes> = {}
    data.nodes.forEach((node) => {
      if (!topicGroups[node.topic]) topicGroups[node.topic] = []
      topicGroups[node.topic].push(node)
    })

    const topics = Object.keys(topicGroups)
    const numTopics = topics.length

    // place topic clusters in a circle around center
    const outerRadius = Math.min(width, height) * 0.38
    const nodePositions: Record<string, { x: number; y: number }> = {}

    topics.forEach((topic, topicIndex) => {
      const angle = (topicIndex / numTopics) * 2 * Math.PI - Math.PI / 2
      const clusterCx = cx + outerRadius * Math.cos(angle)
      const clusterCy = cy + outerRadius * Math.sin(angle)

      const nodes = topicGroups[topic]
      const innerRadius = Math.min(60, nodes.length * 4)

      nodes.forEach((node, nodeIndex) => {
        const nodeAngle = (nodeIndex / nodes.length) * 2 * Math.PI
        const r = nodes.length === 1 ? 0 : innerRadius * (0.4 + Math.random() * 0.6)
        nodePositions[node.id] = {
          x: clusterCx + r * Math.cos(nodeAngle),
          y: clusterCy + r * Math.sin(nodeAngle),
        }
      })
    })

    // assign positions to nodes
    data.nodes.forEach((node) => {
      const pos = nodePositions[node.id]
      if (pos) {
        ;(node as any).x = pos.x
        ;(node as any).y = pos.y
      }
    })

    // build edge lookup for hover highlighting
    const connectedIds: Record<string, Set<string>> = {}
    data.edges.forEach((edge: any) => {
      const s = edge.source?.id || edge.source
      const t = edge.target?.id || edge.target
      if (!connectedIds[s]) connectedIds[s] = new Set()
      if (!connectedIds[t]) connectedIds[t] = new Set()
      connectedIds[s].add(t)
      connectedIds[t].add(s)
    })

    // draw edges
    const link = container
      .append("g")
      .selectAll("line")
      .data(data.edges)
      .join("line")
      .attr("stroke", (d: any) => {
        const sourceNode = data.nodes.find((n) => n.id === (d.source?.id || d.source))
        return TOPIC_COLORS[sourceNode?.topic || "Other"] || "#ffffff"
      })
      .attr("stroke-opacity", 0.08)
      .attr("stroke-width", 0.4)
      .attr("x1", (d: any) => nodePositions[d.source?.id || d.source]?.x || 0)
      .attr("y1", (d: any) => nodePositions[d.source?.id || d.source]?.y || 0)
      .attr("x2", (d: any) => nodePositions[d.target?.id || d.target]?.x || 0)
      .attr("y2", (d: any) => nodePositions[d.target?.id || d.target]?.y || 0)

    // draw nodes
    const node = container
      .append("g")
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", (d) => Math.max(3, Math.min(10, d.messageCount / 2)))
      .attr("fill", (d) => TOPIC_COLORS[d.topic] || TOPIC_COLORS.Other)
      .attr("fill-opacity", 0.85)
      .attr("stroke", (d) => TOPIC_COLORS[d.topic] || TOPIC_COLORS.Other)
      .attr("stroke-width", 0.8)
      .attr("stroke-opacity", 0.5)
      .attr("cursor", "pointer")
      .attr("cx", (d: any) => d.x)
      .attr("cy", (d: any) => d.y)
      .on("click", (event, d) => {
        event.stopPropagation()
        onNodeClick(d.id)
      })
      .on("mouseover", function (event, d) {
        // highlight this node
        d3.select(this)
          .transition().duration(120)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 2.5)
          .attr("r", Math.max(3, Math.min(10, d.messageCount / 2)) + 5)

        // highlight connected edges
        link
          .transition().duration(120)
          .attr("stroke-opacity", (l: any) => {
            const s = l.source?.id || l.source
            const t = l.target?.id || l.target
            return s === d.id || t === d.id ? 0.9 : 0.04
          })
          .attr("stroke-width", (l: any) => {
            const s = l.source?.id || l.source
            const t = l.target?.id || l.target
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
          .transition().duration(120)
          .attr("stroke-opacity", 0.08)
          .attr("stroke-width", 0.4)

        onNodeHover(null, 0, 0)
      })

  }, [data, onNodeClick, onNodeHover])

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ background: "transparent", cursor: "grab" }}
    />
  )
}