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
- An Anthropic API key, get one free at [console.anthropic.com](https://console.anthropic.com)

### Installation

```bash
git clone https://github.com/Sarim78/neuralogs.git
cd neuralogs
npm install
```

### Environment Setup

Create a `.env.local` file in the root of the project:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_key_here
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
- **Claude API** for intelligent topic clustering

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
├── .env.example                # environment variable template
└── README.md
```

---

## Privacy

Neuralogs runs entirely on your local machine. Your conversations never leave your computer, nothing is sent to any server, and your API key lives only in your local `.env.local` file which is never committed to version control.

---

## License

MIT, free to use, modify, and distribute.

---
