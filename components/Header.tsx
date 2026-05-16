"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          TestCase AI
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            New Analysis
          </Link>
        </nav>
      </div>
    </header>
  );
}
