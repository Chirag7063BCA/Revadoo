import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchMyShortlinkCompletions, fetchShortlinks } from "../../../../../services/shortlinks";

const ShortLinkTasksSection = () => {
  const location = useLocation();
  const [links, setLinks] = useState([]);
  const [completedCodes, setCompletedCodes] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [data, completions] = await Promise.all([
          fetchShortlinks(),
          fetchMyShortlinkCompletions(),
        ]);
        if (mounted) {
          setLinks(data);
          setCompletedCodes(new Set(completions.map((item) => item.code)));
        }
      } catch (err) {
        if (mounted) setError(err.message || "Unable to load shortlinks");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="space-y-4">
      {location.state?.shortlinkVerified && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          Shortlink verified successfully. Reward credited.
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 shadow-sm">
          Loading shortlinks...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && links.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 shadow-sm">
          No shortlinks available right now.
        </div>
      )}

      {!loading && !error && links.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {links.map((item) => (
            <article
              key={item._id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                Shortlink
              </p>
              <h3 className="mt-2 text-lg font-black text-gray-900">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-500">Code: {item.code}</p>
              <p className="mt-3 text-sm text-gray-700">
                Reward: <span className="font-bold text-gray-900">{item.reward} credits</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Type: {item.shortlinkType || "starter"} | Timer: {item.timerSeconds || 10}s | Verify: {item.verificationMethod || "checkbox"}
              </p>
              <p className="mt-1 text-xs font-semibold">
                {item.availabilityStatus === "scheduled" && (
                  <span className="text-amber-600">Scheduled</span>
                )}
                {item.availabilityStatus === "active" && (
                  <span className="text-green-600">Active now</span>
                )}
                {item.availabilityStatus === "expired" && (
                  <span className="text-red-600">Expired</span>
                )}
                {item.availabilityStatus === "inactive" && (
                  <span className="text-gray-500">Inactive</span>
                )}
              </p>

              <div className="mt-4">
                {completedCodes.has(item.code) ? (
                  <button
                    type="button"
                    disabled
                    className="inline-flex rounded-xl bg-green-100 px-4 py-2 text-sm font-bold text-green-700"
                  >
                    Completed
                  </button>
                ) : item.availabilityStatus !== "active" ? (
                  <button
                    type="button"
                    disabled
                    className="inline-flex rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-500"
                  >
                    {item.availabilityStatus === "scheduled" ? "Locked" : "Unavailable"}
                  </button>
                ) : (
                  <Link
                    to={`/s/${item.code}`}
                    className="inline-flex rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
                  >
                    Start
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ShortLinkTasksSection;
