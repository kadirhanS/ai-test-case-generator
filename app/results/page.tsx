// ─── Results Page ────────────────────────────────────────────────
// AI'dan gelen test case'lerini kategorilere ayrılmış şekilde
// görüntüler. Positive, Negative ve Edge case'ler ayrı bölümlerde
// sunulur. Gherkin senaryoları ayrı bir blokta Given/When/Then
// formatında gösterilir. Export butonları ile kopyalama ve
// dosya indirme imkanı sağlar.

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TestCaseCard from "@/components/TestCaseCard";
import GherkinBlock from "@/components/GherkinBlock";
import ExportButtons from "@/components/ExportButtons";
import type { GenerateResponse } from "@/lib/types";

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<GenerateResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Sayfa yüklendiğinde sessionStorage'dan test sonuçlarını al
  useEffect(() => {
    const stored = sessionStorage.getItem("testResults");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        router.push("/"); // Geçersiz veri → ana sayfaya yönlendir
        return;
      }
    } else {
      router.push("/"); // Veri yok → ana sayfaya yönlendir
      return;
    }
    setLoaded(true);
  }, [router]);

  // Yükleme ekranı
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
          <ExportButtons data={data} />
          <Link
            href="/"
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            New Analysis
          </Link>
        </div>
      </div>

      {/* ── Positive Cases (green theme) ─────────────────────── */}
      {data.positiveCases.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            ✅ Positive Cases ({data.positiveCases.length})
          </h2>
          <div className="space-y-2">
            {data.positiveCases.map((tc, i) => (
              <TestCaseCard key={`pos-${i}`} testCase={tc} />
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
              <TestCaseCard key={`neg-${i}`} testCase={tc} />
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
              <TestCaseCard key={`edge-${i}`} testCase={tc} />
            ))}
          </div>
        </section>
      )}

      {/* ── Gherkin Scenarios ────────────────────────────────── */}
      {data.gherkinScenarios.length > 0 && (
        <section className="mb-8">
          <GherkinBlock scenarios={data.gherkinScenarios} />
        </section>
      )}
    </div>
  );
}
