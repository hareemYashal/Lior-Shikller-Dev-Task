# Markdown to Tiptap Converter

[Deployed URL](https://lior-shikller-dev-task-npmh-ecowc7v56-hareems-projects-5eadc72a.vercel.app/)

A modular, plugin-based Markdown-to-Tiptap converter built with Next.js, TypeScript, and TipTap. This project allows you to convert Markdown text into Tiptap JSON content and display it in a Tiptap editor.

## Features

- Custom Markdown parser built on top of markdown-it
- Modular extension system for markdown elements
- Support for various markdown features:
  - Headings (# H1, ## H2, etc.)
  - Bold and Italic formatting (**bold**, *italic*)
  - Code blocks and inline code (triple backticks, `code`)
  - Links ([text](url))
  - Lists (ordered and unordered)
  - Task lists (- [ ] task, - [x] completed)
  - Tables (pipe syntax)
  - Blockquotes (> quote)
  - Strikethrough (~~text~~)
- Live preview of rendered content in Tiptap


## Architecture

The project follows a modular, plugin-based architecture with these core components:

### 1. MarkdownParser

The `MarkdownParser` class in `/parser/MarkdownParser.ts` is the core of the conversion process. It:
- Uses markdown-it as the underlying markdown engine
- Supports registering custom extensions for each markdown element
- Provides a `parse()` method to convert markdown strings into Tiptap JSON content

### 2. Extension System

Each markdown element has its own extension in the `/parser/extensions/` directory. Extensions follow the `MarkdownExtension` interface and are responsible for:
- Registering their parser plugin via markdown-it
- Optionally post-processing the parsed tokens

### 3. Tiptap Editor

The `TiptapEditor` component in `/components/TiptapEditor.tsx` renders the Tiptap editor with the converted content. It's configured with all necessary extensions to display the markdown elements properly.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the converter in action.

## Usage

### Using the Demo Page

The demo page at `/app/page.tsx` provides a simple interface for testing the Markdown-to-Tiptap converter:

1. Enter or paste markdown text in the input area on the left
2. See the rendered output in the Tiptap editor on the right
3. View the generated Tiptap JSON structure below

### Using the Parser in Your Code

```typescript
import { MarkdownParser } from '../parser/MarkdownParser';
import * as extensions from '../parser/extensions';

// Create a parser instance
const parser = new MarkdownParser();

// Register all extensions
Object.values(extensions).forEach(ext => parser.registerExtension(ext));

// Convert markdown to Tiptap JSON
const markdownText = '# Hello World';
const tiptapJSON = parser.parse(markdownText);

// Use the JSON with a Tiptap editor
```

### Adding New Extensions

To add support for a new markdown feature:

1. Create a new extension file in `/parser/extensions/`
2. Implement the `MarkdownExtension` interface
3. Export the extension from `/parser/extensions/index.ts`

Example extension:

```typescript
import { MarkdownExtension } from '../MarkdownParser';
import MarkdownIt from 'markdown-it';

export const MyExtension: MarkdownExtension = {
  name: 'my_extension',
  setup(md: MarkdownIt) {
    // Register markdown-it plugins or rules here
  },
  postProcess(tokens) {
    // Optionally modify tokens before conversion to Tiptap JSON
    return tokens;
  }
};
```


## License

MIT
