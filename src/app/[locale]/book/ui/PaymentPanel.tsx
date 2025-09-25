"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

export default function PaymentPanel({
  onClose,
  onSuccess
}: {
  onClose(): void;
  onSuccess(): void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPay() {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {

        return_url: window.location.href
      },
      redirect: "if_required"
    });
    setSubmitting(false);

    if (error) {
      setError(error.message || "Payment error");
      return;
    }
    if (paymentIntent?.status === "succeeded") {
      onSuccess();
    } else {
      setError(`Status: ${paymentIntent?.status ?? "unknown"}`);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Оплата</h3>
        <div className="mb-4">
          <PaymentElement />
        </div>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <div className="flex gap-3 justify-end">
          <button className="px-4 py-2 rounded border" onClick={onClose} disabled={submitting}>
            Отмена
          </button>
          <button className="btn-primary" onClick={onPay} disabled={submitting || !stripe}>
            {submitting ? "Оплата..." : "Оплатить"}
          </button>
        </div>
      </div>
    </div>
  );
}
