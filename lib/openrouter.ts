import type {
  OpenRouterRequest,
  OpenRouterResponse,
  GenerateRequest,
  GenerateResponse,
} from "./types";
import { buildPrompt } from "./prompt-templates";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function generateTestCases(
  request: GenerateRequest
): Promise<GenerateResponse> {
  const { apiKey, model, featureName, description } = request;

  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error("API Key is required");
  }

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

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://github.com/kadirhan/ai-test-case-generator",
      "X-Title": "AI Test Case Generator",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();

    // Try to parse OpenRouter error for structured info
    let parsedError: Record<string, unknown> = {};
    try {
      parsedError = JSON.parse(errorText);
    } catch {
      // not JSON, use raw text
    }

    const openRouterErr =
      (parsedError?.error as Record<string, unknown>) ?? {};

    const retryAfter =
      (openRouterErr?.metadata as Record<string, unknown>)
        ?.retry_after_seconds ?? null;

    // Throw structured error with retry info
    const enhanced: Record<string, unknown> = {
      statusCode: response.status,
      message:
        (openRouterErr?.message as string) ?? errorText,
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

  const data: OpenRouterResponse = await response.json();

  if (data.error) {
    throw new Error(`OpenRouter API error: ${data.error.message}`);
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No content in OpenRouter response");
  }

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
