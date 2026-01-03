"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FAQPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does Verba work?",
      answer: "Verba uses advanced AI to enhance your messages. Simply paste your text, select your preferred tone and languages, and Verba will improve it for better communication.",
    },
    {
      question: "What languages are supported?",
      answer: "Verba supports 18+ languages including English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Arabic, Russian, and more.",
    },
    {
      question: "How much does it cost?",
      answer: "We offer a free tier with 100 credits per month. Premium plans start at $9.99/month with unlimited credits and advanced features.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take privacy seriously. Your messages are processed securely and never stored longer than necessary. We use industry-standard encryption.",
    },
    {
      question: "Can I use Verba for business?",
      answer: "Absolutely! Verba is perfect for professional communication, helping you write better emails, proposals, and business messages.",
    },
    {
      question: "What is translation blending?",
      answer: "Translation blending allows you to incorporate cultural elements from multiple languages into your message, creating more nuanced and culturally aware communication.",
    },
    {
      question: "Do you offer API access?",
      answer: "API access is coming soon and will be available for premium users. Stay tuned for updates!",
    },
    {
      question: "How accurate are the translations?",
      answer: "Our AI models are trained on high-quality data and provide accurate translations with cultural context. However, we always recommend reviewing important messages.",
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about Verba
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={index}>
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
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
                {openIndex === index && (
                  <div className="px-6 pb-4 text-gray-700">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Contact Us
          </Link>
        </div>
      </main>
    </div>
  );
}

