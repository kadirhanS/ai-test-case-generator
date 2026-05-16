"use client";

import { useState } from "react";
import type { GenerateResponse } from "@/lib/types";

interface ExportButtonsProps {
  data: GenerateResponse;
}

export default function ExportButtons({ data }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);

  const allTestCases = [
    ...data.positiveCases,
    ...data.negativeCases,
    ...data.edgeCases,
  ];

  const copyToClipboard = async () => {
    const text = allTestCases
      .map(
        (tc) =>
          `[${tc.category.toUpperCase()}] [${tc.priority.toUpperCase()}] ${tc.title}\n  ${tc.description}`
      )
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportFeatureFile = () => {
    const content = `Feature: ${data.featureName}\n\n${data.gherkinScenarios
      .map(
        (s, i) =>
          `Scenario: ${s.scenario}\n  Given ${s.given}\n  When ${s.when}\n  Then ${s.then}`
      )
      .join("\n\n")}`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.featureName.replace(/\s+/g, "-").toLowerCase()}.feature`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportTxtFile = () => {
    const content = `Feature: ${data.featureName}
Generated: ${new Date().toLocaleDateString()}
---
      
${allTestCases
  .map(
    (tc) =>
      `[${tc.category.toUpperCase()}] [${tc.priority.toUpperCase()}] ${tc.title}\n  ${tc.description}`
  )
  .join("\n\n")}
---
      
GHERKIN SCENARIOS:
${data.gherkinScenarios
  .map(
    (s) =>
      `Scenario: ${s.scenario}\n  Given ${s.given}\n  When ${s.when}\n  Then ${s.then}`
  )
  .join("\n\n")}`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.featureName.replace(/\s+/g, "-").toLowerCase()}-test-cases.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={copyToClipboard}
        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        {copied ? "✓ Copied!" : "📋 Copy All"}
      </button>

      <button
        onClick={exportFeatureFile}
        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        📄 Export .feature
      </button>

      <button
        onClick={exportTxtFile}
        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        📝 Export .txt
      </button>
    </div>
  );
}
