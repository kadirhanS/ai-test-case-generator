# 🤖 AI Test Case Generator

Describe any feature and get comprehensive test cases with Gherkin scenarios — powered by AI.

Built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. Uses **OpenRouter API** to provide access to dozens of AI models (free and paid).

---

## ✨ What It Does

Instead of writing test cases manually, just describe your feature in plain English:

```
Feature: "Login Page"
Description: "Email/password login form with validation and error handling"
```

AI instantly generates:

| Category | Description |
|----------|-------------|
| ✅ **Positive Cases** | Happy path scenarios — feature works correctly |
| ❌ **Negative Cases** | Error handling — wrong passwords, empty fields, attacks |
| ⚠️ **Edge Cases** | Boundary conditions — concurrency, extreme values, limits |
| 📋 **Gherkin Scenarios** | Given/When/Then format ready for automation |

---

## 🎯 How to Use

### 1. Get an OpenRouter API Key

1. Go to [openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up / Sign in
3. Create a new API key (free models available — no credit card required)

### 2. Run the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Generate Test Cases

1. Enter your OpenRouter API key (🔒 **session-only** — never stored on server)
2. Select your plan: **Free** or **Paid**
3. Choose a model (stable free models like Gemini 2.0 Flash are pre-selected)
4. Enter a **Feature Name** (e.g. "Shopping Cart")
5. Describe the feature in detail
6. Click **Generate Test Cases** 🚀

### 4. Export Results

- 📋 **Copy All** — paste into your test management tool
- 📄 **Export .feature** — Gherkin scenarios ready for Behat/Cucumber
- 📝 **Export .txt** — plain text report for documentation

---

## 🛡️ Security & Privacy

| Concern | How We Handle It |
|---------|-----------------|
| **Your API Key** | Stored in `sessionStorage` — **automatically deleted** when you close the tab/browser |
| **Server Storage** | Your key is **never saved** on our server — it's sent directly to OpenRouter |
| **Your Feature Data** | Feature descriptions are sent to OpenRouter for AI processing, never logged or stored |
| **No Server-Side Keys** | The app requires **zero** environment variables — everything is user-provided |

---

## 🧠 How It's Made

Built by a QA engineer who believes AI should make testing faster, not replace testers. 

The entire project uses **free AI models** (via OpenRouter) and **open-source technologies**. No paid subscriptions, no locked-in services — just a developer, a browser, and an AI coding assistant.

---


## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **UI** | [React 19](https://react.dev) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) |
| **AI Provider** | [OpenRouter](https://openrouter.ai) (multi-model gateway) |
| **Language** | TypeScript |
| **Font** | Geist (Vercel) |

---

## 📁 Project Structure

```
ai-test-case-generator/
│
├── app/
│   ├── api/
│   │   ├── generate/route.ts    # POST — generates test cases via OpenRouter
│   │   └── models/route.ts      # GET — lists available models (free/paid)
│   ├── results/page.tsx          # Test results display page
│   ├── layout.tsx                # Root layout with Geist font
│   ├── page.tsx                  # Main page with input form
│   └── globals.css               # Tailwind CSS entry point
│
├── components/
│   ├── TestCaseForm.tsx          # Main form: API key, plan, model, feature input
│   ├── TestCaseCard.tsx          # Individual test case display
│   ├── GherkinBlock.tsx          # Gherkin Given/When/Then scenarios
│   └── ExportButtons.tsx         # Copy / .feature / .txt export actions
│
├── lib/
│   ├── types.ts                  # TypeScript type definitions
│   ├── openrouter.ts             # OpenRouter API client
│   └── prompt-templates.ts       # AI system prompt template
│
├── opencode.json                 # OpenCode project-manager subagent config
├── .opencode/prompts/            # Agent system prompts
│
├── .env.local                    # (optional — not needed, users bring their own key)
├── package.json
└── README.md
```

---

## 🚀 Deployment

Deploy to Vercel with zero configuration:

```bash
npm run build
```

Or click the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

> **Note:** No environment variables needed — users enter their own API key in the UI.

---

## 🧪 Local Development

```bash
# Install
npm install

# Develop
npm run dev        # http://localhost:3000

# Build
npm run build

# Lint
npm run lint
```

---

## 📄 License

MIT — use it, fork it, share it, learn from it. ✌️

---

*Built with ☕ and open-source tools · Powered by OpenRouter*
