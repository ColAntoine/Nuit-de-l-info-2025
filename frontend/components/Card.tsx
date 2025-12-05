"use client";

type CardProps = {
  title: string;
  items?: string[];
};

export default function Card({ title, items = [] }: CardProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      
      <div className="bg-zinc-200 px-4 py-2 dark:bg-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
      </div>

      <div className="px-4 py-3">
        {items.length > 0 ? (
          <ul className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
            {items.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-zinc-400 dark:text-zinc-600">
            Aucun élément
          </p>
        )}
      </div>

    </div>
  );
}
