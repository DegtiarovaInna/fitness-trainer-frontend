//src/components/StripeProvider.tsx
"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode, useMemo } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StripeProvider({
  clientSecret,
  children
}: {
  clientSecret: string;
  children: ReactNode;
}) {
  const options = useMemo(
    () => ({
      clientSecret,
      appearance: { theme: "stripe" as const },

    }),
    [clientSecret]
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
