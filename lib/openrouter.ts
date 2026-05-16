// ─── OpenRouter API Client ────────────────────────────────────────
// Bu servis, OpenRouter'ın chat.completions API'sine istek gönderir.
// Kullanıcının kendi API key'ini kullanır (sunucuda saklanmaz).
// Hata durumlarında yapılandırılmış JSON döndürerek frontend'in
// kullanıcı dostu hata mesajları göstermesini sağlar.

import type {
  OpenRouterRequest,
  OpenRouterResponse,
  GenerateRequest,
  GenerateResponse,
} from "./types";
import { buildPrompt } from "./prompt-templates";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * OpenRouter API'sine istek gönderir ve yapılandırılmış test case'leri döndürür.
 * @param request - featureName, description, apiKey ve model bilgilerini içerir
 * @returns GenerateResponse - AI tarafından üretilen test senaryoları
 */
export async function generateTestCases(
  request: GenerateRequest
): Promise<GenerateResponse> {
  const { apiKey, model, featureName, description } = request;

  // API Key kontrolü — kullanıcı key girmemişse erken uyar
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error("API Key is required");
  }

  // OpenRouter istek gövdesini hazırla
  // response_format: json_object ile AI'dan her zaman JSON çıktı alırız
  const body: OpenRouterRequest = {
    model,
    messages: [
      {
        role: "system",
        content: buildPrompt(featureName, description),
      },
      {
        role: "user",
        content: `Feature: ${featureName}\nDescription: ${description}`,
      },
    ],
    response_format: { type: "json_object" },
  };

  // OpenRouter API'ye POST isteği
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`, // Kullanıcının kendi key'i
      "HTTP-Referer": "https://github.com/kadirhan/ai-test-case-generator",
      "X-Title": "AI Test Case Generator",
    },
    body: JSON.stringify(body),
  });

  // ── Hata Yönetimi ──────────────────────────────────────────────
  // OpenRouter 429 (rate limit), 401 (yetkisiz), 402 (bakiye) gibi
  // durumlarda yapılandırılmış hata mesajı döndürürüz.
  // Frontend bu yapıyı okuyarak kullanıcı dostu uyarılar gösterir.

  if (!response.ok) {
    const errorText = await response.text();

    let parsedError: Record<string, unknown> = {};
    try {
      parsedError = JSON.parse(errorText);
    } catch {
      // JSON değilse raw text kullanılır
    }

    const openRouterErr =
      (parsedError?.error as Record<string, unknown>) ?? {};

    const retryAfter =
      (openRouterErr?.metadata as Record<string, unknown>)
        ?.retry_after_seconds ?? null;

    const enhanced: Record<string, unknown> = {
      statusCode: response.status,
      message: (openRouterErr?.message as string) ?? errorText,
      provider_name:
        (openRouterErr?.metadata as Record<string, unknown>)
          ?.provider_name ?? "unknown",
      isRateLimit: response.status === 429,
    };

    if (retryAfter) {
      enhanced.retryAfterSeconds = Math.ceil(retryAfter as number);
    }

    throw new Error(JSON.stringify(enhanced));
  }

  // ── Başarılı Yanıt ──────────────────────────────────────────────
  const data: OpenRouterResponse = await response.json();

  if (data.error) {
    throw new Error(`OpenRouter API error: ${data.error.message}`);
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No content in OpenRouter response");
  }

  // AI'dan gelen JSON metnini parse et
  // Bazen AI markdown code fence içinde dönebilir, onu temizleriz
  try {
    const clean = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(clean);

    return {
      featureName: parsed.featureName ?? featureName,
      positiveCases: parsed.positiveCases ?? [],
      negativeCases: parsed.negativeCases ?? [],
      edgeCases: parsed.edgeCases ?? [],
      gherkinScenarios: parsed.gherkinScenarios ?? [],
    };
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }
}
