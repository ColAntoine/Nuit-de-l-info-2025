"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Direction = "front" | "back";

interface SpriteCharacterProps {
    direction?: Direction;
    speed?: number; 
    scale?: number;
}

const SPRITE_PATH = "kevin.svg"
const SHEET_WIDTH = 496;
const SHEET_HEIGHT = 889;

const FRAME_WIDTH = SHEET_WIDTH / 3;
const FRAME_HEIGHT = SHEET_HEIGHT / 2;

export default function DirectorAnimator({
    direction = "front",
    speed = 200,
    scale = 1,
}: SpriteCharacterProps) {
    const [frame, setFrame] = useState(0);
    
    useEffect(() => {
        const id = setInterval(() => {
          setFrame((prev) => (prev + 1) % 3);
        }, speed);
    
        return () => clearInterval(id);
      }, [speed]);

      const rowIndex = direction === "back" ? 0 : 1;
      const offsetX = frame * FRAME_WIDTH * scale;
      const offsetY = rowIndex * FRAME_HEIGHT * scale;
      return (
        <div
            style={{
                position: "relative",
                width: FRAME_WIDTH * scale,
                height: FRAME_HEIGHT * scale,
                overflow: "hidden",
            }}
        >
            <Image
                src={SPRITE_PATH}
                alt="Director"
                width={SHEET_WIDTH * scale}
                height={SHEET_HEIGHT * scale}
                style={{
                    objectFit: "none",
                    objectPosition: `-${offsetX}px -${offsetY}px`,
                    imageRendering: "pixelated",
                  }}
                  priority
            />
        </div>
      );
}