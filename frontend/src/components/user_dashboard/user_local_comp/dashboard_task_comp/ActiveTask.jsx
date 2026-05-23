// // LOCATION: src/components/user_dashboard/user_local_comp/dashboard_task_comp/ActiveTask.jsx

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useTasksContext } from "./Taskscontext";

// const C = { orange: "#FF6B00", orangeGlow: "rgba(255,107,0,0.15)", black: "#0A0A0A", borderGray: "#E5E5E5", textGray: "#888" };

// // ─────────────────────────────────────────────────────────────────────────────
// // ── Countdown ring SVG ────────────────────────────────────────────────────────
// // ─────────────────────────────────────────────────────────────────────────────
// const Ring = ({ secondsLeft, totalSeconds, urgent }) => {
//   const r    = 36;
//   const circ = 2 * Math.PI * r;
//   const pct  = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
//   return (
//     <svg width="90" height="90" style={{ transform: "rotate(-90deg)" }}>
//       <circle cx="45" cy="45" r={r} fill="none" stroke="#f0f0f0" strokeWidth="6" />
//       <circle
//         cx="45" cy="45" r={r} fill="none"
//         stroke={urgent ? "#ef4444" : C.orange}
//         strokeWidth="6"
//         strokeDasharray={`${circ * pct} ${circ}`}
//         strokeLinecap="round"
//         style={{ transition: "stroke-dasharray 0.9s linear" }}
//       />
//     </svg>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // ── PTC Task ──────────────────────────────────────────────────────────────────
// // Strategy:
// //  - Opens external URL in a new tab immediately
// //  - Keeps the PTC timer in this modal
// //  - Cancels when the user comes back to this page before the timer ends
// //  - At random point mid-timer → "Confirm you're still here" button
// //  - On completion → screenshot upload step
// // ─────────────────────────────────────────────────────────────────────────────
// const PTCTask = ({ task, onVerified, onForcedCancel }) => {
//   const totalSecs = Math.max(task.timeMinutes || 30, 5); // timeMinutes stores seconds for PTC
//   const [secondsLeft,     setSecondsLeft]     = useState(totalSecs);
//   const [phase,           setPhase]           = useState("ready");   // ready|watching|cancelled|done
//   const [inactiveSecs,    setInactiveSecs]    = useState(0);
//   const [showConfirmBtn,  setShowConfirmBtn]  = useState(false);
//   const [confirmClicked,  setConfirmClicked]  = useState(false);
//   const [urlOpened,       setUrlOpened]       = useState(false);
//   const [cancelReason,    setCancelReason]    = useState("");
//   const tickRef = useRef(null);
//   const titleRef = useRef(document.title);
//   const startedAtRef = useRef(0);
//   const ignoreVisibilityUntilRef = useRef(0);
//   const externalWindowRef = useRef(null);
//   const returnAlertShownRef = useRef(false);

//   // Schedule random confirm-button mid-timer
//   const scheduleConfirm = useCallback((total) => {
//     const earliest = Math.floor(total * 0.3);
//     const latest   = Math.floor(total * 0.7);
//     const delay    = (earliest + Math.floor(Math.random() * (latest - earliest))) * 1000;
//     return setTimeout(() => setShowConfirmBtn(true), delay);
//   }, []);

//   const startWatching = () => {
//     const openedWindow = window.open(task.link, "_blank");
//     if (!openedWindow) {
//       setCancelReason("Popup blocked. Allow popups for this site and try again.");
//       setPhase("cancelled");
//       return;
//     }

//     try {
//       openedWindow.opener = null;
//     } catch {}

//     externalWindowRef.current = openedWindow;
//     setUrlOpened(true);
//     setCancelReason("");
//     returnAlertShownRef.current = false;
//     startedAtRef.current = Date.now();
//     ignoreVisibilityUntilRef.current = Date.now() + 1800;
//     setPhase("watching");
//   };

