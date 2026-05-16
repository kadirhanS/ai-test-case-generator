"use client";

import { useState } from "react";

interface CodeInputProps {
  onGenerate: (code: string, framework: string) => void;
  isLoading: boolean;
}

export default function CodeInput({ onGenerate, isLoading }: CodeInputProps) {
  const [code, setCode] = useState("");
  const [framework, setFramework] = useState("jest");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onGenerate(code.trim(), framework);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="code-input"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Paste your code
        </label>
        <textarea
          id="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Paste your JavaScript/TypeScript code here..."
          rows={12}
          className="w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:ring-zinc-800"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="framework-select"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Framework:
          </label>
          <select
            id="framework-select"
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-zinc-800"
          >
            <option value="jest">Jest</option>
            <option value="vitest">Vitest</option>
            <option value="rtl">React Testing Library</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !code.trim()}
          className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {isLoading ? "Generating..." : "Generate Tests"}
        </button>
      </div>
    </form>
  );
}
