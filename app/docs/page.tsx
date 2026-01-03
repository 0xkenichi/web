"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "../components/Logo";

export default function DocsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Logo size="md" showText={true} />
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
          <p className="text-lg text-gray-600 mb-8">
            Learn how to use Verba to enhance your conversations and communicate more effectively.
          </p>

          <div className="space-y-8">
            {/* Getting Started */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">1. Create an Account</h3>
                  <p>Sign up for a free account to get started with 100 credits per month.</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">2. Enhance Your First Message</h3>
                  <p>Paste your message, select your preferred tone, and let AI enhance it for better communication.</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">3. Choose Languages</h3>
                  <p>Select source and target languages, and optionally blend cultural elements from multiple languages.</p>
                </div>
              </div>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Message Enhancement</h3>
                  <p>Transform your messages to be more engaging, professional, or casual based on your needs.</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Multi-Language Support</h3>
                  <p>Translate and enhance messages across 18+ languages with cultural context awareness.</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Translation Blending</h3>
                  <p>Blend cultural elements from multiple languages for more nuanced communication.</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Tone Selection</h3>
                  <p>Choose from professional, casual, friendly, persuasive, or empathetic tones.</p>
                </div>
              </div>
            </section>

            {/* API */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">API Reference</h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">API documentation coming soon.</p>
                <p className="text-sm text-gray-600">
                  For now, use the web interface to enhance your messages. API access will be available for premium users.
                </p>
              </div>
            </section>

            {/* Support */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help?</h2>
              <div className="space-y-2 text-gray-700">
                <p>Check out our <Link href="/faq" className="text-blue-600 hover:text-blue-800 underline">FAQ</Link> for common questions.</p>
                <p>Contact us at <a href="mailto:support@verba.ai" className="text-blue-600 hover:text-blue-800 underline">support@verba.ai</a> for support.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

