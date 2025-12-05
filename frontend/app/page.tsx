'use client';

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col items-center gap-10 rounded-2xl bg-white p-10 shadow-lg dark:bg-zinc-900">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Choisis ton destin 🎮
        </h1>

        <p className="text-center text-zinc-600 dark:text-zinc-400">
          Tu peux lancer la simulation de l&apos;école ou bien aller voir la page LOL.
        </p>

        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <Link
            href="/game"
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-blue-500 px-5 text-blue-600 transition-colors hover:bg-blue-500 hover:text-white dark:text-blue-300 md:w-1/2"
          >
            Aller au Game
          </Link>

          <Link
            href="/lol"
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-purple-500 px-5 text-purple-600 transition-colors hover:bg-purple-500 hover:text-white dark:text-purple-300 md:w-1/2"
          >
            LOL page
          </Link>
        </div>
      </main>
    </div>
  );
}
