"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "./Toast";
import ManipulationWarning from "./ManipulationWarning";
import type { ManipulationAnalysis } from "@verba/anti-manipulation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

type Tone = "professional" | "casual" | "friendly" | "persuasive" | "empathetic";

// Language options - simplified list for UI
const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "th", name: "Thai", nativeName: "ไทย" },
];

export default function MessageEnhancer() {
  const [text, setText] = useState("");
  const [enhancedText, setEnhancedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tone, setTone] = useState<Tone>("professional");
  const [sourceLanguage, setSourceLanguage] = useState<string>("en");
  const [targetLanguage, setTargetLanguage] = useState<string>("en");
  const [blendLanguages, setBlendLanguages] = useState<string[]>([]);
  const [manipulationAnalysis, setManipulationAnalysis] = useState<ManipulationAnalysis | null>(null);
  const [showManipulationWarning, setShowManipulationWarning] = useState(false);
  const [manipulationCheckLoading, setManipulationCheckLoading] = useState(false);
  const { session } = useAuth();
  const MAX_CHARS = 2000;

  // Check for manipulation when text changes (debounced)
  useEffect(() => {
    if (!text.trim() || text.length < 10) {
      setManipulationAnalysis(null);
      setShowManipulationWarning(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      checkManipulation(text);
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [text]);

  const checkManipulation = async (messageText: string) => {
    if (!messageText.trim()) return;

    setManipulationCheckLoading(true);
    try {
      const token = session?.access_token;
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/manipulation/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: messageText,
          context: {
            relationshipType: "unknown", // Could be enhanced with user settings
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data?.analysis) {
          setManipulationAnalysis(data.data.analysis);
          if (data.data.analysis.shouldBlock || data.data.analysis.shouldWarn) {
            setShowManipulationWarning(true);
          }
        }
      }
    } catch (err) {
      // Silently fail - manipulation check is not critical
      console.error("Manipulation check failed:", err);
    } finally {
      setManipulationCheckLoading(false);
    }
  };

  const handleEnhance = async () => {
    if (!text.trim()) {
      setError("Please enter a message to enhance");
      showToast("Please enter a message to enhance", "warning");
      return;
    }

    if (text.length > MAX_CHARS) {
      setError(`Message is too long. Maximum ${MAX_CHARS} characters.`);
      showToast(`Message is too long. Maximum ${MAX_CHARS} characters.`, "error");
      return;
    }

    // Check if message should be blocked
    if (manipulationAnalysis?.shouldBlock) {
      showToast("Cannot enhance: Message contains severe manipulation patterns", "error");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // #region agent log
      fetch('http://127.0.0.1:3000/ingest/b59568c8-072f-4c86-9b32-c1ab9338f0b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MessageEnhancer.tsx:36',message:'handleEnhance entry',data:{hasSession:!!session,hasToken:!!session?.access_token,apiBaseUrl:API_BASE_URL,textLength:text.length,tone:tone},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const token = session?.access_token;
      // #region agent log
      fetch('http://127.0.0.1:3000/ingest/b59568c8-072f-4c86-9b32-c1ab9338f0b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MessageEnhancer.tsx:38',message:'Token extracted',data:{tokenExists:!!token,tokenLength:token?.length||0,tokenPrefix:token?.substring(0,20)||'none'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      if (!token) {
        throw new Error("Please log in to enhance messages");
      }

      const requestBody: any = {
        text,
        includeContext: false,
        tone: tone,
      };

      // Add language parameters if different from default
      if (sourceLanguage && sourceLanguage !== "en") {
        requestBody.sourceLanguage = sourceLanguage;
      }
      if (targetLanguage && targetLanguage !== sourceLanguage) {
        requestBody.targetLanguage = targetLanguage;
      }
      if (blendLanguages && blendLanguages.length > 0) {
        requestBody.blendLanguages = blendLanguages;
      }
      // #region agent log
      fetch('http://127.0.0.1:3000/ingest/b59568c8-072f-4c86-9b32-c1ab9338f0b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MessageEnhancer.tsx:48',message:'Request body before fetch',data:{requestBody,apiUrl:`${API_BASE_URL}/api/messages/enhance`,hasTone:'tone' in requestBody},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      const response = await fetch(`${API_BASE_URL}/api/messages/enhance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      // #region agent log
      fetch('http://127.0.0.1:3000/ingest/b59568c8-072f-4c86-9b32-c1ab9338f0b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MessageEnhancer.tsx:55',message:'Response received',data:{status:response.status,statusText:response.statusText,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      if (!response.ok) {
        const data = await response.json();
        // #region agent log
        fetch('http://127.0.0.1:3000/ingest/b59568c8-072f-4c86-9b32-c1ab9338f0b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MessageEnhancer.tsx:58',message:'Error response',data:{status:response.status,error:data.error,responseData:data,isValidationError:response.status===400},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (response.status === 402) {
          showToast("Insufficient credits. Please purchase more credits.", "error");
        } else {
          showToast(data.error || "Failed to enhance message", "error");
        }
        throw new Error(data.error || "Failed to enhance message");
      }

      const data = await response.json();
      // #region agent log
      fetch('http://127.0.0.1:3000/ingest/b59568c8-072f-4c86-9b32-c1ab9338f0b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MessageEnhancer.tsx:66',message:'Success response',data:{hasData:!!data.data,hasEnhancedText:!!data.data?.enhancedText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      setEnhancedText(data.data.enhancedText);
      showToast("Message enhanced successfully! 🎉", "success");
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:3000/ingest/b59568c8-072f-4c86-9b32-c1ab9338f0b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MessageEnhancer.tsx:70',message:'Exception caught',data:{errorMessage:err instanceof Error ? err.message : 'Unknown error',errorType:err instanceof Error ? err.constructor.name : typeof err},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      if (!errorMessage.includes("Please log in")) {
        showToast(errorMessage, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    handleEnhance();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(enhancedText);
      showToast("Copied to clipboard! 📋", "success");
    } catch (err) {
      showToast("Failed to copy to clipboard", "error");
    }
  };

  const handleClear = () => {
    setText("");
    setEnhancedText("");
    setError(null);
    setManipulationAnalysis(null);
    setShowManipulationWarning(false);
    setSourceLanguage("en");
    setTargetLanguage("en");
    setBlendLanguages([]);
  };

  const handleDismissWarning = () => {
    setShowManipulationWarning(false);
  };

  const handleProceedWithWarning = () => {
    setShowManipulationWarning(false);
    handleEnhance();
  };

  const handleLearnMore = () => {
    // Could open a modal or navigate to a help page
    window.open("/docs/manipulation-prevention", "_blank");
  };

  const toggleBlendLanguage = (langCode: string) => {
    setBlendLanguages((prev) =>
      prev.includes(langCode)
        ? prev.filter((code) => code !== langCode)
        : [...prev, langCode]
    );
  };

  const tones: { value: Tone; label: string; emoji: string }[] = [
    { value: "professional", label: "Professional", emoji: "💼" },
    { value: "casual", label: "Casual", emoji: "😊" },
    { value: "friendly", label: "Friendly", emoji: "👋" },
    { value: "persuasive", label: "Persuasive", emoji: "💡" },
    { value: "empathetic", label: "Empathetic", emoji: "❤️" },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Enhance Your Message</h2>

      <div className="space-y-4">
        {showManipulationWarning && manipulationAnalysis && (
          <ManipulationWarning
            analysis={manipulationAnalysis}
            onDismiss={handleDismissWarning}
            onProceed={manipulationAnalysis.shouldBlock ? undefined : handleProceedWithWarning}
            onLearnMore={handleLearnMore}
          />
        )}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Your Message
            </label>
            <span
              className={`text-xs ${
                text.length > MAX_CHARS
                  ? "text-red-600 font-semibold"
                  : text.length > MAX_CHARS * 0.9
                  ? "text-yellow-600"
                  : "text-gray-500"
              }`}
            >
              {text.length}/{MAX_CHARS}
            </span>
          </div>
          <textarea
            id="message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here... Try: 'Hey, can we reschedule our meeting?'"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={5}
            maxLength={MAX_CHARS}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tone
          </label>
          <div className="grid grid-cols-5 gap-2">
            {tones.map((t) => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                disabled={loading}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  tone === t.value
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={t.label}
              >
                <span className="block text-lg mb-1">{t.emoji}</span>
                <span className="text-xs">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sourceLanguage" className="block text-sm font-medium text-gray-700 mb-2">
              Source Language
            </label>
            <select
              id="sourceLanguage"
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="targetLanguage" className="block text-sm font-medium text-gray-700 mb-2">
              Target Language
            </label>
            <select
              id="targetLanguage"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {targetLanguage !== sourceLanguage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Translation Blend (Optional)
              <span className="text-xs text-gray-500 ml-2">
                Add cultural elements from other languages
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.filter(
                (lang) => lang.code !== sourceLanguage && lang.code !== targetLanguage
              ).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => toggleBlendLanguage(lang.code)}
                  disabled={loading}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    blendLanguages.includes(lang.code)
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={lang.nativeName}
                >
                  {lang.name}
                </button>
              ))}
            </div>
            {blendLanguages.length > 0 && (
              <p className="mt-2 text-xs text-gray-600">
                Blending with: {blendLanguages.map(code => {
                  const lang = LANGUAGES.find(l => l.code === code);
                  return lang ? lang.name : code;
                }).join(", ")}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleEnhance}
            disabled={loading || !text.trim()}
            className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enhancing...
              </>
            ) : (
              "✨ Enhance Message"
            )}
          </button>
          {text && (
            <button
              onClick={handleClear}
              disabled={loading}
              className="px-4 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Clear"
            >
              Clear
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="font-medium">{error}</p>
                <button
                  onClick={handleRetry}
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && !enhancedText && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6">
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        )}

        {enhancedText && !loading && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                ✨ Enhanced Message
              </label>
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-md p-4">
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                {enhancedText}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Re-enhance
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

