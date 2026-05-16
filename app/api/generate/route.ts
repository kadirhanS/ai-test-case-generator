// ─── API Route: /api/generate ────────────────────────────────────
// Frontend'den gelen featureName, description, apiKey ve model
// bilgilerini alır, OpenRouter servisine iletir ve AI yanıtını
// JSON olarak döndürür. Tüm validasyonlar burada yapılır.

import { generateTestCases } from "@/lib/openrouter";
import type { GenerateRequest } from "@/lib/types";

// Serverless function timeout — 30 saniye (OpenRouter bazen yavaş)
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<GenerateRequest>;

    // ── Validasyonlar ──────────────────────────────────────────
    // Her alan zorunlu. Kullanıcı boş gönderim yaparsa 400 döner.

    if (
      !body.featureName ||
      typeof body.featureName !== "string" ||
      body.featureName.trim().length === 0
    ) {
      return Response.json(
        { error: "featureName is required" },
        { status: 400 }
      );
    }

    if (
      !body.description ||
      typeof body.description !== "string" ||
      body.description.trim().length === 0
    ) {
      return Response.json(
        { error: "description is required" },
        { status: 400 }
      );
    }

    if (
      !body.apiKey ||
      typeof body.apiKey !== "string" ||
      body.apiKey.trim().length === 0
    ) {
      return Response.json({ error: "apiKey is required" }, { status: 400 });
    }

    if (
      !body.model ||
      typeof body.model !== "string" ||
      body.model.trim().length === 0
    ) {
      return Response.json({ error: "model is required" }, { status: 400 });
    }

    // ── AI İsteği ──────────────────────────────────────────────
    const result = await generateTestCases({
      featureName: body.featureName.trim(),
      description: body.description.trim(),
      apiKey: body.apiKey.trim(),
      model: body.model.trim(),
    });

    return Response.json(result);
  } catch (error) {
    console.error("Generation error:", error);

    // openrouter.ts'den yapılandırılmış hata geldiyse onu kullan
    const raw = error instanceof Error ? error.message : "";

    let structured: Record<string, unknown>;
    try {
      structured = JSON.parse(raw);
    } catch {
      structured = { message: raw, statusCode: 500 };
    }

    return Response.json(structured, { status: (structured.statusCode as number) ?? 500 });
  }
}
