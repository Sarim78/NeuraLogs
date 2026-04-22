import JSZip from "jszip"

export async function extractConversations(file: File): Promise<any[]> {
  const zip = await JSZip.loadAsync(file)

  // search all files in zip for conversations.json at any depth
  let conversationsFile = null

  zip.forEach((relativePath, zipEntry) => {
    if (!zipEntry.dir && relativePath.endsWith("conversations.json")) {
      conversationsFile = zipEntry
    }
  })

  if (!conversationsFile) {
    throw new Error(
      "Could not find conversations.json in the zip file. Make sure you are uploading the correct export."
    )
  }

  const raw = await (conversationsFile as any).async("text")

  try {
    const parsed = JSON.parse(raw)
    // handle both array format and object with conversations key
    if (Array.isArray(parsed)) return parsed
    if (parsed.conversations && Array.isArray(parsed.conversations)) return parsed.conversations
    throw new Error("Unexpected format in conversations.json.")
  } catch (e: any) {
    throw new Error(e.message || "conversations.json is not valid JSON.")
  }
}