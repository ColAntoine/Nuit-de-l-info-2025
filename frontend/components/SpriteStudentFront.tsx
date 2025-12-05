"use client";

import { useEffect, useState } from "react";

type Direction = "front" | "back";

interface SpriteStudentProps {
  direction?: Direction;
  speed?: number;
  scale?: number;
  x?: number;
  y?: number; 
}

const SPRITE_PATH = "/personnafront.png";     // bien avec le / car dans /public
const SHEET_WIDTH = 1486;
const SHEET_HEIGHT = 785;

const COLS = 9;
const ROWS = 2;


const FRAME_WIDTH = SHEET_WIDTH / COLS;

const ROW_HEIGHT = SHEET_HEIGHT / ROWS; // ≈ 444.5 px -> tu peux mettre 480, 500, etc.

export default function SpriteStudent({
  direction = "front",
  speed = 200,
  scale = 1,
  x = 0,
  y = 0,
}: SpriteStudentProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((prev) => (prev + 1) % COLS); // 0,1,2
    }, speed);

    return () => clearInterval(id);
  }, [speed]);

  const rowIndex = direction === "back" ? 0 : 1;

  const displayWidth = FRAME_WIDTH * scale;
  const displayHeight = ROW_HEIGHT * scale;

  const offsetX = frame * FRAME_WIDTH * scale;
  const offsetY = rowIndex * ROW_HEIGHT * scale;

  return (
    <div
      style={{
        position: "absolute", 
        width: displayWidth,
        height: displayHeight,
        left: x,
        top: y,
        overflow: "hidden",
        backgroundImage: `url(${SPRITE_PATH})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${SHEET_WIDTH * scale}px ${SHEET_HEIGHT * scale}px`,
        backgroundPosition: `-${offsetX}px -${offsetY}px`,
        imageRendering: "pixelated",
      }}
    />
  );
}
