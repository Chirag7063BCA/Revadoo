// PaymentModal.jsx
import { useMemo, useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { apiUrl } from "../../../../services/apiConfig";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const isSecurePaymentContext = typeof window !== "undefined" && window.location.protocol === "https:";
const stripePromise = stripeKey && isSecurePaymentContext ? loadStripe(stripeKey) : null;

const appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#FF6B35",
    borderRadius: "10px",
  },
};

const amountOptions = [100, 250, 500, 1000, 2000];

const CheckoutForm = ({ userId, paymentIntentId, onSuccess, onClose, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message || "Payment confirmation failed");
      setProcessing(false);
      return;
    }

    const intentId = result.paymentIntent?.id || paymentIntentId;

    try {
      const response = await axios.post(apiUrl("/wallet/confirm-payment"), {
        paymentIntentId: intentId,
        userId,
      });

      let nextBalance = response.data.balance;
      if (nextBalance == null) {
        const walletResponse = await axios.get(apiUrl(`/wallet/balance/${userId}`));
        nextBalance = walletResponse.data.wallet?.balance ?? walletResponse.data.balance ?? 0;
      }

      onSuccess?.(nextBalance);
      onClose?.();
    } catch (confirmError) {
      setError(confirmError.response?.data?.message || "Could not confirm wallet top-up");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl bg-orange-50 border border-orange-100 p-3 text-xs text-orange-700">
        Test card: 4242 4242 4242 4242
      </div>
      <PaymentElement />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({ userId, onSuccess, onClose }) => {
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [error, setError] = useState("");

  const selectedAmount = useMemo(() => {
    const parsedCustom = Number(customAmount);
    return parsedCustom > 0 ? parsedCustom : amount;
  }, [amount, customAmount]);

  const createPaymentIntent = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(apiUrl("/wallet/create-payment-intent"), {
        userId,
        amount: selectedAmount,
      });
      setClientSecret(response.data.clientSecret);
      setPaymentIntentId(response.data.paymentIntentId);
      setStep(2);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not create payment intent");
    } finally {
      setLoading(false);
    }
  };

  if (!isSecurePaymentContext) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Add Money</p>
              <h3 className="text-xl font-bold text-gray-900">Stripe Top-Up</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Card payments are only available over HTTPS. Open this page on your deployed site to add money.
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Add Money</p>
            <h3 className="text-xl font-bold text-gray-900">Stripe Top-Up</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {amountOptions.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setAmount(preset);
                    setCustomAmount("");
                  }}
                  className={`rounded-xl border px-2 py-2 text-sm font-semibold transition-colors ${amount === preset && !customAmount ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700">Custom amount</span>
              <div className="flex items-center rounded-xl border border-gray-200 focus-within:border-orange-400">
                <span className="pl-4 text-gray-500">₹</span>
                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full rounded-xl px-3 py-3 outline-none"
                />
              </div>
            </label>

            <p className="text-sm text-gray-500">Selected: ₹{selectedAmount.toLocaleString("en-IN")}</p>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createPaymentIntent}
                disabled={loading || !selectedAmount}
                className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Loading..." : "Continue"}
              </button>
            </div>
          </div>
        ) : (
          clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
              <CheckoutForm
                userId={userId}
                paymentIntentId={paymentIntentId}
                onSuccess={onSuccess}
                onClose={onClose}
                onBack={() => setStep(1)}
              />
            </Elements>
          ) : null
        )}
      </div>
    </div>
  );
};

export default PaymentModal;