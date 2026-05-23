import { useCallback, useEffect, useRef, useState } from "react";
import SpinWheel, { animateWheel } from "./SpinWheel";
import SpinResultModal from "./SpinResultModal";
import SpinHistory from "./SpinHistory";
import { useSpinSystem } from "./useSpinSystem";

export default function DashboardLuckyDraw() {
  const { status, history, spinning, result, error, loading, countdown, msLeft, executeSpin, applySpinResult, clearResult } = useSpinSystem();
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [wheelSize, setWheelSize] = useState(320);
  const cancelAnimationRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioTimerRef = useRef(null);
  const wheelStageRef = useRef(null);

  const stopSpinSound = useCallback(() => {
    if (audioTimerRef.current) {
      clearInterval(audioTimerRef.current);
      audioTimerRef.current = null;
    }
  }, []);

  const playSpinSound = useCallback(() => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new Ctx();
      }

      const context = audioContextRef.current;
      if (context.state === "suspended") {
        context.resume();
      }

      stopSpinSound();

      audioTimerRef.current = setInterval(() => {
        const now = context.currentTime;
        const osc = context.createOscillator();
        const gain = context.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(260 + Math.random() * 120, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.03, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

        osc.connect(gain);
        gain.connect(context.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      }, 95);
    } catch {
      // audio is optional
    }
  }, [stopSpinSound]);

  useEffect(() => {
    const stage = wheelStageRef.current;
    if (!stage) return;

    const updateWheelSize = () => {
      const stageWidth = stage.clientWidth;
      const viewport = window.innerWidth;
      const sidePadding = viewport < 640 ? 4 : 10;
      const raw = Math.floor(stageWidth - sidePadding);
      const minSize = viewport < 400 ? 270 : viewport < 640 ? 320 : 380;
      const maxSize = viewport < 768 ? 520 : viewport < 1280 ? 680 : 740;
      setWheelSize(Math.max(minSize, Math.min(maxSize, raw)));
    };

    updateWheelSize();

    const observer = new ResizeObserver(updateWheelSize);
    observer.observe(stage);
    window.addEventListener("resize", updateWheelSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWheelSize);
    };
  }, []);

  const handleSpin = useCallback(async (type) => {
    if (isAnimating || spinning) return;

    const spinResult = await executeSpin(type, { deferApply: true });
    if (!spinResult) return;

    setIsAnimating(true);
    playSpinSound();
    cancelAnimationRef.current?.();
    cancelAnimationRef.current = animateWheel({
      fromRotation: rotation,
      segmentIndex: spinResult.segmentIndex,
      skipAnimation: false,
      onTick: setRotation,
      onDone: () => {
        applySpinResult(spinResult, type);
        stopSpinSound();
        setIsAnimating(false);
      },
    });
  }, [applySpinResult, executeSpin, isAnimating, playSpinSound, rotation, spinning, stopSpinSound]);

  useEffect(() => {
    return () => {
      stopSpinSound();
      cancelAnimationRef.current?.();
      if (audioContextRef.current && typeof audioContextRef.current.close === "function") {
        audioContextRef.current.close();
      }
    };
  }, [stopSpinSound]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  const canFreeSpin = status?.canFreeSpin && !isAnimating;
  const canPaidSpin = status?.canPaidSpin && !isAnimating;
  const isBusy = isAnimating || spinning;

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 p-3 sm:p-6">
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-black/5">
        <div className="grid gap-6 px-3 py-6 sm:px-5 sm:py-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col items-center gap-5 xl:gap-6">
          {!status?.canFreeSpin && msLeft > 0 && (
            <div className="w-full max-w-[560px] rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-center">
              <p className="text-sm font-bold text-gray-700">You have already used your Free Spin</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                <p className="text-xs font-semibold text-gray-500">Next free spin in</p>
              </div>
              <p className="mt-1 text-2xl font-black text-orange-500 tabular-nums">{countdown}</p>
            </div>
          )}

          <div ref={wheelStageRef} className="relative flex w-full items-center justify-center px-0 sm:px-1">
            <div
              className="absolute rounded-full"
              style={{
                width: wheelSize + 20,
                height: wheelSize + 20,
                background: "radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)",
              }}
            />
            <SpinWheel rotation={rotation} size={wheelSize} />

            {isBusy && (
              <div
                className="absolute flex flex-col items-center justify-center rounded-full bg-white/90"
                style={{ width: wheelSize * 0.44, height: wheelSize * 0.44 }}
              >
                <div className="h-6 w-6 animate-spin rounded-full border-3 border-orange-500 border-t-transparent" style={{ borderWidth: 3 }} />
              </div>
            )}
          </div>

          <div className="w-full max-w-[560px] rounded-xl border border-orange-100 bg-orange-50/70 px-4 py-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
              {isBusy ? "Best of luck" : result ? "Spin complete" : "Spin ready"}
            </p>
            <p className="mt-0.5 text-sm font-bold text-gray-700">
              {isBusy
                ? "Wheel is spinning to your server-selected reward"
                : result
                  ? `Landed on: ${result.rewardLabel}`
                  : "Press spin to play"}
            </p>
          </div>

          <div className="grid w-full max-w-[560px] gap-3 sm:grid-cols-2">
            <button
              onClick={() => handleSpin("free")}
              disabled={!canFreeSpin || isBusy}
              className={`relative w-full rounded-2xl py-4 text-base font-black transition-all duration-200 ${
                canFreeSpin && !isBusy
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-200 hover:-translate-y-0.5 hover:bg-orange-600 active:translate-y-0"
                  : "cursor-not-allowed bg-gray-100 text-gray-400"
              }`}
            >
              {isBusy ? "Spinning..." : canFreeSpin ? "Spin Free" : `Next free spin: ${countdown}`}
            </button>

            <button
              onClick={() => handleSpin("paid")}
              disabled={!canPaidSpin || isBusy}
              className={`w-full rounded-2xl border-2 py-3.5 text-sm font-black transition-all duration-200 ${
                canPaidSpin && !isBusy
                  ? "border-orange-200 bg-white text-orange-600 hover:-translate-y-0.5 hover:bg-orange-50 active:translate-y-0"
                  : "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
              }`}
            >
              Spin again for {status?.paidCost || 100} credits
              {status?.creds < (status?.paidCost || 100) && <span className="ml-2 text-xs opacity-70">(insufficient balance)</span>}
            </button>
          </div>

          </div>

          <div className="space-y-4 lg:pl-1">
            <SpinHistory history={history} />
          </div>
        </div>

        {error && (
          <div className="border-t border-red-100 bg-red-50 px-5 py-3 text-center">
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        )}

      </div>

      <SpinResultModal result={result} onClose={clearResult} />
    </div>
  );
}