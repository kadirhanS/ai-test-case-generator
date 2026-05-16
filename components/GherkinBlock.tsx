"use client";

import { useState } from "react";
import type { GherkinScenario } from "@/lib/types";

interface GherkinBlockProps {
  scenarios: GherkinScenario[];
}

export default function GherkinBlock({ scenarios }: GherkinBlockProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (scenarios.length === 0) {
    return null;
  }

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = async () => {
    const all = scenarios
      .map(
        (s, i) =>
          `Scenario ${i + 1}: ${s.scenario}\n  Given ${s.given}\n  When ${s.when}\n  Then ${s.then}`
      )
      .join("\n\n");
    await navigator.clipboard.writeText(all);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Gherkin Scenarios
        </h2>
        <button
          onClick={copyAll}
          className="rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
        >
          Copy All
        </button>
      </div>

      <div className="space-y-3">
        {scenarios.map((scenario, index) => {
          const text = `Scenario: ${scenario.scenario}\n  Given ${scenario.given}\n  When ${scenario.when}\n  Then ${scenario.then}`;

          return (
            <div
              key={index}
              className="relative rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="space-y-1.5 text-zinc-800 dark:text-zinc-200">
                <p>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    Scenario:
                  </span>{" "}
                  {scenario.scenario}
                </p>
                <p>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Given
                  </span>{" "}
                  {scenario.given}
                </p>
                <p>
                  <span className="font-bold text-sky-600 dark:text-sky-400">
                    When
                  </span>{" "}
                  {scenario.when}
                </p>
                <p>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    Then
                  </span>{" "}
                  {scenario.then}
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(text, index)}
                className="absolute right-2 top-2 rounded-md bg-zinc-200/80 px-2 py-1 text-[10px] font-medium text-zinc-500 transition-colors hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                {copiedIndex === index ? "Copied!" : "Copy"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
