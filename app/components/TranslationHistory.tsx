"use client";

import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

interface HistoryItem {
  id: string;
  originalText: string;
  enhancedText: string;
  creditsConsumed: number;
  createdAt: string;
}

export default function TranslationHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const supabase = (await import("../../../utils/supabase/client")).createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/history`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Loading history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">No translation history yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Translation History</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {history.map((item) => (
          <div key={item.id} className="p-6">
            <div className="mb-2">
              <p className="text-sm text-gray-500 mb-1">Original</p>
              <p className="text-gray-900">{item.originalText}</p>
            </div>
            <div className="mb-2">
              <p className="text-sm text-gray-500 mb-1">Enhanced</p>
              <p className="text-gray-900">{item.enhancedText}</p>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{new Date(item.createdAt).toLocaleString()}</span>
              <span>{item.creditsConsumed} credits</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

