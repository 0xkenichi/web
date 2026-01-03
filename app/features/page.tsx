"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FeaturesPage() {
  const router = useRouter();

  const features = [
    {
      icon: "✨",
      title: "Message Enhancement",
      description: "Transform your messages to be more engaging, professional, or casual based on your needs.",
    },
    {
      icon: "🌍",
      title: "Multi-Language Support",
      description: "Translate and enhance messages across 18+ languages with cultural context awareness.",
    },
    {
      icon: "🎨",
      title: "Translation Blending",
      description: "Blend cultural elements from multiple languages for more nuanced communication.",
    },
    {
      icon: "💼",
      title: "Tone Selection",
      description: "Choose from professional, casual, friendly, persuasive, or empathetic tones.",
    },
    {
      icon: "📚",
      title: "Translation History",
      description: "Keep track of all your enhanced messages and translations in one place.",
    },
    {
      icon: "🔒",
      title: "Privacy First",
      description: "Your messages are processed securely and never stored longer than necessary.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Verba</span>
          </button>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Pricing
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Features</h1>
          <p className="text-xl text-gray-600">
            Everything you need to communicate more effectively
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/pricing"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}

