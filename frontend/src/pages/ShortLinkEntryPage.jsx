import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const ShortLinkEntryPage = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!code) {
      navigate("/", { replace: true });
      return;
    }

    const carry = searchParams.toString();
    navigate(`/visit/${encodeURIComponent(code)}${carry ? `?${carry}` : ""}`, {
      replace: true,
    });
  }, [code, navigate, searchParams]);

  return (
    <section className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-lg font-black text-gray-900">Preparing Shortlink</h1>
        <p className="mt-2 text-sm text-gray-600">Please wait...</p>
      </div>
    </section>
  );
};

export default ShortLinkEntryPage;
