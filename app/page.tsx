// ─── Main Page: AI Test Case Generator ───────────────────────────
// Projenin ana sayfası. Kullanıcıdan feature name ve description
// alır, /api/generate endpoint'ine gönderir, gelen yanıtı
// sessionStorage'a kaydeder ve /results sayfasına yönlendirir.
// Hata yönetimi için yapılandırılmış API hatalarını işler ve
// kullanıcı dostu mesajlar gösterir.
// Alt kısımda localStorage'daki son 10 test sonucu listelenir.

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TestCaseForm from "@/components/TestCaseForm";
import type { HistoryItem } from "@/lib/types";

// Backend'den dönen yapılandırılmış hata yanıtı tipi
interface ApiError {
  message?: string;
  statusCode?: number;
  isRateLimit?: boolean;
  retryAfterSeconds?: number;
  provider_name?: string;
}

const HISTORY_KEY = "testHistory";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Sayfa yüklendiğinde localStorage'dan geçmişi oku
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch {
      // Geçersiz veri varsa sessizce geç
    }
  }, []);

  /**
   * Form gönderimi — TestCaseForm'dan gelen verilerle API'yi çağırır.
   * Başarılı: sonuçları sessionStorage'a kaydeder, /results'a yönlendirir
   * Başarısız: hata tipine göre kullanıcı dostu mesaj gösterir
   */
  const handleGenerate = async (
    featureName: string,
    description: string,
    apiKey: string,
    model: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureName, description, apiKey, model }),
      });

      const data = await response.json();

      // ── Hata durumları ──────────────────────────────────────
      if (!response.ok) {
        const apiErr = data as ApiError;

        // 429: Rate limit — model çok yoğun
        if (apiErr.isRateLimit) {
          const retryMsg = apiErr.retryAfterSeconds
            ? ` ${apiErr.retryAfterSeconds} seconds.`
            : "";
          setError(
            `⚠️ This model is temporarily rate-limited on "${apiErr.provider_name ?? "unknown provider"}".${retryMsg} Please switch to a more stable model (e.g. Gemini 2.0 Flash).`
          );
        }
        // 401/403: Yetkisiz API key
        else if (apiErr.statusCode === 401 || apiErr.statusCode === 403) {
          setError("🔑 Invalid API Key. Please check your key.");
        }
        // 402: Bakiye yetersiz
        else if (apiErr.statusCode === 402) {
          setError(
            "💳 Insufficient balance. Choose a free model or add credits to your OpenRouter account."
          );
        }
        // Diğer hatalar
        else {
          setError(apiErr.message ?? "An unknown error occurred.");
        }
        return;
      }

      // ── Başarılı — sonuçları kaydet ve results sayfasına git ─
      sessionStorage.setItem("testResults", JSON.stringify(data));
      router.push("/results");
    } catch (err) {
      // Network hatası / JSON parse hatası
      setError(
        err instanceof Error
          ? err.message
          : "Connection error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Geçmişteki bir öğeye tıklayınca results'a git
  const openHistoryItem = (item: HistoryItem) => {
    sessionStorage.setItem("testResults", JSON.stringify(item.result));
    router.push("/results");
  };

  // Geçmişi temizle
  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  // Geçmiş öğesini sil
  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8">
      {/* ── Hero Section ───────────────────────────────────────── */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          AI Test Case Generator
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Describe a feature and get comprehensive test cases with Gherkin
          scenarios — powered by AI
        </p>
      </div>

      {/* ── Form ──────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <TestCaseForm onGenerate={handleGenerate} isLoading={isLoading} />
      </div>

      {/* ── Error Banner ──────────────────────────────────────── */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-sm">❌</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {error}
              </p>
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                Try switching to a different model or try again later.
              </p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── Info Cards ────────────────────────────────────────── */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            🔍 Positive Cases
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Happy path scenarios that verify features work correctly under
            normal conditions
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            🛡️ Negative Cases
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Invalid inputs, error states, unauthorized access, and failure modes
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            ⚡ Edge Cases
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Boundary values, empty states, concurrency issues, and extreme
            inputs
          </p>
        </div>
      </div>

      {/* ── History Section ───────────────────────────────────── */}
      {history.length > 0 && (
        <div className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              📁 Recent Analyses ({history.length})
            </h2>
            <button
              onClick={clearHistory}
              className="text-xs text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => openHistoryItem(item)}
                className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 text-left transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {item.featureName}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={(e) => deleteHistoryItem(item.id, e)}
                  className="ml-2 rounded p-1 text-xs text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  title="Delete"
                >
                  ✕
                </button>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
