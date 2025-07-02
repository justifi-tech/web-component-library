# Component Examples

This directory contains examples for the JustiFi web components.

## Setup

The project uses TypeScript with JSX support for better maintainability and type safety.

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Development

```bash
# Start development server with hot reload
pnpm dev

# Build TypeScript files
pnpm build

# Build in watch mode
pnpm build:watch
```

### TypeScript Configuration

- **Target**: ES2020
- **JSX**: Custom JSX renderer (no React dependency)
- **Module**: CommonJS
- **Strict**: Enabled for better type safety

### Project Structure

```
src/
├── index.ts              # Main entry point
├── utils/
│   └── api-paths.ts      # API path constants and types
├── components/           # JSX components (to be added)
├── server/              # Express server abstraction (to be added)
├── templates/           # JSX templates (to be added)
└── types/               # TypeScript type definitions (to be added)
```

### Build Output

Compiled JavaScript files are output to the `dist/` directory with:

- Source maps for debugging
- TypeScript declaration files
- Preserved directory structure

## Custom JSX Renderer

The project uses a custom JSX renderer (`src/utils/simple-jsx.ts`) that converts JSX to HTML strings without React dependency. This provides:

- **Lightweight**: No React runtime overhead
- **Simple**: Direct HTML generation
- **Web Component Friendly**: No conflicts with web component lifecycle
- **Type Safe**: Full TypeScript support

### Usage

```typescript
import { h, renderToString } from './utils/simple-jsx';

const element = (
  <div className="container">
    <h1>Hello World</h1>
  </div>
);

const html = renderToString(element);
```
