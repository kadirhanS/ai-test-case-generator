import { streamText } from "ai";
import { model, SYSTEM_PROMPT } from "@/lib/ai";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { code, framework = "jest" } = await request.json();

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return Response.json(
        { error: "Code snippet is required" },
        { status: 400 }
      );
    }

    const userPrompt = `Generate test cases for the following code using ${framework}:

\`\`\`
${code}
\`\`\`

Return a JSON array of test case objects.`;

    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Generation error:", error);
    return Response.json(
      { error: "Failed to generate test cases" },
      { status: 500 }
    );
  }
}
