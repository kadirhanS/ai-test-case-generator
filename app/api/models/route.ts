// ─── API Route: /api/models ──────────────────────────────────────
// OpenRouter'ın model listesini çeker ve frontend'in ihtiyacına
// göre filtreler (free veya paid). Stabil modeller (örn. Gemini)
// dropdown'da üst sıralarda gösterilir, böylece kullanıcı ilk
// bakışta en güvenilir modeli seçebilir.

import type { ModelInfo } from "@/lib/types";

const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";

// Stabil free modeller — dropdown'da en üstte görünürler
// Rate limit yeme olasılığı düşük, herkese açık modeller
const PRIORITY_FREE_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "google/gemini-2.5-flash-preview-04-17:free",
  "mistralai/mistral-7b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
];

export async function GET(request: Request) {
  try {
    // URL'den ?plan=free veya ?plan=paid parametresini al
    const { searchParams } = new URL(request.url);
    const plan = searchParams.get("plan") ?? "free";

    // OpenRouter'dan tüm modelleri çek
    const response = await fetch(OPENROUTER_MODELS_URL);

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch models from OpenRouter" },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (!data?.data || !Array.isArray(data.data)) {
      return Response.json({ models: [] });
    }

    // Modelleri filtrele, sırala ve frontend'e gönder
    const models: ModelInfo[] = data.data
      .filter((m: any) => {
        // Free model: prompt ve completion ücreti 0 olanlar
        // Paid model: en az birinin ücreti 0'dan büyük
        const pricing = m.pricing ?? {};
        const promptPrice = parseFloat(pricing.prompt ?? "0");
        const completionPrice = parseFloat(pricing.completion ?? "0");

        if (plan === "free") {
          return promptPrice === 0 && completionPrice === 0;
        }
        return promptPrice > 0 || completionPrice > 0;
      })
      .map((m: any) => ({
        id: m.id,
        name: m.name ?? m.id,
      }))
      .sort((a: ModelInfo, b: ModelInfo) => {
        // Stabil modeller önce, sonra alfabetik sıra
        const aPriority =
          plan === "free" ? PRIORITY_FREE_MODELS.indexOf(a.id) : -1;
        const bPriority =
          plan === "free" ? PRIORITY_FREE_MODELS.indexOf(b.id) : -1;

        if (aPriority !== -1 && bPriority !== -1) {
          return aPriority - bPriority;
        }
        if (aPriority !== -1) return -1;
        if (bPriority !== -1) return 1;

        return a.name.localeCompare(b.name);
      });

    return Response.json({ models, plan });
  } catch (error) {
    console.error("Models fetch error:", error);
    return Response.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}
