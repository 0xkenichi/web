"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import LandingHero from "../components/LandingHero";
import LandingFeatures from "../components/LandingFeatures";
import LandingCTA from "../components/LandingCTA";
import Logo from "../components/Logo";

// Dynamically import 3D components to avoid SSR issues
const Scene3D = dynamic(() => import("../components/Scene3D"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900" />,
});

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* 3D Background Scene */}
      {mounted && (
        <div className="fixed inset-0 z-0">
          <Scene3D />
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="relative z-20 px-6 py-6 lg:px-12">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Logo size="md" showText={true} textColor="light" />
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/features")}
                className="text-white/80 hover:text-white transition-colors font-medium hidden md:block"
              >
                Features
              </button>
              <button
                onClick={() => router.push("/pricing")}
                className="text-white/80 hover:text-white transition-colors font-medium hidden md:block"
              >
                Pricing
              </button>
              <button
                onClick={() => router.push("/docs")}
                className="text-white/80 hover:text-white transition-colors font-medium hidden md:block"
              >
                Docs
              </button>
              <button
                onClick={() => router.push("/login")}
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <LandingHero onGetStarted={handleGetStarted} />

        {/* Features Section */}
        <LandingFeatures />

        {/* CTA Section */}
        <LandingCTA onGetStarted={handleGetStarted} />
      </div>

      {/* Gradient Overlays for better text readability */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-gray-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900/50 to-transparent" />
      </div>
    </div>
  );
}


