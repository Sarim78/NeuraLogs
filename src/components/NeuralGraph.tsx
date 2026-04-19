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

    // set initial transform so zoom starts centered
    const initialTransform = d3.zoomIdentity.translate(0, 0).scale(1)

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.05, 20])
      .filter((event) => event.type !== "dblclick")
      .on("zoom", (event) => {
        container.attr("transform", event.transform)
      })

    svg.call(zoom)
    svg.call(zoom.transform, initialTransform)

    // fully pre-run simulation — completely stopped before drawing
    const simulation = d3
      .forceSimulation(data.nodes as any)
      .force(
        "link",
        d3
          .forceLink(data.edges as any)
          .id((d: any) => d.id)
          .distance(50)
          .strength(0.8)
      )
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(10))
      .stop()

    // run until stable
    for (let i = 0; i < 500; i++) simulation.tick()

    // draw edges — completely static, no tick updates
    container
      .append("g")
      .selectAll("line")
      .data(data.edges)
      .join("line")
      .attr("stroke", (d: any) => TOPIC_COLORS[d.source.topic] || "#ffffff")
      .attr("stroke-opacity", 0.12)
      .attr("stroke-width", 0.4)
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y)

    // draw nodes — completely static
    const node = container
      .append("g")
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", (d) => Math.max(3, Math.min(10, d.messageCount / 2)))
      .attr("fill", (d) => TOPIC_COLORS[d.topic] || TOPIC_COLORS.Other)
      .attr("fill-opacity", 0.8)
      .attr("stroke", (d) => TOPIC_COLORS[d.topic] || TOPIC_COLORS.Other)
      .attr("stroke-width", 0.8)
      .attr("stroke-opacity", 0.4)
      .attr("cursor", "pointer")
      .attr("cx", (d: any) => d.x)
      .attr("cy", (d: any) => d.y)
      .on("click", (event, d) => {
        event.stopPropagation()
        onNodeClick(d.id)
      })
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 2)
          .attr("r", Math.max(3, Math.min(10, d.messageCount / 2)) + 5)
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
          .transition()
          .duration(150)
          .attr("fill-opacity", 0.8)
          .attr("stroke-opacity", 0.4)
          .attr("stroke-width", 0.8)
          .attr("r", Math.max(3, Math.min(10, d.messageCount / 2)))
        onNodeHover(null, 0, 0)
      })

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