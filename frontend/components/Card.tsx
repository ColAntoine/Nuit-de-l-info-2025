"use client";

type CardProps = {
  title: string;
  items?: string[];
  onItemClick?: (index: number) => void;
};

export default function Card({ title, items = [], onItemClick }: CardProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-zinc-200 px-4 py-2 dark:bg-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
      </div>

      {/* Contenu */}
      <div className="px-4 py-3">
        {items.length > 0 ? (
          <ul className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
            {items.map((item, i) => (
              <li
                key={i}
                onClick={onItemClick ? () => onItemClick(i) : undefined}
                className={
                  "flex gap-2 px-1 py-0.5 rounded-md" +
                  (onItemClick
                    ? " cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    : "")
                }
              >
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
