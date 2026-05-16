"use client";

import type { TestCase } from "@/lib/types";

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const categoryLabels: Record<string, string> = {
  positive: "✅ Positive",
  negative: "❌ Negative",
  edge: "⚠️ Edge Case",
};

interface TestCaseCardProps {
  testCase: TestCase;
}

export default function TestCaseCard({ testCase }: TestCaseCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {testCase.title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {testCase.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${priorityColors[testCase.priority]}`}
          >
            {testCase.priority}
          </span>
        </div>
      </div>
      <div className="mt-2">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {categoryLabels[testCase.category] ?? testCase.category}
        </span>
      </div>
    </div>
  );
}
