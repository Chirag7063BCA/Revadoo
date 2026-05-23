// PinInput.jsx
import { useEffect, useRef } from "react";

const PinInput = ({ value = "", onChange, onComplete, error = false }) => {
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index, nextValue) => {
    if (!/^\d?$/.test(nextValue)) return;
    const nextPin = value.split("");
    nextPin[index] = nextValue;
    const normalized = nextPin.join("").slice(0, 4);
    onChange?.(normalized);
    if (normalized.length === 4 && !normalized.includes("")) {
      onComplete?.(normalized);
    }
    if (nextValue && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const digits = value.padEnd(4, "").slice(0, 4).split("");

  return (
    <>
      <style>{`
        @keyframes wallet-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        .wallet-pin-shake {
          animation: wallet-shake 0.3s linear;
        }
      `}</style>
      <div className={`flex gap-3 ${error ? "wallet-pin-shake" : ""}`}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              inputsRef.current[index] = node;
            }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            className={`w-12 h-14 rounded-xl border-2 text-center text-xl font-bold outline-none transition-colors ${error ? "border-red-400" : "border-gray-200 focus:border-orange-400"}`}
          />
        ))}
      </div>
    </>
  );
};

export default PinInput;