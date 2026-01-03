"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AboutPage() {
  const router = useRouter();

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Verba</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8">
              Verba is an AI-powered conversation coach that helps people communicate more effectively 
              across languages and cultures. We believe that great communication is the foundation of 
              meaningful connections.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                To break down language barriers and help people express themselves with confidence, 
                whether they're writing a professional email, chatting with friends, or connecting 
                with people from different cultures.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Do</h2>
              <p className="text-gray-700 mb-4">
                Verba uses advanced AI to enhance your messages, translate between languages, and 
                adapt your communication style to match your goals. Our platform understands cultural 
                nuances and helps you communicate in a way that resonates with your audience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Accessibility:</strong> Great communication should be available to everyone</li>
                <li><strong>Cultural Sensitivity:</strong> We respect and celebrate linguistic diversity</li>
                <li><strong>Privacy:</strong> Your conversations are yours alone</li>
                <li><strong>Innovation:</strong> We continuously improve our AI to serve you better</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join Us</h2>
              <p className="text-gray-700 mb-4">
                Interested in working with us? Check out our <Link href="/careers" className="text-blue-600 hover:text-blue-800 underline">open positions</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

