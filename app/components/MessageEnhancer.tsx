"use client";

import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export default function MessageEnhancer() {
  const [text, setText] = useState("");
  const [enhancedText, setEnhancedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnhance = async () => {
    if (!text.trim()) {
      setError("Please enter a message to enhance");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get Supabase session token
      const supabase = (await import("../../../utils/supabase/client")).createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch(`${API_BASE_URL}/api/messages/enhance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          text,
          includeContext: false,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to enhance message");
      }

      const data = await response.json();
      setEnhancedText(data.data.enhancedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedText);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Enhance Your Message</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Your Message
          </label>
          <textarea
            id="message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={4}
          />
        </div>

        <button
          onClick={handleEnhance}
          disabled={loading || !text.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Enhancing..." : "Enhance Message"}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {enhancedText && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Enhanced Message
              </label>
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Copy
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{enhancedText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

