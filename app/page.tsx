"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CodeInput from "@/components/CodeInput";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (code: string, framework: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, framework }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Failed to generate test cases");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream available");

      const chunks: string[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value, { stream: true });
        chunks.push(text);
      }

      const fullResponse = chunks.join("");
      // Extract JSON from the streamed response (handles text/event-stream format)
      const jsonMatch = fullResponse.match(/\[[\s\S]*\]/);
      let testCases;

      if (jsonMatch) {
        testCases = JSON.parse(jsonMatch[0]);
      } else {
        // Try direct parse
        testCases = JSON.parse(fullResponse);
      }

      // Store in sessionStorage and navigate
      sessionStorage.setItem("testCases", JSON.stringify(testCases));
      sessionStorage.setItem("sourceCode", code);
      router.push("/results");
    } catch (err) {
      console.error("Generation failed:", err);
      alert(
        err instanceof Error ? err.message : "Failed to generate test cases"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          AI Test Case Generator
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Paste your source code and get comprehensive AI-generated test cases
          in seconds.
        </p>
      </div>

      <div className="flex-1">
        <CodeInput onGenerate={handleGenerate} isLoading={isLoading} />
      </div>

      <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          How it works
        </h2>
        <ol className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
          <li className="flex items-start gap-2">
            <span className="font-mono text-xs text-zinc-400">1.</span>
            Paste your JavaScript/TypeScript code
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-xs text-zinc-400">2.</span>
            Select your testing framework
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-xs text-zinc-400">3.</span>
            Click &quot;Generate Tests&quot; and get AI-powered test cases
          </li>
        </ol>
      </div>
    </div>
  );
}
