"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./contexts/AuthContext";
import MessageEnhancer from "./components/MessageEnhancer";
import CreditBalance from "./components/CreditBalance";
import TranslationHistory from "./components/TranslationHistory";
import Logo from "./components/Logo";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"enhance" | "history">("enhance");
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/landing");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--verba-cloud)]">
      <header className="bg-white shadow-sm border-b border-[var(--verba-line)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Logo size="md" showText={true} />
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/docs")}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium hidden md:block"
            >
              Docs
            </button>
            <button
              onClick={() => router.push("/pricing")}
              className="text-sm text-[var(--verba-indigo)] hover:text-[var(--verba-cyan)] font-medium transition-colors"
            >
              Pricing
            </button>
            <span className="text-sm text-[var(--verba-slate)] hidden sm:block">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-[var(--verba-indigo)] hover:text-[var(--verba-cyan)] font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <CreditBalance />
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("enhance")}
                className={`${
                  activeTab === "enhance"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Enhance Message
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`${
                  activeTab === "history"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                History
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "enhance" && <MessageEnhancer />}
        {activeTab === "history" && <TranslationHistory />}
      </main>
    </div>
  );
}
