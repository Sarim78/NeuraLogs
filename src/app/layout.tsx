import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Neuralogs",
  description:
    "Your AI chat history visualized as an interactive neural network",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}