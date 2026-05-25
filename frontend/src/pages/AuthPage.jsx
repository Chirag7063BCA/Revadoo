// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGoogleLogin } from '@react-oauth/google';
 
// const ORANGE = "#FF6B00";
// const ORANGE_LIGHT = "#FF8C00";
 
// const floatingParticles = Array.from({ length: 18 }, (_, i) => ({
//   id: i,
//   left: `${Math.random() * 100}%`,
//   top: `${Math.random() * 100}%`,
//   size: `${4 + Math.random() * 6}px`,
//   delay: `${Math.random() * 4}s`,
//   duration: `${3 + Math.random() * 4}s`,
// }));
 
// export default function AuthPage() {
//   const navigate = useNavigate();
//   const [mode, setMode] = useState("login");
//   const [forgotStep, setForgotStep] = useState(1);
//   const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "", referral: "", otp: "" });
//   const [focused, setFocused] = useState(null);
//   const [shake, setShake] = useState(false);
//   const [successPulse, setSuccessPulse] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");

//   const handleGoogleSuccess = async (tokenResponse) => {
//     setErrorMsg("");
//     setSuccessMsg("");
//     setLoading(true);
//     try {
//       const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
//         headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
//       });
//       const userInfo = await userInfoRes.json();

//       if (!userInfo.email) {
//         throw new Error("No email returned from Google");
//       }

//       const response = await fetch("http://localhost:5000/api/auth/google", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           email: userInfo.email, 
//           name: userInfo.name 
//         }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         setErrorMsg(data.message || "Google login failed on backend");
//         setShake(true);
//         setTimeout(() => setShake(false), 500);
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setSuccessPulse(true);
//       setSuccessMsg("Google Login Successful! 🎉");
      
//       if (data.generatedPassword) {
//         alert(`Account created! Your auto-generated password is: ${data.generatedPassword}\nYou can use this to login with email later.`);
//       }

//       setTimeout(() => { navigate("/dashboard"); }, 1000);
//     } catch (err) {
//       console.error("Google login error:", err);
//       setErrorMsg("Failed to authenticate with Google.");
//       setShake(true);
//       setTimeout(() => setShake(false), 500);
//       setLoading(false);
//     }
//   };

//   const loginWithGoogle = useGoogleLogin({
//     onSuccess: handleGoogleSuccess,
//     onError: (error) => {
//       console.error('Google Login Failed:', error);
//       setErrorMsg("Google login popup failed/closed.");
//     }
//   });
 
//   const handleSubmit = async () => {
//     setErrorMsg("");
//     setSuccessMsg("");
//     setLoading(true);
//     try {


//       const url = mode === "login"
//         ? "http://localhost:5000/api/auth/login"
//         : "http://localhost:5000/api/auth/register";



//       const body = mode === "login"
//         ? { email: form.email, password: form.password }
//         : { username: form.username, email: form.email, password: form.password, confirm: form.confirm, referral: form.referral };



//       const response = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });



//       const data = await response.json();
//       if (!response.ok) {
//         setErrorMsg(data.message || "Something went wrong");
//         setShake(true);
//         setTimeout(() => setShake(false), 500);
//         setLoading(false);
//         return;
//       }



//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setSuccessPulse(true);
//       setSuccessMsg(
//         mode === "login"
//           ? `Welcome back, ${data.user.username}! 🎉`
//           : `Account created! You have ${data.user.creds} free creds 🎉`
//       );

//       setTimeout(() => { navigate("/dashboard"); }, 1000);
//     } 
//     catch (err) {
//       console.error("Error:", err);
//       setErrorMsg("Cannot connect to server. Make sure your backend is running on port 5000.");
//       setShake(true);
//       setTimeout(() => setShake(false), 500);
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = async () => {
//     setErrorMsg("");
//     setSuccessMsg("");
//     setLoading(true);
//     try {
//       if (forgotStep === 1) {
//         const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
//           method: "POST", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: form.email }),
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message);
//         setSuccessMsg("OTP sent to your email!");
//         setForgotStep(2);
//       } else if (forgotStep === 2) {
//         const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
//           method: "POST", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: form.email, otp: form.otp }),
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message);
//         setSuccessMsg("OTP Verified! Please enter a new password.");
//         setForgotStep(3);
//       } else if (forgotStep === 3) {
//         if (form.password !== form.confirm) throw new Error("Passwords do not match");
//         const response = await fetch("http://localhost:5000/api/auth/reset-password", {
//           method: "POST", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: form.email, otp: form.otp, newPassword: form.password }),
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message);
//         setSuccessMsg("Password reset successfully! Please log in.");
//         setTimeout(() => {
//           setMode("login");
//           setForgotStep(1);
//           setForm(f => ({ ...f, password: "", confirm: "", otp: "" }));
//           setSuccessMsg("");
//         }, 2000);
//       }
//     } catch (err) {
//       setErrorMsg(err.message || "Something went wrong");
//       setShake(true);
//       setTimeout(() => setShake(false), 500);
//     }
//     setLoading(false);
//   };
 

//   return (
//     <div style={{
//       minHeight: "100vh", background: "#faf8f5",
//       fontFamily: "'Barlow Condensed', sans-serif",
//       display: "flex", alignItems: "flex-start", justifyContent: "center",
//       position: "relative", overflow: "hidden",
//     }}>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         @keyframes floatUp {
//           0% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
//           50% { opacity: 0.7; }
//           100% { transform: translateY(-60px) rotate(180deg); opacity: 0; }
//         }
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           20% { transform: translateX(-6px); }
//           40% { transform: translateX(6px); }
//           60% { transform: translateX(-4px); }
//           80% { transform: translateX(4px); }
//         }
//         @keyframes slideIn {
//           from { opacity: 0; transform: translateY(24px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes glow {
//           0%, 100% { box-shadow: 0 0 0px 0px rgba(255,107,0,0.0); }
//           50% { box-shadow: 0 0 18px 4px rgba(255,107,0,0.35); }
//         }
//         @keyframes lineExpand { from { width: 0; } to { width: 100%; } }
//         @keyframes spinLoader { to { transform: rotate(360deg); } }
 
