# Neuralogs

> **⚠️ Under Active Development**: This project is a work in progress. Features may be incomplete, broken, or subject to change. Contributions and feedback are welcome.

---

I'm working on a project where it takes all your AI chat history and turns it into a brain shaped neural network so you can actually see how you think and visualize your entire thought process.

Upload your Claude or ChatGPT conversation export and watch it transform into an interactive, force-directed neural graph where every node is a conversation, every cluster is a topic, and every connection is a pattern in how you think.

---

## What It Does

- Upload your `.zip` chat export from Claude or ChatGPT
- Conversations are automatically parsed and categorized by topic
- Rendered as a live, interactive neural network you can explore
- Click any node to read the full conversation thread
- All processing happens locally in your browser, your data never leaves your machine

---

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
git clone https://github.com/Sarim78/neuralogs.git
cd neuralogs
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How to Export Your Chat History

**Claude:**
1. Go to [claude.ai](https://claude.ai)
2. Settings → Privacy → Export Data
3. Download the `.zip` file

**ChatGPT:**
1. Go to [chatgpt.com](https://chatgpt.com)
2. Settings → Data Controls → Export Data
3. Download the `.zip` file

Once downloaded, drag and drop the `.zip` directly into Neuralogs.

---

## Tech Stack

- **Next.js 14** + TypeScript
- **D3.js** for force-directed graph visualization
- **Tailwind CSS** for styling and dark theme
- **JSZip** for client-side zip extraction
- **Framer Motion** for animations

---

## Project Structure

```
neuralogs/
├── public/
│   └── sample-data.json        # demo data for first load
├── src/
│   ├── app/                    # Next.js app router
│   ├── components/             # UI components
│   ├── lib/                    # core logic (parser, clusterer, graph)
│   └── hooks/                  # React hooks
└── README.md
```

---

## Privacy and Data Safety

Neuralogs has no backend, no database, and no server. There is nowhere for your data to go.

When you upload your zip file, it is opened and processed entirely inside your own browser using JavaScript. Your conversations are never transmitted over the internet, never stored on any server, and never seen by anyone other than you. The moment you close or refresh the tab, everything is gone.

This is not a promise or a policy; it is how the technology works. A client-side only application is physically incapable of sending your data anywhere without your knowledge.

You are not creating an account. You are not agreeing to the terms of service. You are not handing your data to a third party. You are running a local tool that reads a file on your machine and draws a graph on your screen.

---

## Disclaimer

Neuralogs is an open source personal project provided as-is with no warranties. It is not affiliated with Anthropic or OpenAI. Your chat export files belong to you and are processed exclusively on your own machine.

---

## License

MIT, free to use, modify, and distribute.
