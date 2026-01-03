"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "./Toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

interface SubscriptionPaymentModalProps {
  planId: string;
  planName: string;
  price: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubscriptionPaymentModal({
  planId,
  planName,
  price,
  onClose,
  onSuccess,
}: SubscriptionPaymentModalProps) {
  const { session } = useAuth();
  const [processing, setProcessing] = useState(false);

  const handleSubscribe = async () => {
    if (!STRIPE_PUBLISHABLE_KEY) {
      showToast("Payment processing not configured", "error");
      return;
    }

    const token = session?.access_token;
    if (!token) {
      showToast("Please log in to subscribe", "error");
      return;
    }

    setProcessing(true);

    try {
      // Load Stripe.js
      let stripe = (window as any).Stripe?.(STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://js.stripe.com/v3/";
          script.onload = () => {
            stripe = (window as any).Stripe(STRIPE_PUBLISHABLE_KEY);
            resolve(true);
          };
          document.head.appendChild(script);
        });
      }

      // Create Stripe checkout session
      const response = await fetch(`${API_BASE_URL}/api/subscriptions/create-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId,
          price,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        showToast(result.error.message, "error");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      showToast("Failed to process subscription. Please try again.", "error");
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Subscribe to {planName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            You'll be redirected to Stripe to complete your subscription payment.
          </p>
          <div className="bg-gray-50 rounded p-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Plan:</span>
              <span>{planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Price:</span>
              <span>${(price / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubscribe}
            disabled={processing}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {processing ? "Processing..." : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
}

