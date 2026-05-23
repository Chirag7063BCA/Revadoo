import { useEffect, useRef } from "react";

export const SEGMENTS = [
  { index: 0, label: "TRY", code: "BL", icon: "🍀", color: "#f1f5f9", textColor: "#64748b" },
  { index: 1, label: "10", code: "10", icon: "💰", color: "#fff7ed", textColor: "#ea580c" },
  { index: 2, label: "100", code: "100", icon: "⭐", color: "#fef9ee", textColor: "#d97706" },
  { index: 3, label: "MINI", code: "500", icon: "🎁", color: "#f0fdf4", textColor: "#16a34a" },
  { index: 4, label: "LUCK", code: "BL", icon: "⚡", color: "#fff1f2", textColor: "#e11d48" },
  { index: 5, label: "BONUS", code: "10", icon: "🎯", color: "#f5f3ff", textColor: "#7c3aed" },
  { index: 6, label: "PRIZE", code: "100", icon: "🏆", color: "#f1f5f9", textColor: "#64748b" },
  { index: 7, label: "JP", code: "1K", icon: "👑", color: "#fffbeb", textColor: "#b45309" },
];

const TOTAL = SEGMENTS.length;
const SLICE = (2 * Math.PI) / TOTAL;
const DRAW_OFFSET = -Math.PI / 2;
const POINTER_ANGLE = -Math.PI / 2;

