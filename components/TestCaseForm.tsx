// ─── TestCaseForm Component ──────────────────────────────────────
// Ana form bileşeni. Kullanıcıdan API key, plan seçimi (free/paid),
// model, feature name ve description alır. API key'i sessionStorage'da
// saklayarak sayfa yenilemelerinde korur, sekme kapanınca silinir.
// Model listesini seçilen plan'a göre /api/models'den çeker.
// API key doğrulama butonu ile kullanıcı key'in geçerliliğini
// generate'a basmadan test edebilir.

"use client";

import { useState, useEffect, useCallback } from "react";
import type { ModelInfo } from "@/lib/types";

interface TestCaseFormProps {
  /** Ana sayfadaki generate fonksiyonu — tüm form verilerini yukarı taşır */
  onGenerate: (
    featureName: string,
    description: string,
    apiKey: string,
    model: string
  ) => void;
  isLoading: boolean;
}

// sessionStorage key — API key bu anahtarla saklanır
const SESSION_KEY = "tcApiKey";

export default function TestCaseForm({
  onGenerate,
  isLoading,
}: TestCaseFormProps) {
  const [featureName, setFeatureName] = useState("");
  const [description, setDescription] = useState("");

  // ── API Key State ─────────────────────────────────────────────
  const [apiKey, setApiKey] = useState("");
  const [keySaved, setKeySaved] = useState(false);
  const [keyStatus, setKeyStatus] = useState<
    null | "loading" | "valid" | "invalid"
  >(null);
  const [keyMessage, setKeyMessage] = useState("");

  // ── Plan & Model State ────────────────────────────────────────
  const [plan, setPlan] = useState<"free" | "paid">("free");
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [modelsLoading, setModelsLoading] = useState(false);

  // Sayfa yüklendiğinde sessionStorage'dan API key'i geri yükle
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setApiKey(saved);
      setKeySaved(true);
    }
  }, []);

  // Plan değişince /api/models'den yeni model listesini çek
  const fetchModels = useCallback(async (planType: "free" | "paid") => {
    setModelsLoading(true);
    try {
      const res = await fetch(`/api/models?plan=${planType}`);
      const data = await res.json();
      if (data.models && Array.isArray(data.models)) {
        setModels(data.models);
        // İlk modeli otomatik seç (stabil modeller önde)
        if (data.models.length > 0) {
          setSelectedModel(data.models[0].id);
        }
      }
    } catch {
      // Hata sessizce yutulur — model listesi boş kalır
    } finally {
      setModelsLoading(false);
    }
  }, []);

  // İlk yükleme ve plan değişikliğinde model listesini tazele
  useEffect(() => {
    fetchModels(plan);
  }, [plan, fetchModels]);

  // API Key değişikliği → sessionStorage'a kaydet
  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setKeyStatus(null); // key değişince doğrulama sıfırlansın
    setKeyMessage("");
    if (value.trim()) {
      sessionStorage.setItem(SESSION_KEY, value.trim());
      setKeySaved(true);
    } else {
      sessionStorage.removeItem(SESSION_KEY);
      setKeySaved(false);
    }
  };

  // ── API Key Doğrulama ─────────────────────────────────────────
  // "Validate" butonuna basınca /api/validate-key'e istek atar.
  // Geçerliyse yeşil tik, geçersizse kırmızı uyarı gösterir.
  const validateKey = async () => {
    if (!apiKey.trim()) return;
    setKeyStatus("loading");
    setKeyMessage("");
    try {
      const res = await fetch("/api/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        setKeyStatus("valid");
        setKeyMessage(data.warning ?? "Key is valid ✓");
      } else {
        setKeyStatus("invalid");
        setKeyMessage(data.message ?? "Invalid API Key");
      }
    } catch {
      setKeyStatus("invalid");
      setKeyMessage("Connection error. Check your network.");
    }
  };

  // Form submit → tüm veriyi parent'a ilet
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      featureName.trim() &&
      description.trim() &&
      apiKey.trim() &&
      selectedModel
    ) {
      onGenerate(
        featureName.trim(),
        description.trim(),
        apiKey.trim(),
        selectedModel
      );
    }
  };

  const isFormValid =
    featureName.trim() &&
    description.trim() &&
    apiKey.trim() &&
    selectedModel;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* ── API Key ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="api-key"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          🔑 OpenRouter API Key
        </label>
        <div className="flex gap-2">
          <input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            placeholder="sk-or-..."
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 font-mono text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:ring-zinc-800"
          />
          <button
            type="button"
            onClick={validateKey}
            disabled={!apiKey.trim() || keyStatus === "loading"}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {keyStatus === "loading" ? (
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Validating...
              </span>
            ) : (
              "Validate"
            )}
          </button>
        </div>
        {keyStatus === "valid" && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            ✓ {keyMessage}
          </p>
        )}
        {keyStatus === "invalid" && (
          <p className="text-xs text-red-600 dark:text-red-400">
            ✗ {keyMessage}
          </p>
        )}
        {keySaved && keyStatus === null && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Key saved — click Validate to check it
          </p>
        )}
      </div>

      {/* ── Security Warning ──────────────────────────────────── */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
        <p className="text-xs text-amber-700 dark:text-amber-300">
          🔒 Your API key is session-only.{" "}
          <strong>It is automatically deleted when you close the tab/browser.</strong>{" "}
          Your key is never stored on the server — it is sent directly to OpenRouter.
        </p>
      </div>

      {/* ── Plan Selection ────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          💰 Plan
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setPlan("free")}
            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              plan === "free"
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            🆓 Free
          </button>
          <button
            type="button"
            onClick={() => setPlan("paid")}
            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              plan === "paid"
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            💎 Paid
          </button>
        </div>
      </div>

      {/* ── Model Select ──────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="model-select"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          🤖 Model
        </label>
        {modelsLoading ? (
          <div className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
            <svg
              className="h-4 w-4 animate-spin text-zinc-400"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Loading models...
            </span>
          </div>
        ) : (
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-zinc-800"
          >
            {models.length === 0 && (
              <option value="">No models available</option>
            )}
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ── Divider ───────────────────────────────────────────── */}
      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* ── Feature Name ───────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="feature-name"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          📝 Feature Name
        </label>
        <input
          id="feature-name"
          type="text"
          value={featureName}
          onChange={(e) => setFeatureName(e.target.value)}
          placeholder="e.g. Login Page, Shopping Cart, User Registration"
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:ring-zinc-800"
        />
      </div>

      {/* ── Description ────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          📄 Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the feature in detail. What does it do? What are the inputs and outputs? Who can access it?"
          rows={5}
          className="w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:ring-zinc-800"
        />
      </div>

      {/* ── Submit Button ──────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isLoading || !isFormValid}
        className="w-full rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generating...
          </span>
        ) : (
          "🚀 Generate Test Cases"
        )}
      </button>
    </form>
  );
}
