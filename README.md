# AI Test Case Generator

An intelligent web application that leverages AI to automatically generate comprehensive test cases from your source code. Built with Next.js 16, React 19, and Tailwind CSS v4.

## Features

- **Smart Code Analysis**: Paste any code snippet and get relevant test cases
- **Multi-Framework Support**: Generates tests for Jest, Vitest, and React Testing Library
- **Edge Case Detection**: AI identifies boundary conditions and edge cases automatically
- **Modern UI**: Clean, responsive interface built with Tailwind CSS v4
- **Real-time Streaming**: See test cases generated as they're created

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your OpenAI API key to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai)
- **Language**: TypeScript

## Project Structure

```
ai-test-case-generator/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts      # AI test generation endpoint
│   ├── results/
│   │   └── page.tsx           # Test results display
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page (code input)
├── components/
│   ├── CodeInput.tsx          # Code editor/input component
│   ├── Header.tsx             # Navigation header
│   └── TestCaseCard.tsx       # Test case display component
├── lib/
│   └── ai.ts                  # AI client configuration
├── .env.example               # Environment variables template
├── opencode.json              # OpenCode AI configuration
└── package.json
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for test generation |

## License

MIT
