// ─── Results Page ────────────────────────────────────────────────
// AI'dan gelen test case'lerini kategorilere ayrılmış şekilde
// görüntüler. Positive, Negative ve Edge case'ler ayrı bölümlerde
// sunulur. Gherkin senaryoları ayrı bir blokta Given/When/Then
// formatında gösterilir. Export butonları ile kopyalama ve
// dosya indirme imkanı sağlar.
// "Edit" modu ile tüm çıktılar düzenlenebilir.
// Sayfadan çıkarken sonuçlar localStorage'a otomatik kaydedilir.

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TestCaseCard from "@/components/TestCaseCard";
import GherkinBlock from "@/components/GherkinBlock";
import ExportButtons from "@/components/ExportButtons";
import type {
  GenerateResponse,
  TestCase,
  GherkinScenario,
  HistoryItem,
} from "@/lib/types";

const HISTORY_KEY = "testHistory";
const MAX_HISTORY = 10;

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<GenerateResponse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Sayfa yüklendiğinde sessionStorage'dan test sonuçlarını al
  useEffect(() => {
    const stored = sessionStorage.getItem("testResults");
    if (stored) {
      try {
        const parsed: GenerateResponse = JSON.parse(stored);
        setData(parsed);
      } catch {
        router.push("/");
        return;
      }
    } else {
      router.push("/");
      return;
    }
    setLoaded(true);
  }, [router]);

  // Sonuçları localStorage'a kaydet (geçmiş)
  const saveToHistory = useCallback((result: GenerateResponse) => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const history: HistoryItem[] = raw ? JSON.parse(raw) : [];

      // Aynı feature'dan varsa güncelle, yoksa başa ekle
      const existingIdx = history.findIndex(
        (h) => h.featureName === result.featureName
      );
      const newItem: HistoryItem = {
        id: Date.now().toString(36),
        featureName: result.featureName,
        timestamp: Date.now(),
        result,
      };

      if (existingIdx !== -1) {
        history[existingIdx] = newItem;
      } else {
        history.unshift(newItem);
      }

      // Maksimum kayıt sayısını aşma
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
    } catch {
      // localStorage dolu olabilir, sessizce geç
    }
  }, []);

  // loaded olduğunda history'e kaydet
  useEffect(() => {
    if (loaded && data) {
      saveToHistory(data);
    }
  }, [loaded, data, saveToHistory]);

  // TestCase güncelleme
  const updateTestCase = useCallback(
    (
      category: "positiveCases" | "negativeCases" | "edgeCases",
      index: number,
      updated: TestCase
    ) => {
      if (!data) return;
      const newData = { ...data };
      newData[category] = [...newData[category]];
      newData[category][index] = updated;
      setData(newData);
      // sessionStorage'ı da güncelle (export doğru veriyi kullansın)
      sessionStorage.setItem("testResults", JSON.stringify(newData));
    },
    [data]
  );

  // Gherkin senaryo güncelleme
  const updateGherkin = useCallback(
    (index: number, updated: GherkinScenario) => {
      if (!data) return;
      const newData = { ...data };
      newData.gherkinScenarios = [...newData.gherkinScenarios];
      newData.gherkinScenarios[index] = updated;
      setData(newData);
      sessionStorage.setItem("testResults", JSON.stringify(newData));
    },
    [data]
  );

  if (!loaded || !data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  const allCases = [
    ...data.positiveCases,
    ...data.negativeCases,
    ...data.edgeCases,
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8">
      {/* ── Header: feature adı, istatistik, aksiyon butonları ── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {data.featureName}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {allCases.length} test case{allCases.length !== 1 ? "s" : ""}{" "}
            generated · {data.gherkinScenarios.length} Gherkin scenario
            {data.gherkinScenarios.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              isEditing
                ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            {isEditing ? "✓ Done Editing" : "✏️ Edit"}
          </button>
          <ExportButtons data={data} />
          <Link
            href="/"
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            New Analysis
          </Link>
        </div>
      </div>

      {/* ── Edit modu uyarısı ─────────────────────────────────── */}
      {isEditing && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            ✏️ Edit mode is on. Click on any text to modify it. Changes are
            saved automatically. Click "Done Editing" when finished.
          </p>
        </div>
      )}

      {/* ── Positive Cases (green theme) ─────────────────────── */}
      {data.positiveCases.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            ✅ Positive Cases ({data.positiveCases.length})
          </h2>
          <div className="space-y-2">
            {data.positiveCases.map((tc, i) => (
              <TestCaseCard
                key={`pos-${i}`}
                testCase={tc}
                isEditing={isEditing}
                onUpdate={(updated) => updateTestCase("positiveCases", i, updated)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Negative Cases (red theme) ───────────────────────── */}
      {data.negativeCases.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
            ❌ Negative Cases ({data.negativeCases.length})
          </h2>
          <div className="space-y-2">
            {data.negativeCases.map((tc, i) => (
              <TestCaseCard
                key={`neg-${i}`}
                testCase={tc}
                isEditing={isEditing}
                onUpdate={(updated) => updateTestCase("negativeCases", i, updated)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Edge Cases (amber theme) ─────────────────────────── */}
      {data.edgeCases.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            ⚠️ Edge Cases ({data.edgeCases.length})
          </h2>
          <div className="space-y-2">
            {data.edgeCases.map((tc, i) => (
              <TestCaseCard
                key={`edge-${i}`}
                testCase={tc}
                isEditing={isEditing}
                onUpdate={(updated) => updateTestCase("edgeCases", i, updated)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Gherkin Scenarios ────────────────────────────────── */}
      {data.gherkinScenarios.length > 0 && (
        <section className="mb-8">
          <GherkinBlock
            scenarios={data.gherkinScenarios}
            isEditing={isEditing}
            onUpdate={updateGherkin}
          />
        </section>
      )}
    </div>
  );
}
