"use client";

import { useState } from "react";

export interface TestCase {
  title: string;
  description: string;
  type: "unit" | "integration" | "edge-case" | "regression";
  code: string;
  framework: string;
}

const typeColors: Record<TestCase["type"], string> = {
  unit: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  integration:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "edge-case":
    "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  regression:
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function TestCaseCard({ testCase }: { testCase: TestCase }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(testCase.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4 border-b border-zinc-100 p-4 dark:border-zinc-800">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {testCase.title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {testCase.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${typeColors[testCase.type]}`}
          >
            {testCase.type}
          </span>
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {testCase.framework}
          </span>
        </div>
      </div>

      <div className="relative">
        <pre className="overflow-x-auto p-4 text-sm text-zinc-800 dark:text-zinc-200">
          <code>{testCase.code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
