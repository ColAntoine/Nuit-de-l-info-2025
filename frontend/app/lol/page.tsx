"use client";

import { useState } from "react";

export default function EscapingInputPage() {
  const [position, setPosition] = useState({ top: "40%", left: "40%" });

  const moveAway = () => {
    const newTop = Math.random() * 80;
    const newLeft = Math.random() * 80;
    setPosition({
      top: `${newTop}%`,
      left: `${newLeft}%`,
    });
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#111827",
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", paddingTop: "2rem" }}>
        Essayez de remplir ce champ 😏
      </h1>

      <input
        type="text"
        placeholder="Clique moi si tu peux"
        onMouseEnter={moveAway}
        onMouseMove={moveAway}
        onFocus={moveAway}
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
          transform: "translate(-50%, -50%)",
          padding: "0.6rem 1rem",
          borderRadius: "999px",
          border: "1px solid #4B5563",
          background: "#111827",
          color: "white",
          outline: "none",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          cursor: "pointer",
        }}
      />
    </div>
  );
}
