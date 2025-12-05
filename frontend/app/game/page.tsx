"use client";

import { useEffect, useRef, useState } from "react";
import Card from "../../components/Card";
import StatsCard from "../../components/StatsCard";
import SpriteCharacter from "../../components/SpriteCharacter";
import SpriteStudent from "../../components/SpriteStudent";
import SpriteStudentFront from "../../components/SpriteStudentFront";
import NewStudent from "../../components/NewStudent";
import LeaveStudent from "../../components/LeaveStudent";
import SnakeModal from "@/components/SnakeModal";
import { GameInstance } from "@/game/main";

// 🎮 Konami code
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function GamePage() {
  useEffect(() => {
    GameInstance.setup();
    GameInstance.begin();
  }, []);

  const [refresh, setRefresh] = useState(0);

  // 🔒 Snake modal (même système que sur Home)
  const [isSnakeModalOpen, setIsSnakeModalOpen] = useState(false);
  const konamiIndexRef = useRef(0);

  // Listener clavier pour le Konami code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const expected = KONAMI_CODE[konamiIndexRef.current];

      if (key === expected) {
        konamiIndexRef.current += 1;

        if (konamiIndexRef.current === KONAMI_CODE.length) {
          // Konami code complet → ouvrir Snake
          setIsSnakeModalOpen(true);
          konamiIndexRef.current = 0;
        }
      } else {
        // Si on tape ArrowUp alors que c'est cassé, on repart à 1, sinon reset complet
        konamiIndexRef.current = key === KONAMI_CODE[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Récupération des valeurs du jeu
  const euros = GameInstance.getMoney();
  const students = GameInstance.getStudents();
  const teachers = GameInstance.getTeachers();
  const studentSatisfaction = GameInstance.getStudentSatisfaction() * 100;
  const teacherSatisfaction = GameInstance.getTeacherSatisfaction() * 100;

  const updates = [""];
  const events = [""];

  const [y, setY] = useState(200);
  const [direction, setDirection] = useState<"front" | "back">("front");

  const minY = 550;
  const maxY = 680;

  const dirRef = useRef<1 | -1>(1);

  const [newStudents, setNewStudents] = useState<number[]>([]);
  const [leaveStudents, setLeaveStudents] = useState<number[]>([]);

  useEffect(() => {
    const speed = 80;
    const step = 2;

    const id = setInterval(() => {
      setY((prevY) => {
        let nextY = prevY + step * dirRef.current;

        if (nextY >= maxY) {
          nextY = maxY;
          dirRef.current = -1;
          setDirection("back");
        }

        if (nextY <= minY) {
          nextY = minY;
          dirRef.current = 1;
          setDirection("front");
        }

        return nextY;
      });
    }, speed);

    return () => clearInterval(id);
  }, []);

  const handleClickCharacter = () => {
    GameInstance.add_student();
    setNewStudents((prev) => [...prev, Date.now()]);
    setLeaveStudents((prev) => [...prev, Date.now()]);
    GameInstance.gain(1000);

    setRefresh((v) => v + 1);
  };

  const triggerLeaveStudent = () => {
    setLeaveStudents((prev) => [...prev, Date.now()]);
  };

  return (
    <>
      {/* 🐍 Même intégration que sur Home */}
      <SnakeModal
        isOpen={isSnakeModalOpen}
        onClose={() => setIsSnakeModalOpen(false)}
      />

      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat p-6 text-black dark:text-white relative"
        style={{ backgroundImage: "url('/school2.webp')" }}
      >
        <div onClick={handleClickCharacter} className="cursor-pointer">
          <SpriteCharacter direction={direction} scale={1} x={875} y={y} />
        </div>

        {/* Nouveaux élèves animés */}
        {newStudents.map((id) => (
          <NewStudent
            key={id}
            onFinish={() => {
              setNewStudents((prev) => prev.filter((s) => s !== id));
            }}
          />
        ))}

        {leaveStudents.map((id) => (
          <LeaveStudent
            key={id}
            onFinish={() =>
              setLeaveStudents((prev) => prev.filter((s) => s !== id))
            }
          />
        ))}

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
    </>
  );
}
