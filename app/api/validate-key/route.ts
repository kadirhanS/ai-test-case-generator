// ─── API Route: /api/validate-key ─────────────────────────────────
// Kullanıcının OpenRouter API key'inin geçerli olup olmadığını
// test eder. Minimal bir chat completion isteği gönderir (1 token).
// Maliyeti ~$0'dır (free model + tek token).
// 200 → key geçerli
// 401/403 → key geçersiz
// 402 → bakiye yetersiz (key geçerli ama)
// Diğer → key muhtemelen geçerli ama başka bir sorun var

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey || typeof apiKey !== "string") {
      return Response.json(
        { valid: false, message: "API Key is required" },
        { status: 400 }
      );
    }

    // OpenRouter'a minimal bir istek gönder
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [{ role: "user", content: "hi" }],
          max_tokens: 1,
        }),
      }
    );

    if (response.ok) {
      return Response.json({ valid: true });
    }

    if (response.status === 401 || response.status === 403) {
      return Response.json({
        valid: false,
        message: "Invalid or revoked API Key.",
      });
    }

    if (response.status === 402) {
      return Response.json({
        valid: true,
        warning:
          "Key is valid but has insufficient balance. Free models should still work.",
      });
    }

    // 429, 500 vb. — key büyük ihtimalle geçerli
    return Response.json({
      valid: true,
      warning: "Key accepted but provider is temporarily unavailable.",
    });
  } catch {
    return Response.json({
      valid: false,
      message: "Connection error. Check your network.",
    });
  }
}