//         .particle {
//           position: absolute; background: ${ORANGE}; border-radius: 2px;
//           animation: floatUp var(--dur) var(--delay) infinite ease-in-out;
//           pointer-events: none;
//         }
//         .input-field {
//           width: 100%; background: #fff; border: 2px solid #e8e0d8;
//           border-radius: 10px; padding: 14px 18px;
//           font-family: 'Barlow', sans-serif; font-size: 16px; color: #222;
//           outline: none; transition: border-color 0.2s, box-shadow 0.2s;
//           -webkit-appearance: none; appearance: none;
//         }
//         .input-field:focus { border-color: ${ORANGE}; box-shadow: 0 0 0 3px rgba(255,107,0,0.12); }
//         .input-field::placeholder { color: #bbb; }
//         .input-field-referral {
//           width: 100%; background: #fff8f3; border: 2px dashed #ffc299;
//           border-radius: 10px; padding: 14px 18px 14px 44px;
//           font-family: 'Barlow', sans-serif; font-size: 16px; color: #222;
//           outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
//           -webkit-appearance: none; appearance: none;
//         }
//         .input-field-referral:focus { border-color: ${ORANGE}; border-style: solid; background: #fff4eb; box-shadow: 0 0 0 3px rgba(255,107,0,0.12); }
//         .input-field-referral::placeholder { color: #e0b898; }
//         .btn-primary {
//           width: 100%; background: linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_LIGHT} 100%);
//           color: white; border: none; border-radius: 10px; padding: 16px;
//           font-family: 'Barlow Condensed', sans-serif; font-size: 20px;
//           font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;
//           cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
//           position: relative; overflow: hidden; display: flex;
//           align-items: center; justify-content: center; gap: 8px;
//           -webkit-tap-highlight-color: transparent; touch-action: manipulation;
//         }
//         .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,107,0,0.45); }
//         .btn-primary:active:not(:disabled) { transform: translateY(0); }
//         .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
//         .btn-primary::after {
//           content: ''; position: absolute; inset: 0;
//           background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
//           pointer-events: none;
//         }
//         .tab-btn {
//           flex: 1; background: none; border: none; padding: 14px 0;
//           font-family: 'Barlow Condensed', sans-serif; font-size: 18px;
//           font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
//           cursor: pointer; transition: color 0.2s; position: relative;
//           -webkit-tap-highlight-color: transparent; touch-action: manipulation;
//         }
//         .success-pulse { animation: glow 0.8s ease-out; }
//         .shake-anim { animation: shake 0.45s ease; }
//         .card-animate { animation: slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
//         .social-btn {
//           flex: 1; background: #fff; border: 2px solid #e8e0d8; border-radius: 10px;
//           padding: 11px 8px; font-family: 'Barlow', sans-serif; font-size: 13px;
//           font-weight: 600; color: #444; cursor: pointer; display: flex;
//           align-items: center; justify-content: center; gap: 8px;
//           transition: border-color 0.2s, background 0.2s;
//           -webkit-tap-highlight-color: transparent; touch-action: manipulation; min-height: 44px;
//         }
//         .social-btn:hover { border-color: ${ORANGE}; background: #fff8f3; }
//         .social-btn:active { background: #fff0e8; border-color: ${ORANGE}; }
//         .geo-circle {
//           position: absolute; border-radius: 50%;
//           border: 1.5px solid rgba(255,107,0,0.12); pointer-events: none;
//         }
//         .loader {
//           width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4);
//           border-top-color: #fff; border-radius: 50%;
//           animation: spinLoader 0.6s linear infinite; flex-shrink: 0;
//         }
 
//         .page-layout {
//           display: flex;
//           align-items: flex-start;
//           justify-content: center;
//           width: 100%;
//           position: relative;
//           z-index: 3;
//           padding: 48px 24px 40px;
//         }
 
//         .branding-panel {
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           padding: 60px 52px;
//           max-width: 420px;
//           flex: 1;
//         }
 
//         .auth-card-wrap {
//           width: 100%;
//           max-width: 420px;
//           flex-shrink: 0;
//         }
 
//         .card-body { padding: 36px 36px 32px; }
 
//         .mobile-logo { display: none; }
//         .mobile-bottom-branding { display: none; }
 
//         @media (max-width: 900px) {
//           .branding-panel { display: none; }
 
//           .page-layout {
//             flex-direction: column;
//             align-items: center;
//             justify-content: flex-start;
//             padding: 28px 16px 48px;
//             min-height: 100vh;
//           }
 
//           .mobile-logo {
//             display: block;
//             text-align: center;
//             width: 100%;
//             max-width: 480px;
//             margin-bottom: 18px;
//           }
 
//           .auth-card-wrap {
//             max-width: 480px;
//             width: 100%;
//           }
 
//           .mobile-bottom-branding {
//             display: block;
//             width: 100%;
//             max-width: 480px;
//             margin-top: 24px;
//           }
//         }
 
//         @media (max-width: 480px) {
//           .page-layout { padding: 20px 14px 48px; }
//           .card-body { padding: 22px 18px 20px; }
//           .tab-btn { font-size: 16px; padding: 12px 0; }
//           .btn-primary { font-size: 17px; padding: 15px; }
//         }
 
//         @media (max-width: 360px) {
//           .card-body { padding: 18px 13px 16px; }
//           .page-layout { padding: 16px 10px 40px; }
//         }
//       `}</style>
 
//       {/* Background decorations */}
//       <div className="geo-circle" style={{ width: 600, height: 600, top: -200, right: -200 }} />
//       <div className="geo-circle" style={{ width: 400, height: 400, top: -100, right: -100 }} />
//       <div className="geo-circle" style={{ width: 800, height: 800, bottom: -300, left: -300 }} />
//       <div className="geo-circle" style={{ width: 500, height: 500, bottom: -150, left: -150 }} />
//       {floatingParticles.map(p => (
//         <div key={p.id} className="particle" style={{
//           left: p.left, top: p.top, width: p.size, height: p.size,
//           "--dur": p.duration, "--delay": p.delay,
//         }} />
//       ))}
//       <div style={{
//         position: "absolute", inset: 0,
//         backgroundImage: "radial-gradient(circle, rgba(255,107,0,0.12) 1px, transparent 1px)",
//         backgroundSize: "32px 32px", pointerEvents: "none",
//       }} />
 
