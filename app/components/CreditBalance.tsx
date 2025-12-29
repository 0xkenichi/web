"use client";

import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export default function CreditBalance() {
  const [balance, setBalance] = useState<number | null>(null);
  const [premiumStatus, setPremiumStatus] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const supabase = (await import("../../../utils/supabase/client")).createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/credits/balance`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.data.balance);
        setPremiumStatus(data.data.premiumStatus);
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (balance === null) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Credits Balance</p>
          <p className="text-2xl font-bold text-gray-900">
            {premiumStatus === "premium" ? "Unlimited" : balance.toLocaleString()}
          </p>
        </div>
        {premiumStatus === "premium" && (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            PRO
          </span>
        )}
      </div>
    </div>
  );
}

