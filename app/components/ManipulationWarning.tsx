"use client";

import { useState } from "react";
import type { ManipulationAnalysis } from "@verba/anti-manipulation";

interface ManipulationWarningProps {
  analysis: ManipulationAnalysis;
  onDismiss?: () => void;
  onProceed?: () => void;
  onLearnMore?: () => void;
}

export default function ManipulationWarning({
  analysis,
  onDismiss,
  onProceed,
  onLearnMore,
}: ManipulationWarningProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 border-red-700";
      case "high":
        return "bg-orange-600 border-orange-700";
      case "medium":
        return "bg-yellow-600 border-yellow-700";
      case "low":
        return "bg-blue-600 border-blue-700";
      default:
        return "bg-gray-600 border-gray-700";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return "🚨";
      case "high":
        return "⚠️";
      case "medium":
        return "⚡";
      case "low":
        return "💡";
      default:
        return "ℹ️";
    }
  };

  if (analysis.shouldBlock) {
    return (
      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🚫</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-red-900 mb-2">
              Message Blocked: Manipulation Detected
            </h3>
            <p className="text-red-800 mb-4">
              Your message contains severe manipulation patterns that could harm
              relationships. We cannot enhance this message as written.
            </p>

            <div className="bg-white rounded-md p-4 mb-4 border border-red-200">
              <h4 className="font-semibold text-gray-900 mb-2">Detected Issues:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {analysis.indicators.slice(0, 3).map((indicator, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{indicator.type.replace(/_/g, " ")}</span>:{" "}
                    {indicator.explanation}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 rounded-md p-4 mb-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">💡 How to Fix:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-50 rounded-md p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">📚 Learn More:</h4>
              <p className="text-sm text-purple-800">{analysis.educationalMessage}</p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={onDismiss}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                I'll Rewrite It
              </button>
              {onLearnMore && (
                <button
                  onClick={onLearnMore}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
                >
                  Learn About Healthy Communication
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (analysis.shouldWarn) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-5 shadow-md">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{getSeverityIcon(analysis.overallSeverity)}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-yellow-900">
                Manipulation Warning
              </h3>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold text-white ${getSeverityColor(
                  analysis.overallSeverity
                )}`}
              >
                {analysis.overallSeverity.toUpperCase()}
              </span>
            </div>

            <p className="text-yellow-800 mb-3">
              Your message contains patterns that could be interpreted as manipulative.
              Consider revising for healthier communication.
            </p>

            <div className="bg-white rounded-md p-3 mb-3 border border-yellow-200">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <span>View Details</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-yellow-200 space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">
                      Detected Patterns:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
                      {analysis.indicators.slice(0, 3).map((indicator, idx) => (
                        <li key={idx}>
                          <span className="font-medium">
                            {indicator.type.replace(/_/g, " ")}
                          </span>
                          : {indicator.explanation}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">
                      Recommendations:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
                      {analysis.recommendations.slice(0, 2).map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded p-2 border border-blue-200">
                    <p className="text-xs text-blue-800">{analysis.educationalMessage}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-yellow-800">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span>I understand and want to proceed</span>
              </label>
            </div>

            <div className="mt-3 flex gap-2">
              {onProceed && (
                <button
                  onClick={onProceed}
                  disabled={!acknowledged}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  Proceed Anyway
                </button>
              )}
              <button
                onClick={onDismiss}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium text-sm"
              >
                I'll Revise
              </button>
              {onLearnMore && (
                <button
                  onClick={onLearnMore}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Learn More
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

