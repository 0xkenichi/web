"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "./Toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  bonus?: number;
}

export default function PaymentModal({ onClose }: { onClose: () => void }) {
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/payments/packs`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPacks(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch packs:", error);
    } finally {
      setLoading(false);
    }
  };

  const { session } = useAuth();

  const handlePurchase = async (packId: string) => {
    if (!STRIPE_PUBLISHABLE_KEY) {
      showToast("Stripe not configured. Please contact support.", "error");
      return;
    }

    try {
      // Get token from session
      const token = session?.access_token;
      if (!token) {
        showToast("Please log in to purchase credits", "error");
        return;
      }

      // Create payment intent
      const intentResponse = await fetch(`${API_BASE_URL}/api/payments/create-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ packId }),
      });

      if (!intentResponse.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { data } = await intentResponse.json();

      // Load Stripe.js
      const stripe = (window as any).Stripe?.(STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        // Dynamically load Stripe.js
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/";
        script.onload = () => {
          const stripeInstance = (window as any).Stripe(STRIPE_PUBLISHABLE_KEY);
          handleStripePayment(stripeInstance, data.clientSecret, packId, token);
        };
        document.head.appendChild(script);
      } else {
        handleStripePayment(stripe, data.clientSecret, packId, token);
      }
    } catch (error) {
      console.error("Purchase error:", error);
      showToast("Failed to process payment. Please try again.", "error");
    }
  };

  const handleStripePayment = async (
    stripe: any,
    clientSecret: string,
    packId: string,
    token: string
  ) => {
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: await stripe.elements().create("card"),
        },
      });

      if (error) {
        showToast(error.message || "Payment failed", "error");
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Confirm purchase on backend
        const purchaseResponse = await fetch(`${API_BASE_URL}/api/payments/purchase`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            packId,
            paymentIntentId: paymentIntent.id,
          }),
        });

        if (purchaseResponse.ok) {
          showToast("Credits purchased successfully!", "success");
          onClose();
          // Refresh page to update credit balance
          window.location.reload();
        } else {
          showToast("Payment succeeded but failed to add credits. Contact support.", "error");
        }
      }
    } catch (error) {
      console.error("Stripe payment error:", error);
      showToast("Payment processing failed", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Purchase Credits</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {packs.map((pack) => (
              <div
                key={pack.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer"
                onClick={() => handlePurchase(pack.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{pack.name}</h3>
                    {pack.bonus && (
                      <p className="text-sm text-green-600">+{pack.bonus} bonus credits</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${(pack.price / 100).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