//   const resetAndRestart = () => {
//     clearInterval(tickRef.current);
//     if (externalWindowRef.current && !externalWindowRef.current.closed) {
//       externalWindowRef.current.close();
//     }
//     externalWindowRef.current = null;
//     startedAtRef.current = 0;
//     ignoreVisibilityUntilRef.current = 0;
//     returnAlertShownRef.current = false;
//     setSecondsLeft(totalSecs);
//     setInactiveSecs(0);
//     setShowConfirmBtn(false);
//     setConfirmClicked(false);
//     setUrlOpened(false);
//     setCancelReason("");
//     setPhase("ready");
//   };

//   useEffect(() => {
//     if (phase === "watching") {
//       const mins = Math.floor(secondsLeft / 60);
//       const secs = secondsLeft % 60;
//       const timeLabel = mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : `${secs}s`;
//       document.title = `🛡️ ${timeLabel} • ${task.title || "PTC"}`;
//       return;
//     }

//     document.title = titleRef.current;
//   }, [phase, secondsLeft, task.title]);

//   useEffect(() => {
//     if (phase !== "watching") return;

//     const handleVisibility = () => {
//       const now = Date.now();
//       if (document.hidden) {
//         if (now < ignoreVisibilityUntilRef.current) return;
//         setInactiveSecs(0);
//         return;
//       }

//       if (startedAtRef.current && now >= ignoreVisibilityUntilRef.current) {
//         if (!returnAlertShownRef.current) {
//           returnAlertShownRef.current = true;
//           window.alert("You switched tabs before the timer finished. Start again and keep the tab open.");
//         }
//         setCancelReason("You returned to this page before the PTC timer finished. Reward cancelled.");
//         clearInterval(tickRef.current);
//         setPhase("cancelled");
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibility);
//     return () => document.removeEventListener("visibilitychange", handleVisibility);
//   }, [phase]);

//   // Main tick — runs every 1 second when watching
//   useEffect(() => {
//     if (phase !== "watching") return;
//     const confirmTimer = scheduleConfirm(totalSecs);

