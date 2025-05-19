# Find That Bookmark

Search your bookmarks by meaning—not just keywords. Find what you saved, even if you forgot the exact words.

Find That Bookmark is a Chrome extension that performs semantic search over your bookmarks entirely
in the browser. It uses ONNX Runtime WebAssembly and Hugging Face Transformers with a
model2vec static small embedding model to compute semantic embeddings, then ranks your bookmarks
by cosine similarity to your query.

## Features

- In-browser semantic search of Chrome bookmarks (no external server)
- ONNX Runtime WebAssembly (WASM) core
- Hugging Face Transformers JS library with a model2vec static small model
- Instant similarity ranking via cosine similarity
- Built with Vite, React, TypeScript, and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or Yarn
- Google Chrome (v92+)

### Installation

```bash
git clone https://github.com/yourusername/bookmarks-search.git
cd bookmarks-search
npm install
```

### Development

Run a watch build (rebuilds on file changes):

```bash
npm run dev
```

Then load the extension in Chrome:

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `build/` folder

### Production Build

```bash
npm run build
npm run pack
```

This outputs:

- A `build/` directory containing the unpacked extension assets
- An `extension.zip` file ready for distribution

### Testing

Unit tests use Jest:

```bash
npm run test:unit
```