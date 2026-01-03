"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PrivacyPage() {
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
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8">Last updated: March 2024</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p>
                At Verba, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, and protect your personal information when you use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <p>We collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Account information (email, name)</li>
                <li>Messages you submit for enhancement (processed but not permanently stored)</li>
                <li>Usage data and analytics</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Provide and improve our services</li>
                <li>Process your requests and transactions</li>
                <li>Send you important updates about our service</li>
                <li>Analyze usage patterns to improve our AI models</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your data, including 
                encryption, secure servers, and regular security audits.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Access your personal data</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@verba.ai" className="text-blue-600 hover:text-blue-800">
                  privacy@verba.ai
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

