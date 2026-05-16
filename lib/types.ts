// ─── AI Response Types ───────────────────────────────────────────

export interface TestCase {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "positive" | "negative" | "edge";
}

export interface GherkinScenario {
  scenario: string;
  given: string;
  when: string;
  then: string;
}

export interface GenerateResponse {
  featureName: string;
  positiveCases: TestCase[];
  negativeCases: TestCase[];
  edgeCases: TestCase[];
  gherkinScenarios: GherkinScenario[];
}

// ─── Request Types ───────────────────────────────────────────────

export interface GenerateRequest {
  featureName: string;
  description: string;
  apiKey: string;
  model: string;
}

// ─── Model Types ─────────────────────────────────────────────────

export interface ModelInfo {
  id: string;
  name: string;
}

// ─── OpenRouter Types ────────────────────────────────────────────

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  response_format: { type: "json_object" };
}

export interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}
