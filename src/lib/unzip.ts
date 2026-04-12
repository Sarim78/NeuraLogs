import JSZip from "jszip"

export async function extractConversations(file: File): Promise<any[]> {
  // load the zip file
  const zip = await JSZip.loadAsync(file)

  // find conversations.json inside the zip
  const conversationsFile =
    zip.file("conversations.json") ||
    zip.file(/conversations\.json/)[0]

  if (!conversationsFile) {
    throw new Error(
      "Could not find conversations.json in the zip file. Make sure you are uploading the correct export."
    )
  }

  // extract the raw text
  const raw = await conversationsFile.async("text")

  // parse and return
  try {
    return JSON.parse(raw)
  } catch {
    throw new Error("conversations.json is not valid JSON.")
  }
}