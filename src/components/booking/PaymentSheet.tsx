// src/components/booking/PaymentSheet.tsx
/*"use client";
import { useMemo, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { stripePromise } from "@/src/lib/stripe";
import { useTranslations } from "next-intl";

type SheetProps = {
  clientSecret: string;
  onSuccess: () => void;
  onClose: () => void;
};

function InnerSheet({ onSuccess, onClose }: Omit<SheetProps, "clientSecret">) {
  const t = useTranslations();
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required"
    });

    if (error) {
      setError(error.message ?? t("payments.failed"));
      setSubmitting(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    } else {
      setError(t("payments.processingOrAction"));
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{t("payments.payment")}</h3>
          <button className="text-gray-500 hover:text-black" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          <PaymentElement />
          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            className="btn-success w-full disabled:opacity-60"
            disabled={!stripe || submitting}
          >
            {submitting ? t("payments.processingShort") : t("payments.payNow")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function PaymentSheet({ clientSecret, onSuccess, onClose }: SheetProps) {
  const options = useMemo(() => ({ clientSecret }), [clientSecret]);
  return (
    <Elements stripe={stripePromise} options={options}>
      <InnerSheet onSuccess={onSuccess} onClose={onClose} />
    </Elements>
  );
}*/
// src/components/booking/PaymentSheet.tsx
"use client";

import { useMemo, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { stripePromise } from "@/src/lib/stripe";

type SheetProps = {
  clientSecret: string;
  onSuccess: () => void;
  onClose: () => void;
};

function RealStripeInner({ onSuccess, onClose }: Omit<SheetProps, "clientSecret">) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setError(error.message ?? "Payment failed");
      setSubmitting(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    } else {
      setError("Payment processing or action required. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Payment</h3>
          <button className="text-gray-500 hover:text-black" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          <PaymentElement />
          {error && <div className="text-sm text-red-600">{error}</div>}

          <button type="submit" className="btn-success w-full disabled:opacity-60" disabled={!stripe || submitting}>
            {submitting ? "Processing..." : "Pay now"}
          </button>
        </form>
      </div>
    </div>
  );
}

function FakeStripeInner({ onSuccess, onClose }: Omit<SheetProps, "clientSecret">) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Payment (FAKE)</h3>
          <button className="text-gray-500 hover:text-black" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Режим мок-данных включён (<code>NEXT_PUBLIC_FAKE_API=1</code>). Stripe отключён. Нажми «Завершить
            оплату», чтобы смоделировать успешный платёж.
          </p>
          <button className="btn-success w-full" onClick={onSuccess}>
            Завершить оплату (fake)
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSheet({ clientSecret, onSuccess, onClose }: SheetProps) {
  // если фейк — не инициализируем Stripe вообще
  if (process.env.NEXT_PUBLIC_FAKE_API === "1") {
    return <FakeStripeInner onSuccess={onSuccess} onClose={onClose} />;
  }

  const options = useMemo(() => ({ clientSecret }), [clientSecret]);
  return (
    <Elements stripe={stripePromise} options={options}>
      <RealStripeInner onSuccess={onSuccess} onClose={onClose} />
    </Elements>
  );
}


