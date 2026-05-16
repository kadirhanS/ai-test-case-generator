// ─── AI Test Case Generator — TypeScript Type Definitions ────────
// Bu dosya, proje genelinde kullanılan tüm tip tanımlarını içerir.
// API'den dönen yanıtların, istek gövdelerinin ve OpenRouter
// mesaj yapısının TypeScript interface'lerini barındırır.

// ─── Test Case: AI tarafından üretilen her bir test senaryosu ───
export interface TestCase {
  title: string;       // Testin başlığı (örn. "Valid email and password")
  description: string; // Testin neyi doğruladığını açıklayan kısa metin
  priority: "high" | "medium" | "low"; // Öncelik seviyesi
  category: "positive" | "negative" | "edge"; // Test kategorisi
}

// ─── Gherkin Scenario: Given/When/Then formatında senaryo ───────
export interface GherkinScenario {
  scenario: string; // Senaryo adı
  given: string;    // Başlangıç durumu / ön koşul
  when: string;     // Gerçekleştirilen aksiyon
  then: string;     // Beklenen sonuç / doğrulama
}

// ─── GenerateResponse: AI'dan dönen ana yanıt yapısı ────────────
export interface GenerateResponse {
  featureName: string;           // Analiz edilen özellik adı
  positiveCases: TestCase[];     // Başarılı senaryolar (happy path)
  negativeCases: TestCase[];     // Başarısız/hatalı senaryolar
  edgeCases: TestCase[];         // Sınır durumları (boundary/edge)
  gherkinScenarios: GherkinScenario[]; // Given/When/Then senaryoları
}

// ─── GenerateRequest: Frontend'den backend'e gönderilen istek ───
export interface GenerateRequest {
  featureName: string;       // Özellik adı (örn. "Login Page")
  description: string;       // Özellik açıklaması
  apiKey: string;            // Kullanıcının OpenRouter API key'i
  model: string;             // Seçilen AI model ID'si
}

// ─── ModelInfo: Dropdown'da gösterilecek model bilgisi ──────────
export interface ModelInfo {
  id: string;   // Model ID (örn. "google/gemini-2.0-flash-exp:free")
  name: string; // Model adı (örn. "Google Gemini 2.0 Flash")
}

// ─── HistoryItem: localStorage'da saklanan geçmiş kaydı ─────────
export interface HistoryItem {
  id: string;
  featureName: string;
  timestamp: number;
  result: GenerateResponse;
}

// ─── OpenRouter API Request/Response Types ──────────────────────
// OpenRouter'ın chat.completions endpoint'ine gönderilen
// istek ve gelen yanıt için tip tanımları.

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  response_format: { type: "json_object" }; // JSON çıktı zorunlu
}

export interface OpenRouterResponse {
  choices: {
    message: {
      content: string; // AI'ın ürettiği JSON metni
    };
  }[];
  error?: {
    message: string;
  };
}