function drawWheel(canvas, rotation) {
  const context = canvas.getContext("2d");
  const size = canvas.width;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = centerX - 3;
  const wheelRadius = radius - size * 0.04;

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, size, size);

  const shadowGlow = context.createRadialGradient(centerX, centerY, wheelRadius, centerX, centerY, radius + 14);
  shadowGlow.addColorStop(0, "rgba(0,0,0,0)");
  shadowGlow.addColorStop(1, "rgba(0,0,0,0.35)");
  context.beginPath();
  context.arc(centerX, centerY, radius + 14, 0, 2 * Math.PI);
  context.fillStyle = shadowGlow;
  context.fill();

  const ringGradient = context.createLinearGradient(0, 0, size, size);
  ringGradient.addColorStop(0, "#13161d");
  ringGradient.addColorStop(0.6, "#0d0f14");
  ringGradient.addColorStop(1, "#08090c");
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  context.fillStyle = ringGradient;
  context.fill();

  const ringInnerGradient = context.createLinearGradient(0, 0, size, 0);
  ringInnerGradient.addColorStop(0, "#262a34");
  ringInnerGradient.addColorStop(1, "#11131a");
  context.beginPath();
  context.arc(centerX, centerY, radius - 1, 0, 2 * Math.PI);
  context.arc(centerX, centerY, wheelRadius + 6, 0, 2 * Math.PI, true);
  context.fillStyle = ringInnerGradient;
  context.fill();

  const markerCount = TOTAL * 2;
  for (let index = 0; index < markerCount; index += 1) {
    const markerAngle = DRAW_OFFSET + (index / markerCount) * (2 * Math.PI);
    const isMain = index % 2 === 0;
    const inner = radius - (isMain ? 13 : 10);
    const outer = radius - 5;
    context.beginPath();
    context.moveTo(centerX + Math.cos(markerAngle) * inner, centerY + Math.sin(markerAngle) * inner);
    context.lineTo(centerX + Math.cos(markerAngle) * outer, centerY + Math.sin(markerAngle) * outer);
    context.strokeStyle = isMain ? "#ff6b00" : "#4d5566";
    context.lineWidth = isMain ? 1.8 : 1.2;
    context.stroke();
  }

  const segmentPalette = ["#ff7a1f", "#f4f4f4", "#ff7a1f", "#f4f4f4", "#1a1d25", "#f4f4f4", "#ff7a1f", "#1a1d25"];

  SEGMENTS.forEach((segment, index) => {
    const startAngle = rotation + DRAW_OFFSET + index * SLICE;
    const endAngle = startAngle + SLICE;
    const midAngle = startAngle + SLICE / 2;

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, wheelRadius, startAngle, endAngle);
    context.closePath();
    context.fillStyle = segmentPalette[index % segmentPalette.length];
    context.fill();
    context.strokeStyle = "#2d313b";
    context.lineWidth = 2.4;
    context.stroke();

    const isDark = index === 4 || index === 7;
    const outerLabelFontSize = size * 0.052;

    context.save();
    context.translate(
      centerX + Math.cos(midAngle) * (wheelRadius * 0.62),
      centerY + Math.sin(midAngle) * (wheelRadius * 0.62)
    );
    context.rotate(midAngle + Math.PI / 2);
    context.font = `800 ${outerLabelFontSize}px "Montserrat", "Segoe UI", sans-serif`;
    context.fillStyle = isDark ? "#f8fafc" : "#1f2937";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(segment.label, 0, 0);
    context.restore();

    context.save();
    context.translate(
      centerX + Math.cos(midAngle) * (wheelRadius * 0.2),
      centerY + Math.sin(midAngle) * (wheelRadius * 0.2)
    );
    context.rotate(midAngle + Math.PI / 2);
    context.font = `700 ${size * 0.05}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
    context.fillStyle = isDark ? "#ffffff" : segment.textColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(segment.icon, 0, 0);
    context.restore();
  });

  const centerRadius = wheelRadius * 0.4;
  const centerGlow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerRadius);
  centerGlow.addColorStop(0, "#131722");
  centerGlow.addColorStop(1, "#0b0e13");
  context.beginPath();
  context.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
  context.fillStyle = centerGlow;
  context.fill();
  context.strokeStyle = "#ff6b00";
  context.lineWidth = 3.5;
  context.stroke();

  context.beginPath();
  context.arc(centerX, centerY, centerRadius * 0.87, 0, 2 * Math.PI);
  context.strokeStyle = "rgba(255,255,255,0.1)";
  context.lineWidth = 1.2;
  context.stroke();
}

export default function SpinWheel({ rotation, size = 340 }) {
  const canvasRef = useRef(null);
  const dprRef = useRef(1);
  const centerSize = Math.max(92, size * 0.3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const context = canvas.getContext("2d");
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawWheel(canvas, rotation);
  }, [size, rotation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawWheel(canvas, rotation);
  }, [rotation]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute left-1/2 z-20 -translate-x-1/2" style={{ top: -34 }}>
        <div className="relative flex flex-col items-center">
          <div
            className="rounded-full"
            style={{
              width: 24,
              height: 24,
              background: "#ff6b00",
              border: "2px solid #1c1f27",
              boxShadow: "0 4px 10px rgba(0,0,0,0.22)",
            }}
          />
          <div
            style={{
              marginTop: -2,
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "14px solid #ff6b00",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.22))",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: 6,
              left: "50%",
              width: 7,
              height: 7,
              transform: "translateX(-50%)",
              background: "#f8fafc",
            }}
          />
        </div>
      </div>

      <div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: "0 8px 28px rgba(0,0,0,0.22)" }}
      />

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#ff6b00] bg-[#0b0e13]"
        style={{ width: centerSize, height: centerSize, boxShadow: "inset 0 0 20px rgba(255,255,255,0.08)" }}
      >
        <svg
          viewBox="0 0 120 120"
          className="h-full w-full animate-spin"
          style={{ animationDuration: "8s" }}
        >
          <defs>
            <path id="wheel-revadoo-circle-text" d="M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" />
          </defs>
          <text fill="#ffffff" fontSize="9" fontWeight="700" letterSpacing="2.1">
            <textPath href="#wheel-revadoo-circle-text">
              REVADOO • REVADOO • REVADOO • REVADOO •
            </textPath>
          </text>
        </svg>
      </div>

      <canvas ref={canvasRef} className="rounded-full" />
    </div>
  );
}

export function animateWheel({ fromRotation, segmentIndex, skipAnimation, onTick, onDone }) {
  const normalize = (angle) => {
    const fullTurn = 2 * Math.PI;
    return ((angle % fullTurn) + fullTurn) % fullTurn;
  };

  const slice = (2 * Math.PI) / SEGMENTS.length;
  const targetCenter = segmentIndex * slice + slice / 2;
  const targetAngle = POINTER_ANGLE - DRAW_OFFSET - targetCenter;
  const spins = skipAnimation ? 0 : 7 + Math.random() * 4;
  const fullTurn = 2 * Math.PI;
  const current = normalize(fromRotation);
  const delta = normalize(targetAngle - current);
  const roughTotalRotation = spins * fullTurn + delta;
  const roughFinal = fromRotation + roughTotalRotation;
  const roughFinalNorm = normalize(roughFinal);
  const correction = normalize(targetAngle - roughFinalNorm);
  const totalRotation = roughTotalRotation + correction;
  const duration = skipAnimation ? 0 : 5200;

  if (duration === 0) {
    onTick(fromRotation + totalRotation);
    onDone();
    return;
  }

  const start = performance.now();
  let raf;

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 5);
    onTick(fromRotation + totalRotation * ease);

    if (progress < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      // Snap to exact final angle to avoid tiny float drift at landing.
      onTick(fromRotation + totalRotation);
      onDone();
    }
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}