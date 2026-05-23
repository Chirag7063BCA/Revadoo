import { useState, useEffect, useCallback, useRef } from "react";
import { apiOriginUrl } from "../../../../../services/apiConfig";

const BASE = apiOriginUrl();

const authH = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export function useSpinSystem() {
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [msLeft, setMsLeft] = useState(0);
  const tickRef = useRef(null);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch(`${BASE}/api/spin/status`, { headers: authH() });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setStatus(data);
      setMsLeft(data.msUntilFree || 0);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${BASE}/api/spin/history`, { headers: authH() });
      const data = await response.json();
      if (response.ok) setHistory(data);
    } catch {
      // history is optional if the request fails
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchHistory();
  }, [fetchHistory, fetchStatus]);

  useEffect(() => {
    clearInterval(tickRef.current);

    if (msLeft > 0) {
      tickRef.current = setInterval(() => {
        setMsLeft((previous) => {
          if (previous <= 1000) {
            clearInterval(tickRef.current);
            fetchStatus();
            return 0;
          }
          return previous - 1000;
        });
      }, 1000);
    }

    return () => clearInterval(tickRef.current);
  }, [msLeft, fetchStatus]);

  const applySpinResult = useCallback((data, type = "free") => {
    if (!data) return;

    setResult(data);
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        localStorage.setItem("user", JSON.stringify({ ...parsed, creds: data.newCreds }));
      }
    } catch {
      // ignore storage update failures
    }

    setStatus((previous) =>
      previous
        ? {
            ...previous,
            creds: data.newCreds,
            canFreeSpin: type === "free" ? false : previous.canFreeSpin,
            canPaidSpin: data.newCreds >= (previous.paidCost || 100),
            totalSpins: (previous.totalSpins || 0) + 1,
          }
        : previous
    );

    window.dispatchEvent(new CustomEvent("balanceUpdated", { detail: { newBalance: data.newCreds } }));
    fetchHistory();
  }, [fetchHistory]);

  const executeSpin = useCallback(async (type = "free", options = {}) => {
    const { deferApply = false } = options;
    if (spinning) return null;

    setSpinning(true);
    setError("");

    try {
      const response = await fetch(`${BASE}/api/spin`, {
        method: "POST",
        headers: authH(),
        body: JSON.stringify({ type }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      if (!deferApply) {
        applySpinResult(data, type);
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setSpinning(false);
    }
  }, [applySpinResult, spinning]);

  const clearResult = useCallback(() => setResult(null), []);

  const countdown = (() => {
    const total = Math.max(msLeft, 0);
    const hours = String(Math.floor(total / 3600000)).padStart(2, "0");
    const minutes = String(Math.floor((total % 3600000) / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((total % 60000) / 1000)).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  })();

  return {
    status,
    history,
    spinning,
    result,
    error,
    loading,
    countdown,
    msLeft,
    executeSpin,
    applySpinResult,
    clearResult,
    refetch: fetchStatus,
  };
}