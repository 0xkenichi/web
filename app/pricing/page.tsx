"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "../components/Toast";
import SubscriptionPaymentModal from "../components/SubscriptionPaymentModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

interface Plan {
  id: string;
  name: string;
  tier: "free" | "basic" | "pro" | "unlimited";
  interval?: "monthly" | "yearly";
  price?: number;
  originalPrice?: number;
  discount?: number;
  creditsAllocated?: number;
  features: string[];
  popular?: boolean;
}

export default function PricingPage() {
  const router = useRouter();
  const { session, user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isNigerian, setIsNigerian] = useState(false);
  const [userCountry, setUserCountry] = useState<string>("US");

  useEffect(() => {
    fetchUserCountry();
    fetchPlans();
  }, [session]);

  const fetchUserCountry = async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      // Get user's country from subscription status endpoint
      const response = await fetch(`${API_BASE_URL}/api/subscriptions/status`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Country might be in user data, for now we'll get it from plans endpoint
      }
    } catch (error) {
      console.error("Failed to fetch user country:", error);
    }
  };

  const fetchPlans = async () => {
    try {
      const token = session?.access_token;
      
      // Fetch plans - will return country-specific pricing
      const response = await fetch(`${API_BASE_URL}/api/subscriptions/plans`, {
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : {},
      });

      if (response.ok) {
        const data = await response.json();
        const fetchedPlans = data.data || [];
        setIsNigerian(data.isNigerian || false);
        setUserCountry(data.country || "US");

        // Build complete plans array with Free tier
        const allPlans: Plan[] = [
          // FREE TIER
          {
            id: "free",
            name: "Free",
            tier: "free",
            features: [
              "100 credits/month",
              "Ollama (Llama 3) - Free AI model",
              "Message enhancement",
              "Basic features",
              "Community support",
            ],
          },
          // BASIC TIER
          ...fetchedPlans
            .filter((p: any) => p.tier === "basic" && p.interval === "monthly")
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              tier: "basic" as const,
              interval: p.interval,
              price: p.price,
              originalPrice: p.originalPrice,
              discount: p.discount,
              creditsAllocated: p.creditsAllocated,
              features: p.features.filter((f: string) => !f.includes("credits")),
            })),
          // PRO TIER
          ...fetchedPlans
            .filter((p: any) => p.tier === "pro" && p.interval === "monthly")
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              tier: "pro" as const,
              interval: p.interval,
              price: p.price,
              originalPrice: p.originalPrice,
              discount: p.discount,
              creditsAllocated: p.creditsAllocated,
              features: p.features.filter((f: string) => !f.includes("credits")),
              popular: true,
            })),
          // UNLIMITED TIER
          ...fetchedPlans
            .filter((p: any) => p.tier === "unlimited" && p.interval === "monthly")
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              tier: "unlimited" as const,
              interval: p.interval,
              price: p.price,
              originalPrice: p.originalPrice,
              discount: p.discount,
              creditsAllocated: p.creditsAllocated,
              features: p.features.filter((f: string) => !f.includes("credits")),
            })),
        ];

        setPlans(allPlans);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      // Set default free tier if API fails
      setPlans([
        {
          id: "free",
          name: "Free",
          tier: "free",
          features: [
            "100 credits/month",
            "Ollama (Llama 3) - Free AI model",
            "Message enhancement",
            "Basic features",
            "Community support",
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (planId: string) => {
    if (planId === "free") {
      showToast("You're already on the free plan!", "info");
      return;
    }

    if (!session?.access_token) {
      showToast("Please log in to subscribe", "error");
      router.push("/login");
      return;
    }

    setSelectedPlan(planId);
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--verba-cloud)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold verba-gradient-text mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-[var(--verba-slate)] max-w-3xl mx-auto">
            Start free, upgrade when you need more. All plans include access to our AI-powered message enhancement.
          </p>
          {isNigerian && (
            <div className="mt-4">
              <span className="inline-flex items-center gap-2 bg-[var(--verba-mint)]/20 text-[var(--verba-mint)] px-4 py-2 rounded-full text-sm font-semibold border border-[var(--verba-mint)]/30">
                🇳🇬 Special Nigerian Pricing Available
              </span>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl shadow-lg border-2 p-6 transition-all hover:shadow-xl relative ${
                plan.tier === "free"
                  ? "border-gray-200"
                  : plan.tier === "basic"
                  ? "border-blue-200"
                  : plan.tier === "pro"
                  ? "border-blue-500 scale-105 z-10"
                  : "border-purple-500"
              }`}
            >
              {/* Badges */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {plan.tier === "free" && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    FREE
                  </span>
                </div>
              )}

              {/* Tier Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-2">
                {plan.name}
              </h3>

              {/* Pricing */}
              <div className="mb-4">
              {plan.tier === "free" ? (
                <div>
                  <div className="text-4xl font-bold text-[var(--verba-mint)]">$0</div>
                  <div className="text-sm text-[var(--verba-slate)]">Forever free</div>
                </div>
              ) : (
                  <>
                    {plan.originalPrice && plan.discount ? (
                      <div>
                        <span className="text-gray-400 line-through text-lg">
                          {formatPrice(plan.originalPrice)}
                        </span>
                        <span className="text-4xl font-bold ml-2">
                          {formatPrice(plan.price!)}
                        </span>
                        {isNigerian && (
                          <span className="text-[var(--verba-mint)] font-semibold ml-2 text-sm">
                            {plan.discount}% OFF
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-4xl font-bold">{formatPrice(plan.price!)}</div>
                    )}
                    <div className="text-sm text-[var(--verba-slate)]">
                      /{plan.interval === "monthly" ? "month" : "year"}
                    </div>
                    {plan.creditsAllocated && (
                      <div className="text-sm text-[var(--verba-gray)] mt-1">
                        {plan.creditsAllocated.toLocaleString()} credits
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6 min-h-[200px]">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {plan.tier === "free" ? (
                <button
                  onClick={() => router.push("/")}
                  className="w-full bg-[var(--verba-slate)] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[var(--verba-ink)] transition-colors"
                >
                  Get Started
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                    plan.tier === "pro"
                      ? "verba-gradient text-white hover:opacity-90 hover:shadow-lg"
                      : plan.tier === "unlimited"
                      ? "bg-[var(--verba-indigo)] hover:bg-[#4a2fd4] text-white hover:shadow-lg"
                      : "verba-gradient text-white hover:opacity-90 hover:shadow-lg"
                  }`}
                >
                  {session ? "Subscribe Now" : "Sign Up to Subscribe"}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Basic</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Pro</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Unlimited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 font-medium">Credits/Month</td>
                  <td className="py-3 px-4 text-center">100</td>
                  <td className="py-3 px-4 text-center">
                    {isNigerian ? "1,345" : "4,000"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {isNigerian ? "5,395" : "10,000"}
                  </td>
                  <td className="py-3 px-4 text-center">Unlimited*</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">AI Models</td>
                  <td className="py-3 px-4 text-center">Ollama Only</td>
                  <td className="py-3 px-4 text-center">Basic Models</td>
                  <td className="py-3 px-4 text-center">All Models</td>
                  <td className="py-3 px-4 text-center">All Models</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Real-Time Call Analysis</td>
                  <td className="py-3 px-4 text-center">✗</td>
                  <td className="py-3 px-4 text-center">✗</td>
                  <td className="py-3 px-4 text-center">✓</td>
                  <td className="py-3 px-4 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Support</td>
                  <td className="py-3 px-4 text-center">Community</td>
                  <td className="py-3 px-4 text-center">Email</td>
                  <td className="py-3 px-4 text-center">Priority</td>
                  <td className="py-3 px-4 text-center">Priority +</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-4">*Fair use policy applies</p>
        </div>

        {/* FAQ */}
        <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I start with the free plan?</h3>
              <p className="text-gray-700">
                Yes! All new users start with the free plan, which includes 100 credits per month and access to our free Ollama model.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What happens to my credits if I upgrade?</h3>
              <p className="text-gray-700">
                Your existing credits remain in your account. When you subscribe, you'll receive the allocated credits for your plan on top of what you already have.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-700">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            {isNigerian && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Why do I see different pricing?</h3>
                <p className="text-gray-700">
                  We offer special pricing for Nigerian users to make our service more accessible. The pricing you see is automatically applied based on your location.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push("/")}
            className="verba-gradient text-white px-8 py-3 rounded-lg font-semibold text-lg hover:opacity-90 hover:shadow-lg transition-all"
          >
            Start Enhancing Messages
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (() => {
        const plan = plans.find((p) => p.id === selectedPlan);
        if (!plan || !plan.price) return null;
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
