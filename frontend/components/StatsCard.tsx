"use client";

type StatsCardProps = {
  title: string;
  euros: number;
  students: number;
  teachers: number;
  studentSatisfaction: number; 
};

export default function StatsCard({
  title,
  euros,
  students,
  teachers,
  studentSatisfaction,
}: StatsCardProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      {/* HEADER */}
      <div className="bg-zinc-200 px-4 py-2 dark:bg-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
      </div>

      {/* CONTENT */}
      <div className="px-4 py-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
        <div className="flex justify-between">
          <span>Argents</span>
          <span className="font-semibold">
            {euros.toLocaleString("fr-FR")} €
          </span>
        </div>

        <div className="flex justify-between">
          <span>Élèves</span>
          <span className="font-semibold">{students.toLocaleString("fr-FR")}</span>
        </div>

        <div className="flex justify-between">
          <span>Profs</span>
          <span className="font-semibold">{teachers.toLocaleString("fr-FR")}</span>
        </div>

        <div className="flex justify-between">
          <span>Satisfaction étudiante</span>
          <span className="font-semibold">{studentSatisfaction}%</span>
        </div>

      </div>
    </div>
  );
}