//       <div className="page-layout">
 
//         {/* ── Desktop left branding panel ── */}
//         <div className="branding-panel">
//           <div style={{ marginBottom: 40 }}>
//             <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 36, letterSpacing: 2, color: "#111" }}>
//               REVA<span style={{ color: ORANGE }}>DOO</span>
//             </span>
//           </div>
//           <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 68, lineHeight: 1, color: "#111", letterSpacing: -1, marginBottom: 16 }}>
//             <div style={{ color: ORANGE }}>GET PAID</div>
//             <div>& GET</div>
//             <div>REWARDED</div>
//           </div>
//           <div style={{ width: 80, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${ORANGE}, transparent)`, marginBottom: 28 }} />
//           <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: "#666", lineHeight: 1.6, marginBottom: 40 }}>
//             REVADOO turns your everyday time into tangible gains. Browse hundreds of tasks across surveys, games, creative challenges, and more — then convert your Creds into real gift cards, cash, and premium rewards.
//           </p>
//           <div style={{ display: "flex", gap: 32 }}>
//             {[{ val: "2.4M+", label: "Active Users" }, { val: "500+", label: "Daily Tasks" }, { val: "$25", label: "Top Reward" }].map(s => (
//               <div key={s.label}>
//                 <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 28, color: ORANGE }}>{s.val}</div>
//                 <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#999", fontWeight: 500 }}>{s.label}</div>
//               </div>
//             ))}
//           </div>
//           <div style={{ marginTop: 48, background: "#fff", borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #f0e8e0", maxWidth: 280 }}>
//             <div style={{ width: 42, height: 42, borderRadius: 10, background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>⚡</div>
//             <div>
//               <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: ORANGE }}>+250 CREDS</div>
//               <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#999" }}>Just Click & earned!</div>
//             </div>
//           </div>
//           <div style={{ marginTop: 16, background: "#fff", borderRadius: 14, padding: "14px 20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #f0e8e0", maxWidth: 280 }}>
//             <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Daily Tasks</div>
//             <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
//               {[true, true, true, false, false, false, false].map((done, i) => (
//                 <div key={i} style={{ width: 26, height: 26, borderRadius: 6, background: done ? ORANGE : "#f5f0ea", border: done ? "none" : "1px solid #e8e0d8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: done ? "#fff" : "#ddd" }}>{done ? "✓" : ""}</div>
//               ))}
//             </div>
//             <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#999" }}>7 Day Login Rewards</div>
//           </div>
//         </div>
 
//         {/* ── Auth card column ── */}
//         <div className="auth-card-wrap">
 
//           {/* Mobile logo */}
//           <div className="mobile-logo">
//             <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 34, letterSpacing: 2, color: "#111" }}>
//               REVA<span style={{ color: ORANGE }}>DOO</span>
//             </span>
//             <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#888", marginTop: 4 }}>
//               Turn your time into real rewards 🎯
//             </p>
//           </div>
 
//           {/* Auth card */}
//           <div
//             className={`card-animate ${shake ? "shake-anim" : ""} ${successPulse ? "success-pulse" : ""}`}
//             style={{ background: "#fff", borderRadius: 20, boxShadow: "0 24px 64px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,107,0,0.08)", overflow: "hidden" }}
//           >
//             <div style={{ display: "flex", borderBottom: "2px solid #f0e8e0" }}>
//               {["login", "register"].map(tab => (
//                 <button key={tab} className="tab-btn"
//                   onClick={() => { setMode(tab); setErrorMsg(""); setSuccessMsg(""); }}
//                   style={{ color: mode === tab ? ORANGE : "#bbb" }}
//                 >
//                   {tab === "login" ? "Sign In" : "Register"}
//                   {mode === tab && (
//                     <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: 3, background: ORANGE, borderRadius: "2px 2px 0 0", animation: "lineExpand 0.3s ease" }} />
//                   )}
//                 </button>
//               ))}
//             </div>
 
//             <div className="card-body">
//               <div style={{ marginBottom: 24 }}>
//                 <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 32, color: "#111", letterSpacing: 0.5, marginBottom: 6 }}>
//                   {mode === "login" ? "Welcome Back" : mode === "forgot-password" ? "Reset Password" : "Start Earning Today"}
//                 </h2>
//                 <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "#999" }}>
//                   {mode === "login" ? "Sign in to your REVADOO account" : mode === "forgot-password" ? "Securely recover your account in seconds" : "Create your free account and get 250 creds"}
//                 </p>
//               </div>
 
//               {errorMsg && (
//                 <div style={{ background: "#fff0f0", border: "1.5px solid #ffcccc", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#cc0000", wordBreak: "break-word" }}>
//                   ❌ {errorMsg}
//                 </div>
//               )}
//               {successMsg && (
//                 <div style={{ background: "#f0fff4", border: "1.5px solid #b2f5c8", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#1a7f3c" }}>
//                   ✅ {successMsg} Redirecting to dashboard...
//                 </div>
//               )}
 
//               {mode !== "forgot-password" && (
//                 <>
//                   <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
//                     <button className="social-btn" onClick={() => loginWithGoogle()} type="button" disabled={loading}>
//                       <svg width="16" height="16" viewBox="0 0 24 24">
//                         <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                         <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                         <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                         <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                       </svg>
//                       Google
//                     </button>
//                     <button className="social-btn">
//                       <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
//                         <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                       </svg>
//                       Facebook
//                     </button>
//                   </div>
    
//                   <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
//                     <div style={{ flex: 1, height: 1, background: "#f0e8e0" }} />
//                     <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#ccc", whiteSpace: "nowrap" }}>or continue with email</span>
//                     <div style={{ flex: 1, height: 1, background: "#f0e8e0" }} />
//                   </div>
//                 </>
//               )}
 
//               <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//                 {mode === "register" && (
//                   <div>
//                     <label style={{ display: "block", marginBottom: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.5, color: "#888", textTransform: "uppercase" }}>Username</label>
//                     <input className="input-field" placeholder="Choose a username" value={form.username}
//                       onFocus={() => setFocused("username")} onBlur={() => setFocused(null)}
//                       onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
//                   </div>
//                 )}
                
