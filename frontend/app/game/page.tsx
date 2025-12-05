"use client";

import { useEffect, useRef, useState } from "react";
import Card from "../../components/Card";
import StatsCard from "../../components/StatsCard";
import SpriteCharacter from "../../components/SpriteCharacter";
import NewStudent from "../../components/NewStudent";
import LeaveStudent from "../../components/LeaveStudent";
import SnakeModal from "@/components/SnakeModal";
import {
  GameInstance,
  EventsCatalog,
  BigtekCatalog,
  BigtekErrors,
  type EventConfig,
  type BigtekErrorConfig,
} from "@/game/main";

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
  // Initialisation du jeu
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
        // reset partiel si on retape ↑, sinon reset complet
        konamiIndexRef.current = key === KONAMI_CODE[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ⚙️ Données du jeu (re-lues à chaque render)
  const euros = GameInstance.getMoney();
  const students = GameInstance.getStudents();
  const teachers = GameInstance.getTeachers();
  const studentSatisfaction = GameInstance.getStudentSatisfaction() * 100;
  const teacherSatisfaction = GameInstance.getTeacherSatisfaction() * 100;

  // Animation du perso principal (haut / bas)
  const [y, setY] = useState(200);
  const [direction, setDirection] = useState<"front" | "back">("front");
  const minY = 550;
  const maxY = 680;
  const dirRef = useRef<1 | -1>(1);

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

  // 👨‍🎓 Animations d'élèves
  const [newStudents, setNewStudents] = useState<number[]>([]);
  const [leaveStudents, setLeaveStudents] = useState<number[]>([]);

  const handleClickCharacter = () => {
    GameInstance.add_student();
    GameInstance.gain(1000); // cheat : +1000€

    setNewStudents((prev) => [...prev, Date.now()]);
    setLeaveStudents((prev) => [...prev, Date.now()]);

    setRefresh((v) => v + 1);
  };

  // 📅 Gestion des events / bigtek générés automatiquement
  const [availableEvents, setAvailableEvents] = useState<EventConfig[]>([]);
  const [availableBigtek, setAvailableBigtek] = useState<EventConfig[]>([]);
  const [bigtekErrorsMessages, setBigtekErrorsMessages] = useState<string[]>([]);

  // Clock : toutes les 7s → un nouveau "tour de jeu"
  useEffect(() => {
    const interval = setInterval(() => {
      // 1) Avancer la logique du jeu (argent, perte d'élèves, jour+1, etc.)
      GameInstance.next_day();

      // 2) Générer soit un Event, soit un Bigtek
      const roll = Math.random(); // 0–1

      if (roll < 0.5) {
        const randomEvent =
          EventsCatalog[Math.floor(Math.random() * EventsCatalog.length)];
        setAvailableEvents((prev) => [...prev, randomEvent]);
      } else {
        const randomBigtek =
          BigtekCatalog[Math.floor(Math.random() * BigtekCatalog.length)];
        setAvailableBigtek((prev) => [...prev, randomBigtek]);
      }

      // 3) Forcer le refresh pour mettre à jour stats / UI
      setRefresh((v) => v + 1);
    }, 7000); // 7s

    return () => clearInterval(interval);
  }, []);

  // Application des bonus/malus quand on clique sur un item Event
  const handlePickEvent = (index: number) => {
    const evt = availableEvents[index];
    if (!evt) return;

    const nbStudents = GameInstance.getStudents();
    const totalCost = evt.cost * nbStudents;

    if (GameInstance.getMoney() < totalCost) {
      // open_dialog("Pas assez d'argent", "Vous n'avez pas les fonds nécessaires...", [{ label: "OK" }]);
      return;
    }

    GameInstance.cost(totalCost);
    GameInstance.gain_satisfaction(evt.satisfaction / 100);

    setAvailableEvents((prev) => prev.filter((_, i) => i !== index));
    setRefresh((v) => v + 1);
  };

  // Application des bonus/malus quand on clique sur un item Bigtek
  const handlePickBigtek = (index: number) => {
    const tech = availableBigtek[index];
    if (!tech) return;

    if (GameInstance.getMoney() < tech.cost) {
      // open_dialog("Pas assez d'argent", "Vous n'avez pas les fonds nécessaires...", [{ label: "OK" }]);
      return;
    }

    // 🎁 bonus immédiat
    GameInstance.cost(tech.cost);
    GameInstance.gain_satisfaction(tech.satisfaction / 100);

    setAvailableBigtek((prev) => prev.filter((_, i) => i !== index));
    setRefresh((v) => v + 1);

    // 🔥 chercher l'erreur associée à cette bigtek
    const error: BigtekErrorConfig | undefined = BigtekErrors.find(
      (err) => err.name === tech.name
    );
    if (!error) return;

    // 🕒 dans 60s → appliquer le malus + afficher le message
    setTimeout(() => {
      const currentDay = GameInstance.getCurrentDay();
      // facteur de difficulté : augmente avec le temps
      // ex : day 0 → x1, day 30 → x2, day 60 → x3, etc.
      const difficulty = 1 + currentDay / 30;

      const scaledCost = Math.round(error.cost * difficulty);
      const scaledSatis = error.satisfaction * difficulty; // négatif

      GameInstance.cost(scaledCost);
      GameInstance.gain_satisfaction(scaledSatis / 100);

      setBigtekErrorsMessages((prev) => [
        ...prev,
        `${error.name} - ${error.error} (Coût: ${scaledCost}€ / ${scaledSatis} satis.)`,
      ]);

      setRefresh((v) => v + 1);
    }, 60000); // 60 000 ms = 1 minute
  };

  // Strings pour affichage dans les Card
  const updatesItems = availableBigtek.map(
    (b) => `${b.name} - Coût: ${b.cost}€ / +${b.satisfaction} satis.`
  );

  const eventsItems = availableEvents.map((e) => {
    const totalCost = e.cost * students;
    return `${e.name} - Coût: ${totalCost}€ / +${e.satisfaction} satis.`;
  });

  return (
    <>
      {/* 🐍 Snake caché derrière le Konami code */}
      <SnakeModal
        isOpen={isSnakeModalOpen}
        onClose={() => setIsSnakeModalOpen(false)}
      />

      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat p-6 text-black dark:text-white relative"
        style={{ backgroundImage: "url('/school2.webp')" }}
      >
        {/* Perso principal cliquable */}
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

        {/* Élèves qui quittent l’école */}
        {leaveStudents.map((id) => (
          <LeaveStudent
            key={id}
            onFinish={() =>
              setLeaveStudents((prev) => prev.filter((s) => s !== id))
            }
          />
        ))}

        {/* UI principale */}
        <div className="grid h-full grid-cols-3 gap-6">
          {/* Stats */}
          <div className="flex items-start justify-start">
            <div className="w-[300px]">
              <StatsCard
                title="Statistiques :"
                euros={euros}
                students={students}
                teachers={teachers}
                studentSatisfaction={studentSatisfaction}
                // teacherSatisfaction={teacherSatisfaction} // à remettre si ton composant le prend
              />
            </div>
          </div>

          <div className="flex items-center justify-center" />

          {/* Updates + Events + Bigtek Errors */}
          <div className="flex flex-col items-end justify-start gap-6">
            <div className="w-[600px]">
              <Card
                title="Updates :"
                items={updatesItems}
                onItemClick={handlePickBigtek}
              />
            </div>
            <div className="w-[600px]">
              <Card
                title="Events :"
                items={eventsItems}
                onItemClick={handlePickEvent}
              />
            </div>
            <div className="w-[600px]">
              <Card title="Bigtek Errors :" items={bigtekErrorsMessages} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
