import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  completeShortlinkDirect,
  fetchShortlinkByCode,
  startShortlinkVisit,
} from "../services/shortlinks";

const ShortLinkVisitPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState(null);
  const [step, setStep] = useState("timer");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [humanChecked, setHumanChecked] = useState(false);
  const [mathQuestion, setMathQuestion] = useState({ a: 0, b: 0, answer: 0 });
  const [mathInput, setMathInput] = useState("");
  const [visitToken, setVisitToken] = useState("");

  const normalizedCode = useMemo(
    () => String(code || "").trim().toLowerCase(),
    [code]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchShortlinkByCode(normalizedCode);
        setLink(data);
        setSecondsLeft(Math.max(3, Number(data.timerSeconds) || 10));
        setStep("timer");
        setHumanChecked(false);
        setMathInput("");

        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        setMathQuestion({ a, b, answer: a + b });

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/authpage", { replace: true });
          return;
        }

        const session = await startShortlinkVisit(normalizedCode);
        setVisitToken(session.visitToken || "");
      } catch (err) {
        setError(err.message || "Unable to load shortlink");
      } finally {
        setLoading(false);
      }
    };

    if (!normalizedCode) {
      navigate("/", { replace: true });
      return;
    }

    load();
  }, [navigate, normalizedCode]);

  const handleVisit = async () => {
    setBusy(true);
    setError("");

    try {
      const payload = await completeShortlinkDirect({
        code: normalizedCode,
        visitToken,
      });

      try {
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          parsed.creds = payload.creds;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
      } catch {}

      navigate("/dashboard/tasks/short-link", {
        replace: true,
        state: { shortlinkVerified: true },
      });
    } catch (err) {
      setError(err.message || "Unable to complete shortlink");
      setBusy(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (step !== "timer") return;
    if (secondsLeft <= 0) return;

    const timer = setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [loading, step, secondsLeft]);

  useEffect(() => {
    if (step === "timer" && secondsLeft <= 0) {
      setStep("unlock");
    }
  }, [secondsLeft, step]);

  const verificationMode = link?.verificationMethod || "checkbox";
  const humanVerified =
    verificationMode === "checkbox"
      ? humanChecked
      : Number(mathInput) === mathQuestion.answer;

  return (
    <section className="min-h-[100svh] bg-gradient-to-b from-orange-50 via-white to-gray-50 px-0 py-0">
      <div className="w-full rounded-none border-0 bg-white p-4 shadow-none sm:p-6 lg:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500 sm:text-xs">
          Shortlink Visit
        </p>
        <h1 className="mt-2 break-words text-xl font-black leading-tight text-gray-900 sm:text-2xl lg:text-3xl">
          {loading ? "Loading..." : link?.title || "Visit Link"}
        </h1>

        {!loading && link && (
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Reward: <span className="font-bold text-gray-900">{link.reward} credits</span>
          </p>
        )}

        <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-[15px]">
          Follow the required steps to continue: wait timer, pass human check,
          then complete task to receive reward in your creds.
        </p>

        {!loading && link && (
          <div className="mt-5 space-y-3 sm:mt-6">
            {link.topImageUrl ? (
              <img
                src={link.topImageUrl}
                alt="shortlink top visual"
                className="aspect-[16/9] w-full rounded-xl border border-gray-200 object-cover"
              />
            ) : null}

            {link.topText ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {link.topText}
              </div>
            ) : null}

            {link.middleImageUrl ? (
              <img
                src={link.middleImageUrl}
                alt="shortlink secondary visual"
                className="aspect-[16/9] w-full rounded-xl border border-gray-200 object-cover"
              />
            ) : null}

            {link.middleText ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {link.middleText}
              </div>
            ) : null}

            {link.extraText ? (
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                {link.extraText}
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
            Required Flow
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-700 sm:text-[15px]">
            1) Timer ({link?.timerSeconds || 10}s)
            <span className="mx-1">{"->"}</span>
            2) Unlock button
            <span className="mx-1">{"->"}</span>
            3) Human verification ({verificationMode})
            <span className="mx-1">{"->"}</span>
            4) Redirect button
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-3">
          {step === "timer" && (
            <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-center text-sm font-semibold text-orange-700 sm:text-base">
              Please wait... {secondsLeft}s
            </div>
          )}

          {step === "unlock" && (
            <button
              type="button"
              onClick={() => setStep("verify")}
              className="w-full rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600 sm:w-auto"
            >
              Continue to Human Verification
            </button>
          )}

          {step === "verify" && (
            <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <p className="text-sm font-semibold text-gray-800">Verify you are human</p>

              {verificationMode === "checkbox" ? (
                <label className="flex items-start gap-2 text-sm text-gray-700 sm:items-center">
                  <input
                    type="checkbox"
                    checked={humanChecked}
                    onChange={(event) => setHumanChecked(event.target.checked)}
                  />
                  <span>I confirm I am a real user</span>
                </label>
              ) : (
                <div>
                  <p className="mb-2 text-sm text-gray-700 sm:text-[15px]">
                    Solve: {mathQuestion.a} + {mathQuestion.b} = ?
                  </p>
                  <input
                    type="number"
                    value={mathInput}
                    onChange={(event) => setMathInput(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:w-40"
                    placeholder="Answer"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  if (!humanVerified) {
                    setError("Human verification failed. Please try again.");
                    return;
                  }
                  setError("");
                  setStep("ready");
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto"
              >
                Verify Human
              </button>
            </div>
          )}

          {step === "ready" && (
            <button
              type="button"
              onClick={handleVisit}
              disabled={loading || busy || !link || !visitToken}
              className="w-full rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
            >
              {busy ? "Completing..." : link?.actionButtonLabel || "Complete Task"}
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/dashboard/tasks/short-link")}
            className="w-full rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >
            Back
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShortLinkVisitPage;
