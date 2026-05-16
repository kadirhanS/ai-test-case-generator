# AI Test Case Generator

Describe a feature and get comprehensive test cases with Gherkin scenarios — powered by AI.

Built with Next.js 16, React 19, and Tailwind CSS v4. Uses OpenRouter API for model-agnostic AI access.

## Features

- **Feature-Based Input**: Describe any feature (e.g. "Login Page", "Shopping Cart")
- **AI-Powered Test Generation**: Generates positive, negative, and edge case tests
- **Gherkin Scenarios**: Automatically creates Given/When/Then scenarios
- **Multi-Model Support**: Choose from free or paid models via OpenRouter
- **Export Options**: Copy all, export as `.feature` or `.txt`
- **Your Own API Key**: Bring your own OpenRouter key — never stored on servers

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), enter your OpenRouter API key, select a model, and start generating test cases.

## How It Works

```
User: "Login Page" + "Email/password login form..."
         ↓
    OpenRouter API (choose your model)
         ↓
    ✅ Positive Cases: correct login flows
    ❌ Negative Cases: wrong password, empty fields
    ⚠️ Edge Cases: SQL injection, rate limiting, concurrency
    📋 Gherkin: Scenario / Given / When / Then
         ↓
    Export: Copy All / .feature / .txt
```

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **AI Provider**: [OpenRouter](https://openrouter.ai) (multi-model)
- **Language**: TypeScript

## Project Structure

```
ai-test-case-generator/
├── app/
│   ├── api/
│   │   ├── generate/route.ts   # AI test generation endpoint
│   │   └── models/route.ts      # Model list (free/paid)
│   ├── results/page.tsx         # Test results display
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page (feature input)
├── components/
│   ├── TestCaseForm.tsx         # Input form (API key, model, feature)
│   ├── TestCaseCard.tsx         # Test case display card
│   ├── GherkinBlock.tsx         # Gherkin scenario display
│   └── ExportButtons.tsx        # Copy / .feature / .txt export
├── lib/
│   ├── types.ts                 # TypeScript types
│   ├── openrouter.ts            # OpenRouter API client
│   └── prompt-templates.ts      # AI prompt templates
├── opencode.json                # OpenCode AI configuration (Project Manager agent)
└── package.json
```

## Environment Variables

You don't need a server-side API key. Users enter their own OpenRouter API key in the UI.

| Variable | Description |
|----------|-------------|
| (none required) | API key is provided by the user in the browser |

## License

MIT
