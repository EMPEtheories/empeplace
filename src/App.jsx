import React, { useEffect, useRef, useState } from "react";

const WIDTH = 200;
const HEIGHT = 100;
const PIXEL_SIZE = 4;
const COLORS = [
  "#FFFFFF",
  "#E4E4E4",
  "#888888",
  "#222222",
  "#FFA7D1",
  "#E50000",
  "#E59500",
  "#A06A42",
  "#E5D900",
  "#94E044",
  "#02BE01",
  "#00D3DD",
  "#0083C7",
  "#0000EA",
  "#CF6EE4",
  "#820080",
];
const COOLDOWN_MS = 60000;

export default function App() {
  const canvasRef = useRef(null);
  const [pixels, setPixels] = useState(
    () =>
      JSON.parse(localStorage.getItem("pixels")) ||
      Array(WIDTH * HEIGHT).fill(0)
  );
  const [lastPlaced, setLastPlaced] = useState(0);
  const [selectedColor, setSelectedColor] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < pixels.length; i++) {
      const colorIndex = pixels[i];
      const x = i % WIDTH;
      const y = Math.floor(i / WIDTH);
      ctx.fillStyle = COLORS[colorIndex];
      ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    }
  }, [pixels]);

  function placePixel(e) {
    const now = Date.now();
    if (now - lastPlaced < COOLDOWN_MS) {
      alert(
        `Cooldown active! Wait ${(COOLDOWN_MS - (now - lastPlaced)) / 1000}s`
      );
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
    const idx = y * WIDTH + x;
    const newPixels = [...pixels];
    newPixels[idx] = selectedColor;
    setPixels(newPixels);
    setLastPlaced(now);
    localStorage.setItem("pixels", JSON.stringify(newPixels));
  }

  function exportPNG() {
    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < pixels.length; i++) {
      const colorIndex = pixels[i];
      const x = i % WIDTH;
      const y = Math.floor(i / WIDTH);
      ctx.fillStyle = COLORS[colorIndex];
      ctx.fillRect(x, y, 1, 1);
    }
    const link = document.createElement("a");
    link.download = "empes_banner.png";
    link.href = canvas.toDataURL();
    link.click();
  }

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#121212",
        color: "#eee",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        Make Empes Banner
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 360,
          marginBottom: 20,
        }}
      >
        {COLORS.map((color, i) => (
          <button
            key={i}
            onClick={() => setSelectedColor(i)}
            style={{
              backgroundColor: color,
              width: 32,
              height: 32,
              margin: 4,
              borderRadius: 6,
              border: selectedColor === i ? "3px solid #fff" : "1px solid #555",
              cursor: "pointer",
              transition: "border-color 0.3s",
            }}
            aria-label={`Select color ${color}`}
            title={color}
          />
        ))}
      </div>

      <canvas
        ref={canvasRef}
        width={WIDTH * PIXEL_SIZE}
        height={HEIGHT * PIXEL_SIZE}
        style={{
          borderRadius: 12,
          boxShadow: "0 0 15px rgba(0,0,0,0.6)",
          border: "2px solid #555",
          imageRendering: "pixelated",
          cursor: "crosshair",
        }}
        onClick={placePixel}
      />

      <button
        onClick={exportPNG}
        style={{
          marginTop: 24,
          padding: "12px 32px",
          fontSize: "1.1rem",
          borderRadius: 8,
          backgroundColor: "#bb86fc",
          color: "#121212",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 4px 8px rgba(187, 134, 252, 0.5)",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#9a6de0")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#bb86fc")
        }
      >
        Export as PNG
      </button>

      <p style={{ marginTop: 16, fontSize: "0.9rem", color: "#ccc" }}>
        Cooldown: 60 seconds per pixel. Click canvas to place pixels.
      </p>
    </div>
  );
}