//                 {(mode === "login" || mode === "register" || mode === "forgot-password") && (
//                   <div>
//                     <label style={{ display: "block", marginBottom: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.5, color: "#888", textTransform: "uppercase" }}>Email</label>
//                     <input className="input-field" type="email" placeholder="your@email.com" value={form.email}
//                       disabled={mode === "forgot-password" && forgotStep > 1}
//                       style={{ opacity: (mode === "forgot-password" && forgotStep > 1) ? 0.6 : 1 }}
//                       onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
//                       onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
//                   </div>
//                 )}

//                 {mode === "forgot-password" && forgotStep >= 2 && (
//                   <div className="card-animate">
//                     <label style={{ display: "block", marginBottom: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.5, color: "#888", textTransform: "uppercase" }}>6-Digit OTP</label>
//                     <input className="input-field" type="text" placeholder="123456" value={form.otp} maxLength={6}
//                       disabled={forgotStep > 2}
//                       style={{ opacity: forgotStep > 2 ? 0.6 : 1, fontSize: 24, letterSpacing: 12, textAlign: "center", fontWeight: "bold", fontFamily: "monospace" }}
//                       onFocus={() => setFocused("otp")} onBlur={() => setFocused(null)}
//                       onChange={e => setForm(f => ({ ...f, otp: e.target.value }))} />
//                   </div>
//                 )}

//                 {(mode === "login" || mode === "register" || (mode === "forgot-password" && forgotStep === 3)) && (
//                   <div className={mode === "forgot-password" ? "card-animate" : ""}>
//                     <label style={{ display: "block", marginBottom: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.5, color: "#888", textTransform: "uppercase" }}>
//                       {mode === "forgot-password" ? "New Password" : "Password"}
//                     </label>
//                     <input className="input-field" type="password" placeholder="••••••••" value={form.password}
//                       onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
//                       onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
//                   </div>
//                 )}
                
//                 {(mode === "register" || (mode === "forgot-password" && forgotStep === 3)) && (
//                   <div className={mode === "forgot-password" ? "card-animate" : ""}>
//                     <label style={{ display: "block", marginBottom: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.5, color: "#888", textTransform: "uppercase" }}>Confirm Password</label>
//                     <input className="input-field" type="password" placeholder="••••••••" value={form.confirm}
//                       onFocus={() => setFocused("confirm")} onBlur={() => setFocused(null)}
//                       onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
//                   </div>
//                 )}
 
//                 {/* ── Referral Code Field (Register only) ── */}
//                 {mode === "register" && (
//                   <div>
//                     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
//                       <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.5, color: "#888", textTransform: "uppercase" }}>
//                         Referral Code
//                       </label>
//                       <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "#e0956a", background: "#fff4eb", border: "1px dashed #ffc299", borderRadius: 5, padding: "2px 8px", fontWeight: 600 }}>
//                         Optional
//                       </span>
//                     </div>
//                     <div style={{ position: "relative" }}>
//                       <input
//                         className="input-field-referral"
//                         placeholder="Enter a friend's referral code"
//                         value={form.referral}
//                         onFocus={() => setFocused("referral")}
//                         onBlur={() => setFocused(null)}
//                         onChange={e => setForm(f => ({ ...f, referral: e.target.value }))}
//                       />
//                       <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none", lineHeight: 1 }}>🎁</span>
//                     </div>
//                     <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#c4956a", marginTop: 5 }}>
//                       Have a friend's code? Both of you earn bonus creds!
//                     </p>
//                   </div>
//                 )}
 
//                 {mode === "login" && (
//                   <div style={{ textAlign: "right", marginTop: -6 }}>
//                     <button type="button" 
//                       onClick={() => { setMode("forgot-password"); setForgotStep(1); setErrorMsg(""); setSuccessMsg(""); }} 
//                       style={{ background: "none", border: "none", fontFamily: "'Barlow', sans-serif", fontSize: 13, color: ORANGE, cursor: "pointer", fontWeight: 600 }}>
//                       Forgot password?
//                     </button>
//                   </div>
//                 )}
//               </div>
 
//               <div style={{ marginTop: 24 }}>
//                 <button className="btn-primary" onClick={mode === "forgot-password" ? handleForgotPassword : handleSubmit} disabled={loading}>
//                   {loading && <span className="loader" />}
//                   {loading ? "Please wait..." : 
//                    mode === "forgot-password" ? (forgotStep === 1 ? "Send Reset Link" : forgotStep === 2 ? "Verify OTP" : "Reset Password") :
//                    mode === "login" ? "Sign In" : "Create Account & Earn"}
//                 </button>
//               </div>
 
//               {mode === "register" && (
//                 <div style={{ marginTop: 16, background: "#fff8f3", border: `1.5px dashed ${ORANGE}`, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
//                   <span style={{ fontSize: 18, flexShrink: 0 }}>🎁</span>
//                   <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#555" }}>
//                     <strong style={{ color: ORANGE }}>+250 FREE CREDS</strong> added to your account on signup
//                   </span>
//                 </div>
//               )}
 
//               {mode === "forgot-password" ? (
//                 <p style={{ marginTop: 20, textAlign: "center", fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "#999" }}>
//                   Remember your password?{" "}
//                   <button
//                     onClick={() => { setMode("login"); setErrorMsg(""); setSuccessMsg(""); }}
//                     style={{ background: "none", border: "none", color: ORANGE, fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow', sans-serif", fontSize: 14, textDecoration: "underline", WebkitTapHighlightColor: "transparent" }}
//                   >
//                     Back to Sign In
//                   </button>
//                 </p>
//               ) : (
//                 <p style={{ marginTop: 20, textAlign: "center", fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "#999" }}>
//                   {mode === "login" ? "New here? " : "Already have an account? "}
//                   <button
//                     onClick={() => { setMode(mode === "login" ? "register" : "login"); setErrorMsg(""); setSuccessMsg(""); }}
//                     style={{ background: "none", border: "none", color: ORANGE, fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow', sans-serif", fontSize: 14, textDecoration: "underline", WebkitTapHighlightColor: "transparent" }}
//                   >
//                     {mode === "login" ? "Create account →" : "Sign in →"}
//                   </button>
//                 </p>
//               )}
//             </div>
//           </div>
 
