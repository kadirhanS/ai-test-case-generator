// ─── GherkinBlock Component ──────────────────────────────────────
// AI tarafından üretilen Gherkin senaryolarını Given/When/Then
// formatında görüntüler. Her senaryo ayrı ayrı kopyalanabilir,
// tüm senaryolar tek tuşla kopyalanabilir. Gherkin formatındaki
// anahtar kelimeler renk kodludur: Scenario=indigo, Given=green,
// When=blue, Then=red. Düzenleme modunda tüm alanlar input'a dönüşür.

"use client";

import { useState } from "react";
import type { GherkinScenario } from "@/lib/types";

interface GherkinBlockProps {
  scenarios: GherkinScenario[];
  isEditing?: boolean;
  onUpdate?: (index: number, updated: GherkinScenario) => void;
}

export default function GherkinBlock({
  scenarios,
  isEditing = false,
  onUpdate,
}: GherkinBlockProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (scenarios.length === 0) {
    return null;
  }

  // Tek senaryoyu panoya kopyala
  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Tüm senaryoları panoya kopyala
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
      {/* Başlık ve Copy All butonu */}
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

      {/* Senaryo listesi */}
      <div className="space-y-3">
        {scenarios.map((scenario, index) => {
          const text = `Scenario: ${scenario.scenario}\n  Given ${scenario.given}\n  When ${scenario.when}\n  Then ${scenario.then}`;

          return (
            <div
              key={index}
              className="relative rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              {isEditing && onUpdate ? (
                /* ── Edit modu ───────────────────────────────── */
                <div className="space-y-2">
                  <div>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      Scenario:{" "}
                    </span>
                    <input
                      type="text"
                      value={scenario.scenario}
                      onChange={(e) =>
                        onUpdate(index, {
                          ...scenario,
                          scenario: e.target.value,
                        })
                      }
                      className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Given{" "}
                    </span>
                    <input
                      type="text"
                      value={scenario.given}
                      onChange={(e) =>
                        onUpdate(index, {
                          ...scenario,
                          given: e.target.value,
                        })
                      }
                      className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-sky-600 dark:text-sky-400">
                      When{" "}
                    </span>
                    <input
                      type="text"
                      value={scenario.when}
                      onChange={(e) =>
                        onUpdate(index, {
                          ...scenario,
                          when: e.target.value,
                        })
                      }
                      className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      Then{" "}
                    </span>
                    <input
                      type="text"
                      value={scenario.then}
                      onChange={(e) =>
                        onUpdate(index, {
                          ...scenario,
                          then: e.target.value,
                        })
                      }
                      className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                    />
                  </div>
                </div>
              ) : (
                /* ── Görüntüleme modu ────────────────────────── */
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
              )}

              {/* Copy butonu (edit modunda da göster) */}
              {!isEditing && (
                <button
                  onClick={() => copyToClipboard(text, index)}
                  className="absolute right-2 top-2 rounded-md bg-zinc-200/80 px-2 py-1 text-[10px] font-medium text-zinc-500 transition-colors hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                >
                  {copiedIndex === index ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
