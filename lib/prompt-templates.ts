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
