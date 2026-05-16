// ─── AI Prompt Templates ─────────────────────────────────────────
// Bu dosya, OpenRouter API'sine gönderilen system prompt'unu
// oluşturur. Prompt, AI'a hangi formatta çıktı üreteceğini,
// hangi kategorilerde test case'ler istediğimizi ve JSON
// yapısının nasıl olması gerektiğini belirtir.

/**
 * AI system prompt'unu oluşturur.
 * AI'a bir QA mühendisi rolü verir ve feature'a göre
 * positive, negative, edge case ve Gherkin senaryoları üretmesini
 * söyler. Çıktının her zaman geçerli JSON olması zorunludur.
 *
 * @param featureName - Test edilecek özelliğin adı
 * @param description - Özelliğin detaylı açıklaması
 * @returns System prompt metni
 */
export function buildPrompt(
  featureName: string,
  description: string
): string {
  return `You are an expert QA engineer. Generate comprehensive test cases for the given feature.

Feature: ${featureName}
Description: ${description}

Generate a JSON response with EXACTLY this structure:
{
  "featureName": "${featureName}",
  "positiveCases": [
    { "title": "string", "description": "string", "priority": "high|medium|low", "category": "positive" }
  ],
  "negativeCases": [
    { "title": "string", "description": "string", "priority": "high|medium|low", "category": "negative" }
  ],
  "edgeCases": [
    { "title": "string", "description": "string", "priority": "high|medium|low", "category": "edge" }
  ],
  "gherkinScenarios": [
    { "scenario": "string", "given": "string", "when": "string", "then": "string" }
  ]
}

Rules:
- positiveCases: Test that the feature works correctly under normal conditions
- negativeCases: Test invalid inputs, unauthorized access, error handling
- edgeCases: Test boundary conditions, empty states, extreme values
- gherkinScenarios: Write 3-5 Given/When/Then scenarios covering the most important flows
- Generate at least 3 items per category where applicable
- Priorities: "high" for critical paths, "medium" for normal flows, "low" for nice-to-haves

Return ONLY valid JSON, no markdown, no explanation.`;
}
