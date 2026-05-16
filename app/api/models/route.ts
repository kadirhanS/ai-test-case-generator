import type { ModelInfo } from "@/lib/types";

const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";

// Most stable free models — shown first in the dropdown
const PRIORITY_FREE_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "google/gemini-2.5-flash-preview-04-17:free",
  "mistralai/mistral-7b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const plan = searchParams.get("plan") ?? "free";

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

    const models: ModelInfo[] = data.data
      .filter((m: any) => {
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
        // Priority stable models first
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
