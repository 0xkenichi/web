"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "./Toast";
import SubscriptionPaymentModal from "./SubscriptionPaymentModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

interface SubscriptionPlan {
  id: string;
  name: string;
  tier: "basic" | "pro" | "unlimited";
  interval: "monthly" | "yearly";
  price: number;
  originalPrice?: number;
  discount?: number;
  creditsAllocated: number;
  features: string[];
  profitMargin: number;
}

export default function SubscriptionPlans() {
  const { session } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isNigerian, setIsNigerian] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = session?.access_token;
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/subscriptions/plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPlans(data.data || []);
        setIsNigerian(data.isNigerian || false);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!STRIPE_PUBLISHABLE_KEY) {
      showToast("Payment processing not configured", "error");
      return;
    }

    setSelectedPlan(planId);
    // Payment modal will handle the rest
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-gray-600">
          {isNigerian && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              🇳🇬 Special Nigerian Pricing
            </span>
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-lg p-6 border-2 ${
              plan.tier === "pro"
                ? "border-blue-500 scale-105"
                : plan.tier === "unlimited"
                ? "border-purple-500"
                : "border-gray-200"
            }`}
          >
            {plan.tier === "pro" && (
              <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                MOST POPULAR
              </div>
            )}

            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

            <div className="mb-4">
              {plan.originalPrice && plan.discount ? (
                <div>
                  <span className="text-gray-400 line-through text-lg">
                    {formatPrice(plan.originalPrice)}
                  </span>
                  <span className="text-3xl font-bold ml-2">{formatPrice(plan.price)}</span>
                  <span className="text-green-600 font-semibold ml-2">
                    {plan.discount}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
              )}
              <span className="text-gray-600 ml-2">/{plan.interval === "monthly" ? "mo" : "yr"}</span>
            </div>

            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">
                <strong>{plan.creditsAllocated.toLocaleString()}</strong> credits allocated
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                plan.tier === "pro"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : plan.tier === "unlimited"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-600 hover:bg-gray-700 text-white"
              }`}
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (() => {
        const plan = plans.find((p) => p.id === selectedPlan);
        if (!plan) return null;
        return (
          <SubscriptionPaymentModal
            planId={plan.id}
            planName={plan.name}
            price={plan.price}
            onClose={() => setSelectedPlan(null)}
            onSuccess={() => {
              setSelectedPlan(null);
              showToast("Subscription activated! Credits allocated.", "success");
              fetchPlans();
            }}
          />
        );
      })()}
    </div>
  );
}

