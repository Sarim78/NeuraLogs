import Anthropic from "@anthropic-ai/sdk"
import { Conversation } from "./types"

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// tag a single conversation with a topic
async function tagConversation(convo: Conversation): Promise<string> {
  const firstMessage = convo.messages[0]?.content || convo.title

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 10,
    messages: [
      {
        role: "user",
        content: `Categorize this conversation in one word. Choose from: Tech, Health, Finance, Career, Creative, Learning, Personal, Other. Reply with just the one word, nothing else.\n\nConversation: "${firstMessage}"`,
      },
    ],
  })

  const topic = (response.content[0] as any).text.trim()
  return topic || "Other"
}

// tag all conversations
export async function clusterConversations(
  conversations: Conversation[]
): Promise<Conversation[]> {
  const tagged = await Promise.all(
    conversations.map(async (convo) => {
      try {
        const topic = await tagConversation(convo)
        return { ...convo, topic }
      } catch {
        return { ...convo, topic: "Other" }
      }
    })
  )

  return tagged
}