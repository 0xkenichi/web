"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Use Next.js API route if external API is not available
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const getApiUrl = () => {
  if (API_BASE_URL) return API_BASE_URL;
  // Use relative URL for Next.js API route
  return typeof window !== "undefined" ? "" : "http://localhost:3000";
};

type CreditStatus = "premium" | "free" | "low" | "empty" | "good";

interface CreditStatusInfo {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  message: string;
  showAction: boolean;
}

export default function CreditBalance() {
  const [balance, setBalance] = useState<number | null>(null);
  const [premiumStatus, setPremiumStatus] = useState<string>("free");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBalance();
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBalance = async () => {
    let timeoutId: NodeJS.Timeout | null = null;
    try {
      setError(null);
      const supabase = (await import("../../../../utils/supabase/client")).createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      // Create AbortController for timeout
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const apiUrl = getApiUrl();
      const url = apiUrl 
        ? `${apiUrl}/api/credits/balance`
        : "/api/credits/balance";
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      setBalance(data.data.balance);
      setPremiumStatus(data.data.premiumStatus || "free");
      setError(null);
    } catch (error: any) {
      if (timeoutId) clearTimeout(timeoutId);
      // Handle different types of errors
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        setError("Request timed out. Please check your connection.");
        console.error("Failed to fetch balance: Request timeout", error);
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.name === 'TypeError') {
        const apiUrl = API_BASE_URL || "the API server";
        setError("Cannot connect to server. Make sure the API server is running at " + apiUrl);
        console.error("Failed to fetch balance: Network error", error);
      } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        setError("Authentication failed. Please log in again.");
        console.error("Failed to fetch balance: Authentication error", error);
      } else {
        setError(error.message || "Failed to load balance. Please try again.");
        console.error("Failed to fetch balance:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCreditStatus = (): CreditStatus => {
    if (premiumStatus === "premium") return "premium";
    if (balance === null) return "free";
    if (balance === 0) return "empty";
    if (balance < 30) return "low";
    return "good";
  };

  const getStatusInfo = (status: CreditStatus): CreditStatusInfo => {
    switch (status) {
      case "premium":
        return {
          label: "Premium Plan",
          icon: "⭐",
          color: "text-yellow-700",
          bgColor: "bg-gradient-to-br from-yellow-50 to-amber-50",
          borderColor: "border-yellow-300",
          message: "Unlimited access to all features",
          showAction: false,
        };
      case "free":
        return {
          label: "Free Plan",
          icon: "🆓",
          color: "text-blue-700",
          bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
          borderColor: "border-blue-300",
          message: balance !== null ? `${balance} credits remaining` : "Loading credits...",
          showAction: true,
        };
      case "good":
        return {
          label: `${balance} Credits Left`,
          icon: "✅",
          color: "text-green-700",
          bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          message: "You're all set!",
          showAction: true,
        };
      case "low":
        return {
          label: "Running Low",
          icon: "⚠️",
          color: "text-orange-700",
          bgColor: "bg-gradient-to-br from-orange-50 to-amber-50",
          borderColor: "border-orange-300",
          message: `Only ${balance} credits remaining`,
          showAction: true,
        };
      case "empty":
        return {
          label: "Out of Credits",
          icon: "❌",
          color: "text-red-700",
          bgColor: "bg-gradient-to-br from-red-50 to-rose-50",
          borderColor: "border-red-300",
          message: "Purchase credits to continue",
          showAction: true,
        };
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-5">
        <div className="text-sm">
          <p className="font-semibold text-red-800 mb-2">⚠️ Unable to load credits</p>
          <p className="text-xs text-red-600 mb-3">{error}</p>
          <button
            onClick={fetchBalance}
            className="text-xs bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (balance === null && premiumStatus !== "premium") {
    return null;
  }

  const status = getCreditStatus();
  const statusInfo = getStatusInfo(status);

  return (
    <div className={`rounded-xl shadow-sm border-2 ${statusInfo.borderColor} ${statusInfo.bgColor} p-5 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{statusInfo.icon}</span>
          <div>
            <p className={`text-sm font-semibold ${statusInfo.color} mb-0.5`}>
              {statusInfo.label}
            </p>
            <p className="text-xs text-gray-600">
              {statusInfo.message}
            </p>
          </div>
        </div>
        {premiumStatus === "premium" && (
          <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            PRO
          </span>
        )}
      </div>

      {premiumStatus !== "premium" && balance !== null && (
        <div className="mt-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-2xl font-bold ${statusInfo.color}`}>
              {balance.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">credits</span>
          </div>
        </div>
      )}

      {statusInfo.showAction && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {status === "empty" ? (
            <button
              onClick={() => router.push("/pricing")}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all duration-200 shadow-sm"
            >
              Buy Credits
            </button>
          ) : status === "low" ? (
            <button
              onClick={() => router.push("/pricing")}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-sm"
            >
              Get More Credits
            </button>
          ) : (
            <button
              onClick={() => router.push("/pricing")}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
            >
              Upgrade to Premium
            </button>
          )}
        </div>
      )}
    </div>
  );
}