//     tickRef.current = setInterval(() => {
//       // Keep the timer running while the external site is open.
//       // The task fails if the user comes back to this page before it completes.
//       setSecondsLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(tickRef.current);
//           clearTimeout(confirmTimer);
//           setPhase("done");
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => {
//       clearInterval(tickRef.current);
//       clearTimeout(confirmTimer);
//     };
//   }, [phase]);

//   // Trigger onVerified when phase reaches done
//   useEffect(() => {
//     if (phase === "done") onVerified();
//   }, [phase]);

//   // Trigger cancel propagation
//   useEffect(() => {
//     if (phase === "cancelled") onForcedCancel();
//   }, [phase]);

//   const urgent = secondsLeft <= 10 && phase === "watching";
//   const mins   = Math.floor(secondsLeft / 60);
//   const secs   = secondsLeft % 60;
//   const timeStr = mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : `${secs}s`;

//   // ── READY state ────────────────────────────────────────────────────────────
//   if (phase === "ready") {
//     return (
//       <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
//         <div style={{ fontSize: 56 }}>💰</div>
//         <div style={{ textAlign: "center" }}>
//           <p style={{ fontWeight: 900, fontSize: 18, color: C.black }}>Pay To Click Task</p>
//           <p style={{ color: C.textGray, fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>
//             A website will open in a <strong>new tab</strong>.<br />
//             Visit that website and keep it open until the timer ends.<br />
//             If you return to this page before the timer ends, the task will <strong>cancel and restart</strong>.
//           </p>
//         </div>

//         {/* Rules */}
//         <div style={{ width: "100%", background: "#fafafa", borderRadius: 14, padding: "14px 16px", border: `1px solid ${C.borderGray}` }}>
//           {[
//               ["❌", "Coming back here when the timer ends and  the is done  task"],
//               ["⏱️", "Wait for the full timer to finish"],
//             ["🖱️", "Stay interactive — confirm button may appear"],
//           ].map(([icon, text]) => (
//             <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", borderBottom: "1px solid #f0f0f0" }}>
//               <span style={{ fontSize: 16 }}>{icon}</span>
//               <span style={{ fontSize: 12, color: "#555", fontWeight: 500 }}>{text}</span>
//             </div>
//           ))}
//         </div>

//         <button
//           onClick={startWatching}
//           style={{ width: "100%", background: C.orange, color: "#fff", border: "none", borderRadius: 12, padding: 14, fontWeight: 800, fontSize: 15, cursor: "pointer" }}
//         >
//           Open Site &amp; Start Timer →
//         </button>
//       </div>
//     );
//   }

//   // ── CANCELLED state ────────────────────────────────────────────────────────
//   if (phase === "cancelled") {
//     return (
//       <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
//         <span style={{ fontSize: 56 }}>🚫</span>
//         <p style={{ fontWeight: 900, fontSize: 20, color: "#ef4444" }}>Task Cancelled</p>
//         <p style={{ color: C.textGray, fontSize: 14, lineHeight: 1.6 }}>
//           {cancelReason || "You switched tabs during the PTC task."}<br />
//           The reward has been cancelled.
//         </p>
//         <div style={{ display: "flex", gap: 10, width: "100%" }}>
//           <button
//             onClick={resetAndRestart}
//             style={{ flex: 1, background: C.orange, color: "#fff", border: "none", borderRadius: 12, padding: 13, fontWeight: 800, fontSize: 15, cursor: "pointer" }}
//           >
//             Start Again
//           </button>
//           <button onClick={onForcedCancel} style={{ flex: 1, background: C.black, color: "#fff", border: "none", borderRadius: 12, padding: 13, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
//             Back to Tasks
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ── WATCHING state ─────────────────────────────────────────────────────────
//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
//       {/* Timer ring */}
//       <div style={{ position: "relative", width: 90, height: 90 }}>
//         <Ring secondsLeft={secondsLeft} totalSeconds={totalSecs} urgent={urgent} />
//         <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
//           <p style={{ fontWeight: 900, fontSize: 18, color: urgent ? "#ef4444" : C.black, lineHeight: 1 }}>{timeStr}</p>
//         </div>
//       </div>

//       <p style={{ fontWeight: 700, fontSize: 15, color: C.black, textAlign: "center" }}>
//         {urgent ? "⚡ Almost done! Do not come back here!" : "Timer running — keep the external tab open until it finishes."}
//       </p>

//       {/* Inactive warning */}
//       {inactiveSecs > 0 && (
//         <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 12, padding: "10px 16px", width: "100%", textAlign: "center" }}>
//           <p style={{ color: "#ef4444", fontWeight: 700, fontSize: 13 }}>
//             ⚠️ Tab inactive — {5 - inactiveSecs}s before cancel!
//           </p>
//         </div>
//       )}

//       {/* Random confirm button */}
//       {showConfirmBtn && !confirmClicked && (
//         <div style={{ width: "100%", background: "#fff8f0", border: `2px solid ${C.orange}`, borderRadius: 14, padding: "16px", textAlign: "center" }}>
//           <p style={{ fontWeight: 700, fontSize: 13, color: C.black, marginBottom: 10 }}>
//             🖱️ Confirm you're still watching!
//           </p>
//           <button
//             onClick={() => setConfirmClicked(true)}
//             style={{ background: C.orange, color: "#fff", border: "none", borderRadius: 10, padding: "10px 28px", fontWeight: 800, fontSize: 13, cursor: "pointer" }}
//           >
//             Yes, I'm here! ✅
//           </button>
//         </div>
//       )}
//       {confirmClicked && (
//         <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid #22c55e55", borderRadius: 12, padding: "10px 16px", width: "100%", textAlign: "center" }}>
//           <p style={{ color: "#16a34a", fontWeight: 700, fontSize: 13 }}>✅ Confirmed! Keep the tab open.</p>
//         </div>
//       )}

//       <p style={{ fontSize: 11, color: "#ccc", textAlign: "center" }}>
//         External site opened. Keep using that tab until the timer ends.
//       </p>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // ── Captcha Task ──────────────────────────────────────────────────────────────
// // ─────────────────────────────────────────────────────────────────────────────
// const generateCaptcha = () => {
//   const chars  = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//   const len    = 6;
//   let code     = "";
//   for (let i = 0; i < len; i++) code += chars[Math.floor(Math.random() * chars.length)];
//   return code;
// };

// const CaptchaTask = ({ onVerified }) => {
//   const [code,    setCode]    = useState(generateCaptcha);
//   const [input,   setInput]   = useState("");
//   const [error,   setError]   = useState("");
//   const [tries,   setTries]   = useState(0);
//   const canvasRef = useRef(null);

//   // Draw captcha on canvas
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Background
//     ctx.fillStyle = "#f8f8f8";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // Noise lines
//     for (let i = 0; i < 6; i++) {
//       ctx.strokeStyle = `rgba(${Math.random()*200},${Math.random()*200},${Math.random()*200},0.4)`;
//       ctx.lineWidth = 1;
//       ctx.beginPath();
//       ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
//       ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
//       ctx.stroke();
//     }

//     // Letters
//     const colors = ["#FF6B00","#0a0a0a","#374151","#7c3aed","#059669"];
//     code.split("").forEach((char, i) => {
//       ctx.font = `bold ${22 + Math.random() * 8}px monospace`;
//       ctx.fillStyle = colors[i % colors.length];
//       ctx.save();
//       ctx.translate(18 + i * 28, 34 + (Math.random() * 8 - 4));
//       ctx.rotate((Math.random() * 0.4) - 0.2);
//       ctx.fillText(char, 0, 0);
//       ctx.restore();
//     });
//   }, [code]);

//   const handleVerify = () => {
//     if (input.toUpperCase() === code) {
//       onVerified();
//     } else {
//       setError("Incorrect — try again");
//       setCode(generateCaptcha());
//       setInput("");
//       setTries((t) => t + 1);
//     }
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
//       <div style={{ fontSize: 48 }}>🤖</div>
//       <p style={{ fontWeight: 800, fontSize: 16, color: C.black, textAlign: "center" }}>
//         Solve the Captcha
//       </p>
//       <p style={{ color: C.textGray, fontSize: 13, textAlign: "center", marginTop: -10 }}>
//         Type the characters exactly as shown
//       </p>

//       {/* Canvas captcha */}
//       <div style={{ border: `2px solid ${C.borderGray}`, borderRadius: 12, overflow: "hidden", padding: 4, background: "#fff" }}>
//         <canvas ref={canvasRef} width={200} height={56} style={{ display: "block" }} />
//       </div>

//       {/* Refresh */}
//       <button onClick={() => { setCode(generateCaptcha()); setInput(""); setError(""); }}
//         style={{ fontSize: 12, color: C.orange, fontWeight: 700, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
//         🔄 Refresh captcha
//       </button>

//       <input
//         value={input}
//         onChange={(e) => setInput(e.target.value.toUpperCase())}
//         onKeyDown={(e) => e.key === "Enter" && handleVerify()}
//         maxLength={6}
//         placeholder="Enter characters"
//         style={{ width: "100%", border: `2px solid ${error ? "#ef4444" : C.borderGray}`, borderRadius: 12, padding: "12px 16px", fontSize: 18, fontWeight: 800, letterSpacing: "0.3em", textAlign: "center", outline: "none", fontFamily: "monospace", boxSizing: "border-box" }}
//       />

//       {error && <p style={{ color: "#ef4444", fontSize: 13, fontWeight: 600 }}>{error}{tries > 1 ? ` (${tries} tries)` : ""}</p>}

//       <button onClick={handleVerify} disabled={input.length < 6}
//         style={{ width: "100%", background: input.length >= 6 ? C.orange : "#e5e5e5", color: input.length >= 6 ? "#fff" : C.textGray, border: "none", borderRadius: 12, padding: 13, fontWeight: 800, fontSize: 15, cursor: input.length >= 6 ? "pointer" : "default" }}>
//         Verify Captcha →
//       </button>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // ── Lucky Draw Task ───────────────────────────────────────────────────────────
// // ─────────────────────────────────────────────────────────────────────────────
// const WHEEL_COLORS = ["#FF6B00","#0a0a0a","#f59e0b","#374151","#22c55e","#7c3aed","#ef4444","#0ea5e9"];
// const WHEEL_LABELS = ["🎁 WIN","😢 No","🌟 WIN","🎯 Try","💰 WIN","🔥 WIN","😅 No","⭐ WIN"];

// const LuckyDrawTask = ({ onVerified }) => {
//   const [spinning,  setSpinning]  = useState(false);
//   const [spun,      setSpun]      = useState(false);
//   const [rotation,  setRotation]  = useState(0);
//   const [won,       setWon]       = useState(false);
//   const [segment,   setSegment]   = useState(null);
//   const canvasRef = useRef(null);
//   const slices = WHEEL_COLORS.length;
//   const arc    = (2 * Math.PI) / slices;

//   const drawWheel = (rot = 0) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     const cx  = canvas.width / 2;
//     const cy  = canvas.height / 2;
//     const r   = cx - 6;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     for (let i = 0; i < slices; i++) {
//       const start = rot + i * arc;
//       const end   = start + arc;
//       ctx.beginPath();
//       ctx.moveTo(cx, cy);
//       ctx.arc(cx, cy, r, start, end);
//       ctx.closePath();
//       ctx.fillStyle = WHEEL_COLORS[i];
//       ctx.fill();
//       ctx.strokeStyle = "#fff";
//       ctx.lineWidth = 2;
//       ctx.stroke();

//       ctx.save();
//       ctx.translate(cx, cy);
//       ctx.rotate(start + arc / 2);
//       ctx.textAlign = "right";
//       ctx.fillStyle = "#fff";
//       ctx.font = "bold 11px sans-serif";
//       ctx.fillText(WHEEL_LABELS[i], r - 10, 4);
//       ctx.restore();
//     }

//     // Center circle
//     ctx.beginPath();
//     ctx.arc(cx, cy, 14, 0, 2 * Math.PI);
//     ctx.fillStyle = "#fff";
//     ctx.fill();
//     ctx.strokeStyle = "#e5e5e5";
//     ctx.lineWidth = 2;
//     ctx.stroke();
//   };

//   useEffect(() => { drawWheel(0); }, []);

//   const spin = () => {
//     if (spinning || spun) return;
//     setSpinning(true);
//     const extraSpins = 5 + Math.random() * 5;
//     const winChance  = Math.random() > 0.4; // 60% win
//     // Pick a winning or losing segment
//     const winSegs    = [0, 2, 4, 5, 7]; // WIN labels
//     const loseSegs   = [1, 3, 6];
//     const targetSeg  = winChance
//       ? winSegs[Math.floor(Math.random() * winSegs.length)]
//       : loseSegs[Math.floor(Math.random() * loseSegs.length)];

//     const targetAngle = -(targetSeg * arc + arc / 2);
//     const totalRot    = extraSpins * 2 * Math.PI + targetAngle;
//     const duration    = 4000;
//     const start       = performance.now();
//     const startRot    = rotation;

//     const animate = (now) => {
//       const elapsed = now - start;
//       const progress = Math.min(elapsed / duration, 1);
//       // Ease out cubic
//       const ease = 1 - Math.pow(1 - progress, 3);
//       const current = startRot + totalRot * ease;
//       drawWheel(current);
//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       } else {
//         setRotation(current);
//         setSpinning(false);
//         setSpun(true);
//         setSegment(targetSeg);
//         setWon(winChance);
//       }
//     };
//     requestAnimationFrame(animate);
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
//       <p style={{ fontWeight: 800, fontSize: 16, color: C.black }}>Spin the Wheel!</p>

//       {/* Pointer */}
//       <div style={{ position: "relative" }}>
//         <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", zIndex: 10, width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "20px solid #ef4444" }} />
//         <canvas ref={canvasRef} width={220} height={220} style={{ borderRadius: "50%", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", display: "block" }} />
//       </div>

//       {!spun ? (
//         <button
//           onClick={spin}
//           disabled={spinning}
//           style={{ width: "100%", background: spinning ? "#e5e5e5" : C.orange, color: spinning ? C.textGray : "#fff", border: "none", borderRadius: 12, padding: 13, fontWeight: 800, fontSize: 15, cursor: spinning ? "default" : "pointer" }}
//         >
//           {spinning ? "Spinning…" : "🎰 Spin!"}
//         </button>
//       ) : won ? (
//         <div style={{ width: "100%", textAlign: "center" }}>
//           <p style={{ fontSize: 36, marginBottom: 8 }}>🎉</p>
//           <p style={{ fontWeight: 900, fontSize: 18, color: "#16a34a", marginBottom: 4 }}>You Won!</p>
//           <p style={{ color: C.textGray, fontSize: 13, marginBottom: 16 }}>Lucky draw reward unlocked</p>
//           <button onClick={onVerified} style={{ width: "100%", background: C.orange, color: "#fff", border: "none", borderRadius: 12, padding: 13, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
//             🎁 Claim Reward →
//           </button>
//         </div>
//       ) : (
//         <div style={{ width: "100%", textAlign: "center" }}>
//           <p style={{ fontSize: 36, marginBottom: 8 }}>😢</p>
//           <p style={{ fontWeight: 800, fontSize: 16, color: C.black, marginBottom: 4 }}>Not this time!</p>
//           <p style={{ color: C.textGray, fontSize: 13, marginBottom: 12 }}>Better luck next time. You can try again tomorrow.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // ── Short Link Task ───────────────────────────────────────────────────────────
// // ─────────────────────────────────────────────────────────────────────────────
// const ShortLinkTask = ({ task, onVerified }) => {
//   const wait = Math.max(task.timeMinutes || 10, 5);
//   const [phase,     setPhase]     = useState("ready");   // ready|waiting|done
//   const [secs,      setSecs]      = useState(wait);
//   const [opened,    setOpened]    = useState(false);
//   const tickRef = useRef(null);

//   const handleOpen = () => {
//     window.open(task.link, "_blank", "noopener,noreferrer");
//     setOpened(true);
//     setPhase("waiting");
//   };

//   useEffect(() => {
//     if (phase !== "waiting") return;
//     tickRef.current = setInterval(() => {
//       setSecs((s) => {
//         if (s <= 1) { clearInterval(tickRef.current); setPhase("done"); return 0; }
//         return s - 1;
//       });
//     }, 1000);
//     return () => clearInterval(tickRef.current);
//   }, [phase]);

//   if (phase === "ready") return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
//       <span style={{ fontSize: 56 }}>🔗</span>
//       <p style={{ fontWeight: 800, fontSize: 16, color: C.black, textAlign: "center" }}>Short Link Task</p>
//       <p style={{ color: C.textGray, fontSize: 13, textAlign: "center", lineHeight: 1.6 }}>
//         Click the link below. After the timer completes, you'll be able to claim your reward.
//       </p>
//       <button onClick={handleOpen} style={{ width: "100%", background: C.orange, color: "#fff", border: "none", borderRadius: 12, padding: 13, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
//         🔗 Open Link →
//       </button>
//     </div>
//   );

//   if (phase === "waiting") return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
//       <div style={{ position: "relative", width: 90, height: 90 }}>
//         <Ring secondsLeft={secs} totalSeconds={wait} urgent={secs <= 5} />
//         <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
//           <p style={{ fontWeight: 900, fontSize: 18, color: C.black }}>{secs}s</p>
//         </div>
//       </div>
//       <p style={{ fontWeight: 700, fontSize: 14, color: C.black }}>Waiting for timer…</p>
//       <p style={{ color: C.textGray, fontSize: 12, textAlign: "center" }}>The link is open in another tab. Stay here until the timer completes.</p>
//     </div>
//   );

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
//       <span style={{ fontSize: 56 }}>✅</span>
//       <p style={{ fontWeight: 900, fontSize: 18, color: C.black }}>Timer Complete!</p>
//       <button onClick={onVerified} style={{ width: "100%", background: C.orange, color: "#fff", border: "none", borderRadius: 12, padding: 13, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
//         🎁 Claim Reward →
//       </button>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // ── Screenshot upload ─────────────────────────────────────────────────────────
// // ─────────────────────────────────────────────────────────────────────────────
// const ScreenshotUpload = ({ onSubmit, submitting }) => {
//   const [preview, setPreview] = useState(null);
//   const [error,   setError]   = useState("");

//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > 5 * 1024 * 1024) { setError("Max 5 MB"); return; }
//     const reader = new FileReader();
//     reader.onloadend = () => setPreview(reader.result);
//     reader.readAsDataURL(file);
//     setError("");
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//       <div style={{ textAlign: "center" }}>
//         <span style={{ fontSize: 40 }}>📸</span>
//         <p style={{ fontWeight: 800, fontSize: 16, color: C.black, marginTop: 8 }}>Upload Proof Screenshot</p>
//         <p style={{ color: C.textGray, fontSize: 12, marginTop: 4 }}>Optional but speeds up review — under review up to 24h</p>
//       </div>
//       {preview ? (
//         <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: `2px solid ${C.orange}` }}>
//           <img src={preview} alt="proof" style={{ width: "100%", maxHeight: 200, objectFit: "cover" }} />
//           <button onClick={() => setPreview(null)} style={{ position: "absolute", top: 8, right: 8, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontWeight: 800 }}>✕</button>
//         </div>
//       ) : (
//         <label htmlFor="ss-upload" style={{ border: `2px dashed ${C.borderGray}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: "#fafafa", display: "block" }}>
//           <input type="file" id="ss-upload" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
//           <p style={{ color: C.textGray, fontSize: 13, fontWeight: 600 }}>Click to upload</p>
//           <p style={{ color: "#bbb", fontSize: 11, marginTop: 4 }}>PNG, JPG up to 5 MB</p>
//         </label>
//       )}
//       {error && <p style={{ color: "#ef4444", fontSize: 13, fontWeight: 600, textAlign: "center" }}>{error}</p>}
//       <button onClick={() => onSubmit(preview || "")} disabled={submitting}
//         style={{ width: "100%", background: submitting ? "#e5e5e5" : C.orange, color: submitting ? C.textGray : "#fff", border: "none", borderRadius: 12, padding: 13, fontWeight: 800, fontSize: 15, cursor: submitting ? "default" : "pointer" }}>
//         {submitting ? "Submitting…" : "Submit for Review →"}
//       </button>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // ── Submitted success ─────────────────────────────────────────────────────────
// // ─────────────────────────────────────────────────────────────────────────────
// const SubmittedSuccess = ({ onClose }) => (
//   <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
//     <span style={{ fontSize: 56 }}>🎉</span>
//     <p style={{ fontWeight: 900, fontSize: 20, color: C.black }}>Submitted!</p>
//     <p style={{ color: C.textGray, fontSize: 14, lineHeight: 1.6 }}>
//       Your task is <strong>under review</strong>.<br />
//       Reward arrives within <strong>24 hours</strong> after admin approval.
//     </p>
//     <button onClick={onClose} style={{ width: "100%", background: C.black, color: "#fff", border: "none", borderRadius: 12, padding: 13, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
//       Back to Tasks
//     </button>
//   </div>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // ── Main modal ────────────────────────────────────────────────────────────────
// // ─────────────────────────────────────────────────────────────────────────────
// const CATEGORY_HEADER = {
//   "ptc":        { color: "#f59e0b", bg: "#fffbeb", label: "PTC Task",        icon: "💰" },
//   "captcha":    { color: "#6366f1", bg: "#f5f3ff", label: "Captcha Task",    icon: "🤖" },
//   "lucky-draw": { color: "#ec4899", bg: "#fdf2f8", label: "Lucky Draw",      icon: "🎰" },
//   "short-link": { color: "#0ea5e9", bg: "#f0f9ff", label: "Short Link Task", icon: "🔗" },
// };

// const ActiveTask = () => {
//   const { activeTask, setActiveTask, submitTask } = useTasksContext();
//   const [step,        setStep]        = useState("task");   // task|screenshot|success
//   const [submitting,  setSubmitting]  = useState(false);
//   const [submitError, setSubmitError] = useState("");

//   useEffect(() => {
//     if (activeTask) { setStep("task"); setSubmitError(""); }
//   }, [activeTask]);

//   if (!activeTask) return null;

//   const catKey  = (activeTask.platform || "").toLowerCase();
//   const catMeta = CATEGORY_HEADER[catKey] || { color: C.orange, bg: "#fff8f0", label: "Task", icon: "📋" };

//   const handleClose    = () => setActiveTask(null);
//   const handleVerified = () => setStep("screenshot");
//   const handlePTCCancel = () => setActiveTask(null);

//   // Lucky draw - no screenshot needed for losses
//   const handleLuckyVerified = () => setStep("screenshot");

//   const handleSubmit = async (screenshotData) => {
//     setSubmitting(true); setSubmitError("");
//     const result = await submitTask(activeTask._id || activeTask.id, screenshotData);
//     setSubmitting(false);
//     if (result.success) setStep("success");
//     else setSubmitError(result.error || "Submission failed.");
//   };

//   const stepLabel = { task: catMeta.label, screenshot: "Upload Proof", success: "Submitted!" }[step];

//   return (
//     <div
//       style={{ position: "fixed", inset: 0, background: "rgba(10,10,10,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}
//       onClick={(e) => e.target === e.currentTarget && step !== "task" && handleClose()}
//     >
//       <div style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 500, boxShadow: "0 32px 80px rgba(0,0,0,0.28)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

//         {/* Header */}
//         <div style={{ background: C.black, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{ width: 34, height: 34, borderRadius: 10, background: catMeta.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
//               {catMeta.icon}
//             </div>
//             <div>
//               <p style={{ color: catMeta.color, fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>{stepLabel}</p>
//               <p style={{ color: "#fff", fontWeight: 800, fontSize: 16, marginTop: 1 }}>{activeTask.title}</p>
//             </div>
//           </div>
//           {step !== "task" || catKey !== "ptc" ? (
//             <button onClick={handleClose} style={{ color: "#aaa", background: "#2a2a2a", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
//           ) : (
//             <div style={{ color: "#555", fontSize: 11 }}>stay on tab</div>
//           )}
//         </div>

//         {/* Reward bar */}
//         {step === "task" && (
//           <div style={{ background: C.orangeGlow, borderBottom: "1px solid rgba(255,107,0,0.2)", padding: "8px 22px", display: "flex", gap: 20, flexShrink: 0 }}>
//             <span style={{ color: C.orange, fontWeight: 700, fontSize: 13 }}>🎁 {activeTask.reward} TKN</span>
//             {activeTask.timeMinutes > 0 && (
//               <span style={{ color: C.textGray, fontSize: 13 }}>
//                 ⏱ {catKey === "ptc" ? `${activeTask.timeMinutes}s` : `${activeTask.timeMinutes} min`}
//               </span>
//             )}
//           </div>
//         )}

//         {/* Body */}
//         <div style={{ padding: 22, overflowY: "auto", flex: 1 }}>
//           {step === "success" && <SubmittedSuccess onClose={handleClose} />}

//           {step === "screenshot" && (
//             <>
//               <ScreenshotUpload onSubmit={handleSubmit} submitting={submitting} />
//               {submitError && <p style={{ color: "#ef4444", fontSize: 13, fontWeight: 600, textAlign: "center", marginTop: 8 }}>{submitError}</p>}
//             </>
//           )}

//           {step === "task" && catKey === "ptc" && (
//             <PTCTask task={activeTask} onVerified={handleVerified} onForcedCancel={handlePTCCancel} />
//           )}
//           {step === "task" && catKey === "captcha" && (
//             <CaptchaTask onVerified={handleVerified} />
//           )}
//           {step === "task" && catKey === "lucky-draw" && (
//             <LuckyDrawTask onVerified={handleLuckyVerified} />
//           )}
//           {step === "task" && catKey === "short-link" && (
//             <ShortLinkTask task={activeTask} onVerified={handleVerified} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ActiveTask;