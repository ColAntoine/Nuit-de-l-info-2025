import { useEffect, useRef, useState } from "react";
import SpriteStudentFront from "../components/SpriteStudentFront";

type LeaveStudentProps = {
    onFinish: () => void;
  };
  
export default function LeaveStudent({ onFinish }: LeaveStudentProps) {
    const x = 1420;               // X fixe
    const [y, setY] = useState(540); // départ
    const targetY = 900;          // en dehors de l'écran
  
    useEffect(() => {
      const step = 3;    // vitesse verticale
      const speed = 50;   // ms entre updates
  
      const id = setInterval(() => {
        setY((prevY) => {
          const nextY = prevY + step; // on descend
  
          if (nextY >= targetY) {
            clearInterval(id);
            setTimeout(onFinish, 300);
            return targetY;
          }
  
          return nextY;
        });
      }, speed);
  
      return () => clearInterval(id);
    }, [onFinish]);
  
    return (
      <SpriteStudentFront direction="front" scale={1} x={x} y={y} />
    );
  }