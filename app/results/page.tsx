"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TestCaseCard, { type TestCase } from "@/components/TestCaseCard";

export default function ResultsPage() {
  const router = useRouter();
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [sourceCode, setSourceCode] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("testCases");
    const source = sessionStorage.getItem("sourceCode");

    if (stored) {
      try {
        setTestCases(JSON.parse(stored));
      } catch {
        router.push("/");
        return;
      }
    } else {
      router.push("/");
      return;
    }

    if (source) setSourceCode(source);
    setLoaded(true);
  }, [router]);

  if (!loaded) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Generated Test Cases
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {testCases.length} test case{testCases.length !== 1 ? "s" : ""}{" "}
            generated
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          New Analysis
        </Link>
      </div>

      {sourceCode && (
        <details className="mb-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900">
            View source code
          </summary>
          <pre className="overflow-x-auto border-t border-zinc-200 p-4 text-sm text-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
            <code>{sourceCode}</code>
          </pre>
        </details>
      )}

      <div className="flex flex-col gap-4">
        {testCases.map((tc, index) => (
          <TestCaseCard key={index} testCase={tc} />
        ))}
      </div>
    </div>
  );
}
