"use client";

import { useEffect, useRef, useState } from "react";
import Card from "../../components/Card";
import StatsCard from "../../components/StatsCard";
import SpriteCharacter from "../../components/SpriteCharacter";
import SpriteStudent from "../../components/SpriteStudent";
import SpriteStudentFront from "../../components/SpriteStudentFront";
import { GameInstance } from "@/game/main";

export default function GamePage() {
  GameInstance.setup();

  const updates = ["Windows 10", "Ubuntu"];
  const events = ["404 con found", "Apéromix"];
  const euros = GameInstance.getMoney();
  const students = GameInstance.getStudents();
  const teachers = GameInstance.getTeachers();
  const studentSatisfaction = GameInstance.getStudentSatisfaction() * 100;
  const teacherSatisfaction = GameInstance.getTeacherSatisfaction() * 100;

  // position Y du perso
  const [y, setY] = useState(200);
  const [direction, setDirection] = useState<"front" | "back">("front");

  // borne A (haut) et B (bas)
  const minY = 550;
  const maxY = 680;

  // ref pour savoir si on va vers le bas (1) ou vers le haut (-1)
  const dirRef = useRef<1 | -1>(1);

  useEffect(() => {
    const speed = 80;    // ms entre updates
    const step = 2;      // pixels par update

    const id = setInterval(() => {
      setY((prevY) => {
        let nextY = prevY + step * dirRef.current;

        // si on dépasse le bas → on remonte
        if (nextY >= maxY) {
          nextY = maxY;
          dirRef.current = -1;         // on remonte
          setDirection("back");        // dos (B -> A)
        }

        // si on dépasse le haut → on redescend
        if (nextY <= minY) {
          nextY = minY;
          dirRef.current = 1;          // on redescend
          setDirection("front");       // face (A -> B)
        }

        return nextY;
      });
    }, speed);

    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6 text-black dark:text-white relative"
      style={{ backgroundImage: "url('/school2.webp')" }}
    >
      {/* Sprite qui se balade toute seule */}
      <SpriteCharacter direction={direction} scale={1} x={985} y={y} />
      <SpriteStudent direction="back" scale={1} x={300} y={650} />
      <SpriteStudentFront direction="back" scale={1} x={1600} y={600} />
      {/* ta grille UI */}
      <div className="grid h-full grid-cols-3 gap-6">
        <div className="flex items-start justify-start">
          <div className="w-[300px]">
            <StatsCard
              title="Statistiques :"
              euros={euros}
              students={students}
              teachers={teachers}
              studentSatisfaction={studentSatisfaction}
              teacherSatisfaction={teacherSatisfaction}
            />
          </div>
        </div>

        <div className="flex items-center justify-center" />

        <div className="flex flex-col items-end justify-start gap-6">
          <div className="w-[600px]">
            <Card title="Updates :" items={updates} />
          </div>
          <div className="w-[600px]">
            <Card title="Events :" items={events} />
          </div>
        </div>
      </div>
    </div>
  );
}