//           <p style={{ textAlign: "center", marginTop: 14, fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#bbb" }}>
//             🔒 Secure login · No spam · Cancel anytime
//           </p>
 
//           {/* Mobile bottom branding */}
//           <div className="mobile-bottom-branding">
//             <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 0 22px" }}>
//               <div style={{ flex: 1, height: 1, background: "#e8e0d8" }} />
//               <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: "#ccc", textTransform: "uppercase", letterSpacing: 1.5, whiteSpace: "nowrap" }}>Why REVADOO?</span>
//               <div style={{ flex: 1, height: 1, background: "#e8e0d8" }} />
//             </div>
 
//             <div style={{ textAlign: "center", marginBottom: 16 }}>
//               <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 44, lineHeight: 1, color: "#111", letterSpacing: -0.5 }}>
//                 <span style={{ color: ORANGE }}>GET PAID</span><br />&amp; GET REWARDED
//               </div>
//               <div style={{ width: 56, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${ORANGE}, transparent)`, margin: "10px auto 0" }} />
//             </div>
 
//             <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "#666", lineHeight: 1.6, textAlign: "center", marginBottom: 20 }}>
//               Browse surveys, games, creative challenges and more — convert your Creds into real gift cards, cash, and premium rewards.
//             </p>
 
//             <div style={{ display: "flex", marginBottom: 16, background: "#fff", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1px solid #f0e8e0", overflow: "hidden" }}>
//               {[{ val: "2.4M+", label: "Active Users" }, { val: "500+", label: "Daily Tasks" }, { val: "$25", label: "Top Reward" }].map((s, i) => (
//                 <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "16px 8px", borderRight: i < 2 ? "1px solid #f0e8e0" : "none" }}>
//                   <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, color: ORANGE }}>{s.val}</div>
//                   <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "#999", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
//                 </div>
//               ))}
//             </div>
 
//             <div style={{ background: "#fff", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1px solid #f0e8e0", marginBottom: 12 }}>
//               <div style={{ width: 42, height: 42, borderRadius: 10, background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>⚡</div>
//               <div>
//                 <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: ORANGE }}>+250 CREDS</div>
//                 <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#999" }}>Just Click &amp; Earn!</div>
//               </div>
//             </div>
 
//             <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #f0e8e0" }}>
//               <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Daily Tasks</div>
//               <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
//                 {[true, true, true, false, false, false, false].map((done, i) => (
//                   <div key={i} style={{ flex: 1, aspectRatio: "1", borderRadius: 8, background: done ? ORANGE : "#f5f0ea", border: done ? "none" : "1px solid #e8e0d8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: done ? "#fff" : "#ddd" }}>{done ? "✓" : ""}</div>
//                 ))}
//               </div>
//               <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#999" }}>7 Day Login Rewards</div>
//             </div>
//           </div>
 
//         </div>
//       </div>
//     </div>
//   );
// }
 







import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
 
const ORANGE = "#FF6B00";
const ORANGE_LIGHT = "#FF8C00";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const apiUrl = (path) => `${API_BASE_URL}/api${path}`;
 
const floatingParticles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: `${4 + Math.random() * 6}px`,
  delay: `${Math.random() * 4}s`,
  duration: `${3 + Math.random() * 4}s`,
}));
 
