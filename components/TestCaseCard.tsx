// ─── TestCaseCard Component ──────────────────────────────────────
// AI tarafından üretilen tek bir test senaryosunu görüntüler.
// Düzenleme modunda başlık ve açıklama alanları input'a dönüşür.
// Testin başlığı, açıklaması, önceliği ve kategorisi kart
// şeklinde düzenlenmiştir. Öncelik seviyesine göre renk kodlaması
// yapılır: high=red, medium=amber, low=green.

"use client";

import type { TestCase } from "@/lib/types";

// Öncelik seviyesine göre badge renkleri
const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

// Kategori etiketleri ve emoji ön ekleri
const categoryLabels: Record<string, string> = {
  positive: "✅ Positive",
  negative: "❌ Negative",
  edge: "⚠️ Edge Case",
};

interface TestCaseCardProps {
  testCase: TestCase;
  isEditing?: boolean;
  onUpdate?: (updated: TestCase) => void;
}

export default function TestCaseCard({
  testCase,
  isEditing = false,
  onUpdate,
}: TestCaseCardProps) {
  // Düzenleme modu: title ve description input olarak gösterilir
  if (isEditing && onUpdate) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={testCase.title}
              onChange={(e) =>
                onUpdate({ ...testCase, title: e.target.value })
              }
              className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm font-semibold text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <textarea
              value={testCase.description}
              onChange={(e) =>
                onUpdate({ ...testCase, description: e.target.value })
              }
              rows={2}
              className="w-full resize-y rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-500 focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            />
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

  // Görüntüleme modu (varsayılan)
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
