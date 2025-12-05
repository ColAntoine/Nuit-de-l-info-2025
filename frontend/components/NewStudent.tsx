import { useEffect, useRef, useState } from "react";
import SpriteStudent from "../components/SpriteStudent";

type NewStudentProps = {
    onFinish: () => void;
  };
  
export default function NewStudent({ onFinish }: NewStudentProps) {
    const x = 320;          // X constant
    const [y, setY] = useState(900);  // Y de départ
    const targetY = 540;    // Y final
  
    useEffect(() => {
      const step = 3;       // vitesse verticale
      const speed = 50;     // ms entre updates
  
      const id = setInterval(() => {
        setY((prevY) => {
          const nextY = prevY - step; // on monte
  
          if (nextY <= targetY) {
            clearInterval(id);
            setTimeout(onFinish, 400);  // petit délai avant disparition
            return targetY;
          }
  
          return nextY;
        });
      }, speed);
  
      return () => clearInterval(id);
    }, [onFinish]);
  
    return (
      <SpriteStudent direction="back" scale={1} x={x} y={y} />
    );
  }
  
  