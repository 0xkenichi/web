"use client";

import { useState, useEffect, useMemo } from "react";
import { showToast } from "./Toast";

// Use Next.js API route if external API is not available
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const getApiUrl = () => {
  if (API_BASE_URL) return API_BASE_URL;
  // Use relative URL for Next.js API route
  return typeof window !== "undefined" ? "" : "http://localhost:3000";
};

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
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const supabase = (await import("../../../../utils/supabase/client")).createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      const apiUrl = getApiUrl();
      const url = apiUrl 
        ? `${apiUrl}/api/history`
        : "/api/history";
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
      showToast("Failed to load history", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const query = searchQuery.toLowerCase();
    return history.filter(
      (item) =>
        item.originalText.toLowerCase().includes(query) ||
        item.enhancedText.toLowerCase().includes(query)
    );
  }, [history, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard! 📋", "success");
    } catch (err) {
      showToast("Failed to copy", "error");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Translation History</h2>
          <span className="text-sm text-gray-500">
            {filteredHistory.length} {filteredHistory.length === 1 ? "item" : "items"}
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search your history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center">
          {history.length === 0 ? (
            <>
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No history yet</h3>
              <p className="text-gray-500 mb-4">
                Start enhancing messages to see them appear here
              </p>
            </>
          ) : (
            <>
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500">
                Try adjusting your search query
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
          {filteredHistory.map((item) => {
            const isExpanded = expandedItems.has(item.id);
            const shouldTruncate = item.originalText.length > 100 || item.enhancedText.length > 100;
            
            return (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Original
                      </p>
                      <button
                        onClick={() => handleCopy(item.originalText)}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        title="Copy original"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </button>
                    </div>
                    <p className="text-gray-900 text-sm leading-relaxed">
                      {shouldTruncate && !isExpanded
                        ? `${item.originalText.substring(0, 100)}...`
                        : item.originalText}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        ✨ Enhanced
                      </p>
                      <button
                        onClick={() => handleCopy(item.enhancedText)}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        title="Copy enhanced"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </button>
                    </div>
                    <p className="text-gray-900 text-sm leading-relaxed bg-blue-50 p-3 rounded-md border border-blue-100">
                      {shouldTruncate && !isExpanded
                        ? `${item.enhancedText.substring(0, 100)}...`
                        : item.enhancedText}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.creditsConsumed} {item.creditsConsumed === 1 ? "credit" : "credits"}
                      </span>
                    </div>
                    {shouldTruncate && (
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {isExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

