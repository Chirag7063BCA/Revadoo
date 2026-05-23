import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyShortlinkVisit } from "../services/shortlinks";

const ShortLinkVerifyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const code = useMemo(
    () => String(searchParams.get("code") || "").trim().toLowerCase(),
    [searchParams]
  );
  const visitToken = useMemo(
    () => String(searchParams.get("v") || "").trim(),
    [searchParams]
  );

  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing verification...");

  useEffect(() => {
    const run = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("error");
        setMessage("Please login to verify this shortlink reward.");
        return;
      }

      if (!code || !visitToken) {
        setStatus("error");
        setMessage("Missing verification data. Please start the shortlink again.");
        return;
      }

      try {
        const payload = await verifyShortlinkVisit({ code, visitToken });
        setStatus("success");
        setMessage(
          payload.message || `Success! ${payload.reward || 0} credits have been added.`
        );
        setTimeout(() => {
          navigate("/dashboard/tasks/short-link", {
            replace: true,
            state: { shortlinkVerified: true },
          });
        }, 1600);
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Verification failed. Please try again.");
      }
    };

    run();
  }, [code, navigate, visitToken]);

  return (
    <section className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
          Shortlink Verification
        </p>

        <h1 className="mt-2 text-2xl font-black text-gray-900">
          {status === "processing" ? "Verifying..." : status === "success" ? "Verified" : "Verification Failed"}
        </h1>

        <p
          className={`mt-3 text-sm ${
            status === "error" ? "text-red-600" : "text-gray-600"
          }`}
        >
          {message}
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/tasks/short-link")}
            className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Go to Dashboard Tasks
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShortLinkVerifyPage;
