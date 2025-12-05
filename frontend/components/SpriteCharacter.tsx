"use client";

import { useEffect, useState } from "react";

type Direction = "front" | "back";

interface SpriteCharacterProps {
  direction?: Direction;
  speed?: number;
  scale?: number;
  x?: number;
  y?: number; 
}

const SPRITE_PATH = "/kevin.png";     // bien avec le / car dans /public
const SHEET_WIDTH = 496;
const SHEET_HEIGHT = 889;

const COLS = 3;
const ROWS = 2;

// largeur d'un frame (ça tu l'as bon)
const FRAME_WIDTH = SHEET_WIDTH / COLS;

// hauteur d'une ligne de sprites.
// C'est ICI que tu joues si le perso est coupé ou trop petit en hauteur.
const ROW_HEIGHT = SHEET_HEIGHT / ROWS; // ≈ 444.5 px -> tu peux mettre 480, 500, etc.

export default function SpriteCharacter({
  direction = "front",
  speed = 200,
  scale = 1,
  x = 0,
  y = 0,
}: SpriteCharacterProps) {
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
