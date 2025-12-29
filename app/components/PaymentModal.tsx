"use client";

import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

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

  const handlePurchase = async (packId: string) => {
    // In production, this would integrate with Stripe
    alert(`Purchase flow for ${packId} - Stripe integration needed`);
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