export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [forgotStep, setForgotStep] = useState(1);
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "", referral: "", otp: "" });
  const [focused, setFocused] = useState(null);
  const [shake, setShake] = useState(false);
  const [successPulse, setSuccessPulse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Force clear session whenever loading AuthPage
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userAvatar");
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const credential = credentialResponse?.credential;
      if (!credential) {
        throw new Error("No Google credential returned");
      }

      const response = await fetch(apiUrl("/auth/google"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.message || "Google login failed on backend");
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.avatar) {
        localStorage.setItem("userAvatar", data.user.avatar);
      }
      setSuccessPulse(true);
      setSuccessMsg("Google Login Successful! 🎉");
      
      if (data.generatedPassword) {
        alert(`Account created! Your auto-generated password is: ${data.generatedPassword}\nYou can use this to login with email later.`);
      }

      setTimeout(() => { navigate("/dashboard"); }, 1000);
    } catch (err) {
      console.error("Google login error:", err);
      setErrorMsg("Failed to authenticate with Google. Please ensure backend API is running.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setLoading(false);
    }
  };
 
  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    try {


      const url = mode === "login"
        ? apiUrl("/auth/login")
        : apiUrl("/auth/register");



      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : { username: form.username, email: form.email, password: form.password, confirm: form.confirm, referral: form.referral };



      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });



      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.message || "Something went wrong");
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setLoading(false);
        return;
      }



      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccessPulse(true);
      setSuccessMsg(
        mode === "login"
          ? `Welcome back, ${data.user.username}! 🎉`
          : `Account created! You have ${data.user.creds} free creds 🎉`
      );

      setTimeout(() => { navigate("/dashboard"); }, 1000);
    } 
    catch (err) {
      console.error("Error:", err);
      setErrorMsg("Cannot connect to server. Start backend and verify API URL/proxy settings.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    try {
      if (forgotStep === 1) {
        const response = await fetch(apiUrl("/auth/forgot-password"), {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setSuccessMsg("OTP sent to your email!");
        setForgotStep(2);
      } else if (forgotStep === 2) {
        const response = await fetch(apiUrl("/auth/verify-otp"), {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, otp: form.otp }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setSuccessMsg("OTP Verified! Please enter a new password.");
        setForgotStep(3);
      } else if (forgotStep === 3) {
        if (form.password !== form.confirm) throw new Error("Passwords do not match");
        const response = await fetch(apiUrl("/auth/reset-password"), {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, otp: form.otp, newPassword: form.password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setSuccessMsg("Password reset successfully! Please log in.");
        setTimeout(() => {
          setMode("login");
          setForgotStep(1);
          setForm(f => ({ ...f, password: "", confirm: "", otp: "" }));
          setSuccessMsg("");
        }, 2000);
      }
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setLoading(false);
  };
 

  return (
    <div style={{
      minHeight: "100vh", background: "#faf8f5",
      fontFamily: "'Barlow Condensed', sans-serif",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes floatUp {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { opacity: 0.7; }
          100% { transform: translateY(-60px) rotate(180deg); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 0px 0px rgba(255,107,0,0.0); }
          50% { box-shadow: 0 0 18px 4px rgba(255,107,0,0.35); }
        }
        @keyframes lineExpand { from { width: 0; } to { width: 100%; } }
        @keyframes spinLoader { to { transform: rotate(360deg); } }
 
        .particle {
          position: absolute; background: ${ORANGE}; border-radius: 2px;
          animation: floatUp var(--dur) var(--delay) infinite ease-in-out;
          pointer-events: none;
        }
        .input-field {
          width: 100%; background: #fff; border: 2px solid #e8e0d8;
          border-radius: 10px; padding: 14px 18px;
          font-family: 'Barlow', sans-serif; font-size: 16px; color: #222;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none; appearance: none;
        }
        .input-field:focus { border-color: ${ORANGE}; box-shadow: 0 0 0 3px rgba(255,107,0,0.12); }
        .input-field::placeholder { color: #bbb; }
        .input-field-referral {
          width: 100%; background: #fff8f3; border: 2px dashed #ffc299;
          border-radius: 10px; padding: 14px 18px 14px 44px;
          font-family: 'Barlow', sans-serif; font-size: 16px; color: #222;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          -webkit-appearance: none; appearance: none;
        }
        .input-field-referral:focus { border-color: ${ORANGE}; border-style: solid; background: #fff4eb; box-shadow: 0 0 0 3px rgba(255,107,0,0.12); }
        .input-field-referral::placeholder { color: #e0b898; }
        .btn-primary {
          width: 100%; background: linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_LIGHT} 100%);
          color: white; border: none; border-radius: 10px; padding: 16px;
          font-family: 'Barlow Condensed', sans-serif; font-size: 20px;
          font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;
          cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
          position: relative; overflow: hidden; display: flex;
          align-items: center; justify-content: center; gap: 8px;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
        }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,107,0,0.45); }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-primary::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .tab-btn {
          flex: 1; background: none; border: none; padding: 14px 0;
          font-family: 'Barlow Condensed', sans-serif; font-size: 18px;
          font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
          cursor: pointer; transition: color 0.2s; position: relative;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
        }
        .success-pulse { animation: glow 0.8s ease-out; }
        .shake-anim { animation: shake 0.45s ease; }
        .card-animate { animation: slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .social-btn {
          flex: 1; background: #fff; border: 2px solid #e8e0d8; border-radius: 10px;
          padding: 11px 8px; font-family: 'Barlow', sans-serif; font-size: 13px;
          font-weight: 600; color: #444; cursor: pointer; display: flex;
          align-items: center; justify-content: center; gap: 8px;
          transition: border-color 0.2s, background 0.2s;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation; min-height: 44px;
        }
        .social-btn:hover { border-color: ${ORANGE}; background: #fff8f3; }
        .social-btn:active { background: #fff0e8; border-color: ${ORANGE}; }
        .geo-circle {
          position: absolute; border-radius: 50%;
          border: 1.5px solid rgba(255,107,0,0.12); pointer-events: none;
        }
        .loader {
          width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff; border-radius: 50%;
          animation: spinLoader 0.6s linear infinite; flex-shrink: 0;
        }
 
        .page-layout {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          width: 100%;
          position: relative;
          z-index: 3;
          padding: 48px 24px 40px;
        }
 
        .branding-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 52px;
          max-width: 420px;
          flex: 1;
        }
 
        .auth-card-wrap {
          width: 100%;
          max-width: 420px;
          flex-shrink: 0;
        }
 
        .card-body { padding: 36px 36px 32px; }
 
        .mobile-logo { display: none; }
        .mobile-bottom-branding { display: none; }
 
        @media (max-width: 900px) {
          .branding-panel { display: none; }
 
          .page-layout {
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 28px 16px 48px;
            min-height: 100vh;
          }
 
          .mobile-logo {
            display: block;
            text-align: center;
            width: 100%;
            max-width: 480px;
            margin-bottom: 18px;
          }
 
          .auth-card-wrap {
            max-width: 480px;
            width: 100%;
          }
 
          .mobile-bottom-branding {
            display: block;
            width: 100%;
            max-width: 480px;
            margin-top: 24px;
          }
        }
 
        @media (max-width: 480px) {
          .page-layout { padding: 20px 14px 48px; }
          .card-body { padding: 22px 18px 20px; }
          .tab-btn { font-size: 16px; padding: 12px 0; }
          .btn-primary { font-size: 17px; padding: 15px; }
        }
 
        @media (max-width: 360px) {
          .card-body { padding: 18px 13px 16px; }
          .page-layout { padding: 16px 10px 40px; }
        }
      `}</style>
 
      {/* Background decorations */}
      <div className="geo-circle" style={{ width: 600, height: 600, top: -200, right: -200 }} />
      <div className="geo-circle" style={{ width: 400, height: 400, top: -100, right: -100 }} />
      <div className="geo-circle" style={{ width: 800, height: 800, bottom: -300, left: -300 }} />
      <div className="geo-circle" style={{ width: 500, height: 500, bottom: -150, left: -150 }} />
      {floatingParticles.map(p => (
        <div key={p.id} className="particle" style={{
          left: p.left, top: p.top, width: p.size, height: p.size,
          "--dur": p.duration, "--delay": p.delay,
        }} />
      ))}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,107,0,0.12) 1px, transparent 1px)",
        backgroundSize: "32px 32px", pointerEvents: "none",
      }} />
 
      <div className="page-layout">
 
        {/* ── Desktop left branding panel ── */}
        <div className="branding-panel">
          <div style={{ marginBottom: 40 }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 36, letterSpacing: 2, color: "#111" }}>
              REVA<span style={{ color: ORANGE }}>DOO</span>
            </span>
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 68, lineHeight: 1, color: "#111", letterSpacing: -1, marginBottom: 16 }}>
            <div style={{ color: ORANGE }}>GET PAID</div>
            <div>& GET</div>
            <div>REWARDED</div>
          </div>
          <div style={{ width: 80, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${ORANGE}, transparent)`, marginBottom: 28 }} />
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: "#666", lineHeight: 1.6, marginBottom: 40 }}>
            REVADOO turns your everyday time into tangible gains. Browse hundreds of tasks across surveys, games, creative challenges, and more — then convert your Creds into real gift cards, cash, and premium rewards.
          </p>
          <div style={{ display: "flex", gap: 32 }}>
            {[{ val: "2.4M+", label: "Active Users" }, { val: "500+", label: "Daily Tasks" }, { val: "$25", label: "Top Reward" }].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 28, color: ORANGE }}>{s.val}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#999", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, background: "#fff", borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #f0e8e0", maxWidth: 280 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>⚡</div>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: ORANGE }}>+250 CREDS</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#999" }}>Just Click & earned!</div>
            </div>
          </div>
          <div style={{ marginTop: 16, background: "#fff", borderRadius: 14, padding: "14px 20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #f0e8e0", maxWidth: 280 }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Daily Tasks</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {[true, true, true, false, false, false, false].map((done, i) => (
                <div key={i} style={{ width: 26, height: 26, borderRadius: 6, background: done ? ORANGE : "#f5f0ea", border: done ? "none" : "1px solid #e8e0d8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: done ? "#fff" : "#ddd" }}>{done ? "✓" : ""}</div>
              ))}
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#999" }}>7 Day Login Rewards</div>
          </div>
        </div>
 
        {/* ── Auth card column ── */}
        <div className="auth-card-wrap">
 
          {/* Mobile logo */}
          <div className="mobile-logo">
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 34, letterSpacing: 2, color: "#111" }}>
              REVA<span style={{ color: ORANGE }}>DOO</span>
            </span>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#888", marginTop: 4 }}>
              Turn your time into real rewards 🎯
            </p>
          </div>
 
          {/* Auth card */}
          <div
            className={`card-animate ${shake ? "shake-anim" : ""} ${successPulse ? "success-pulse" : ""}`}
            style={{ background: "#fff", borderRadius: 20, boxShadow: "0 24px 64px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,107,0,0.08)", overflow: "hidden" }}
          >
            <div style={{ display: "flex", borderBottom: "2px solid #f0e8e0" }}>
              {["login", "register"].map(tab => (
                <button key={tab} className="tab-btn"
                  onClick={() => { setMode(tab); setErrorMsg(""); setSuccessMsg(""); }}
                  style={{ color: mode === tab ? ORANGE : "#bbb" }}
                >
                  {tab === "login" ? "Sign In" : "Register"}
                  {mode === tab && (
                    <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: 3, background: ORANGE, borderRadius: "2px 2px 0 0", animation: "lineExpand 0.3s ease" }} />
                  )}
                </button>
              ))}
            </div>
 
            <div className="card-body">
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 32, color: "#111", letterSpacing: 0.5, marginBottom: 6 }}>
                  {mode === "login" ? "Welcome Back" : mode === "forgot-password" ? "Reset Password" : "Start Earning Today"}
                </h2>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "#999" }}>
                  {mode === "login" ? "Sign in to your REVADOO account" : mode === "forgot-password" ? "Securely recover your account in seconds" : "Create your free account and get 250 creds"}
                </p>
              </div>
 
              {errorMsg && (
                <div style={{ background: "#fff0f0", border: "1.5px solid #ffcccc", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#cc0000", wordBreak: "break-word" }}>
                  ❌ {errorMsg}
                </div>
              )}
              {successMsg && (
                <div style={{ background: "#f0fff4", border: "1.5px solid #b2f5c8", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#1a7f3c" }}>
                  ✅ {successMsg} Redirecting to dashboard...
                </div>
              )}
 
              {mode !== "forgot-password" && (
                <>
                  <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setErrorMsg("Google login failed. Please try again.")}
                        theme="outline"
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                        logo_alignment="left"
                      />
                    </div>
                    <button className="social-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                  </div>
    
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ flex: 1, height: 1, background: "#f0e8e0" }} />
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#ccc", whiteSpace: "nowrap" }}>or continue with email</span>
                    <div style={{ flex: 1, height: 1, background: "#f0e8e0" }} />
                  </div>
                </>
              )}
 
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {mode === "register" && (
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.5, color: "#888", textTransform: "uppercase" }}>Username</label>
                    <input className="input-field" placeholder="Choose a username" value={form.username}
                      onFocus={() => setFocused("username")} onBlur={() => setFocused(null)}
                      onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
                  </div>
                )}
                
                {(mode === "login" || mode === "register" || mode === "forgot-password") && (
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.5, color: "#888", textTransform: "uppercase" }}>Email</label>
                    <input className="input-field" type="email" placeholder="your@email.com" value={form.email}
                      disabled={mode === "forgot-password" && forgotStep > 1}
                      style={{ opacity: (mode === "forgot-password" && forgotStep > 1) ? 0.6 : 1 }}
                      onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                )}

                {mode === "forgot-password" && forgotStep >= 2 && (
                  <div className="card-animate">
                    <label style={{ display: "block", marginBottom: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.5, color: "#888", textTransform: "uppercase" }}>6-Digit OTP</label>
                    <input className="input-field" type="text" placeholder="123456" value={form.otp} maxLength={6}
                      disabled={forgotStep > 2}
                      style={{ opacity: forgotStep > 2 ? 0.6 : 1, fontSize: 24, letterSpacing: 12, textAlign: "center", fontWeight: "bold", fontFamily: "monospace" }}
                      onFocus={() => setFocused("otp")} onBlur={() => setFocused(null)}
                      onChange={e => setForm(f => ({ ...f, otp: e.target.value }))} />
                  </div>
                )}

                {(mode === "login" || mode === "register" || (mode === "forgot-password" && forgotStep === 3)) && (
                  <div className={mode === "forgot-password" ? "card-animate" : ""}>
                    <label style={{ display: "block", marginBottom: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.5, color: "#888", textTransform: "uppercase" }}>
                      {mode === "forgot-password" ? "New Password" : "Password"}
                    </label>
                    <input className="input-field" type="password" placeholder="••••••••" value={form.password}
                      onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                  </div>
                )}
                
                {(mode === "register" || (mode === "forgot-password" && forgotStep === 3)) && (
                  <div className={mode === "forgot-password" ? "card-animate" : ""}>
                    <label style={{ display: "block", marginBottom: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.5, color: "#888", textTransform: "uppercase" }}>Confirm Password</label>
                    <input className="input-field" type="password" placeholder="••••••••" value={form.confirm}
                      onFocus={() => setFocused("confirm")} onBlur={() => setFocused(null)}
                      onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
                  </div>
                )}
 
                {/* ── Referral Code Field (Register only) ── */}
                {mode === "register" && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.5, color: "#888", textTransform: "uppercase" }}>
                        Referral Code
                      </label>
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "#e0956a", background: "#fff4eb", border: "1px dashed #ffc299", borderRadius: 5, padding: "2px 8px", fontWeight: 600 }}>
                        Optional
                      </span>
                    </div>
                    <div style={{ position: "relative" }}>
                      <input
                        className="input-field-referral"
                        placeholder="Enter a friend's referral code"
                        value={form.referral}
                        onFocus={() => setFocused("referral")}
                        onBlur={() => setFocused(null)}
                        onChange={e => setForm(f => ({ ...f, referral: e.target.value }))}
                      />
                      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none", lineHeight: 1 }}>🎁</span>
                    </div>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#c4956a", marginTop: 5 }}>
                      Have a friend's code? Both of you earn bonus creds!
                    </p>
                  </div>
                )}
 
                {mode === "login" && (
                  <div style={{ textAlign: "right", marginTop: -6 }}>
                    <button type="button" 
                      onClick={() => { setMode("forgot-password"); setForgotStep(1); setErrorMsg(""); setSuccessMsg(""); }} 
                      style={{ background: "none", border: "none", fontFamily: "'Barlow', sans-serif", fontSize: 13, color: ORANGE, cursor: "pointer", fontWeight: 600 }}>
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
 
              <div style={{ marginTop: 24 }}>
                <button className="btn-primary" onClick={mode === "forgot-password" ? handleForgotPassword : handleSubmit} disabled={loading}>
                  {loading && <span className="loader" />}
                  {loading ? "Please wait..." : 
                   mode === "forgot-password" ? (forgotStep === 1 ? "Send Reset Link" : forgotStep === 2 ? "Verify OTP" : "Reset Password") :
                   mode === "login" ? "Sign In" : "Create Account & Earn"}
                </button>
              </div>
 
              {mode === "register" && (
                <div style={{ marginTop: 16, background: "#fff8f3", border: `1.5px dashed ${ORANGE}`, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>🎁</span>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#555" }}>
                    <strong style={{ color: ORANGE }}>+250 FREE CREDS</strong> added to your account on signup
                  </span>
                </div>
              )}
 
              {mode === "forgot-password" ? (
                <p style={{ marginTop: 20, textAlign: "center", fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "#999" }}>
                  Remember your password?{" "}
                  <button
                    onClick={() => { setMode("login"); setErrorMsg(""); setSuccessMsg(""); }}
                    style={{ background: "none", border: "none", color: ORANGE, fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow', sans-serif", fontSize: 14, textDecoration: "underline", WebkitTapHighlightColor: "transparent" }}
                  >
                    Back to Sign In
                  </button>
                </p>
              ) : (
                <p style={{ marginTop: 20, textAlign: "center", fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "#999" }}>
                  {mode === "login" ? "New here? " : "Already have an account? "}
                  <button
                    onClick={() => { setMode(mode === "login" ? "register" : "login"); setErrorMsg(""); setSuccessMsg(""); }}
                    style={{ background: "none", border: "none", color: ORANGE, fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow', sans-serif", fontSize: 14, textDecoration: "underline", WebkitTapHighlightColor: "transparent" }}
                  >
                    {mode === "login" ? "Create account →" : "Sign in →"}
                  </button>
                </p>
              )}
            </div>
          </div>
 
          <p style={{ textAlign: "center", marginTop: 14, fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#bbb" }}>
            🔒 Secure login · No spam · Cancel anytime
          </p>
 
          {/* Mobile bottom branding */}
          <div className="mobile-bottom-branding">
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 0 22px" }}>
              <div style={{ flex: 1, height: 1, background: "#e8e0d8" }} />
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: "#ccc", textTransform: "uppercase", letterSpacing: 1.5, whiteSpace: "nowrap" }}>Why REVADOO?</span>
              <div style={{ flex: 1, height: 1, background: "#e8e0d8" }} />
            </div>
 
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 44, lineHeight: 1, color: "#111", letterSpacing: -0.5 }}>
                <span style={{ color: ORANGE }}>GET PAID</span><br />&amp; GET REWARDED
              </div>
              <div style={{ width: 56, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${ORANGE}, transparent)`, margin: "10px auto 0" }} />
            </div>
 
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: "#666", lineHeight: 1.6, textAlign: "center", marginBottom: 20 }}>
              Browse surveys, games, creative challenges and more — convert your Creds into real gift cards, cash, and premium rewards.
            </p>
 
            <div style={{ display: "flex", marginBottom: 16, background: "#fff", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1px solid #f0e8e0", overflow: "hidden" }}>
              {[{ val: "2.4M+", label: "Active Users" }, { val: "500+", label: "Daily Tasks" }, { val: "$25", label: "Top Reward" }].map((s, i) => (
                <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "16px 8px", borderRight: i < 2 ? "1px solid #f0e8e0" : "none" }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, color: ORANGE }}>{s.val}</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "#999", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
 
            <div style={{ background: "#fff", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1px solid #f0e8e0", marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>⚡</div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 20, color: ORANGE }}>+250 CREDS</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#999" }}>Just Click &amp; Earn!</div>
              </div>
            </div>
 
            <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #f0e8e0" }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Daily Tasks</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                {[true, true, true, false, false, false, false].map((done, i) => (
                  <div key={i} style={{ flex: 1, aspectRatio: "1", borderRadius: 8, background: done ? ORANGE : "#f5f0ea", border: done ? "none" : "1px solid #e8e0d8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: done ? "#fff" : "#ddd" }}>{done ? "✓" : ""}</div>
                ))}
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: "#999" }}>7 Day Login Rewards</div>
            </div>
          </div>
 
        </div>
      </div>
    </div>
  );
}
 
