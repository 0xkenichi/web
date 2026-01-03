"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8">Last updated: March 2024</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p>
                By accessing and using Verba, you accept and agree to be bound by the terms and 
                provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use License</h2>
              <p>
                Permission is granted to temporarily use Verba for personal and commercial purposes. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose without authorization</li>
                <li>Attempt to reverse engineer any software contained in Verba</li>
                <li>Remove any copyright or other proprietary notations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
              <p>
                We strive to provide reliable service but do not guarantee uninterrupted access. 
                We reserve the right to modify or discontinue the service at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
              <p>You agree to:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Provide accurate account information</li>
                <li>Maintain the security of your account</li>
                <li>Not use the service for illegal purposes</li>
                <li>Not abuse or attempt to abuse the service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p>
                Verba shall not be liable for any indirect, incidental, special, consequential, or 
                punitive damages resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
              <p>
                For questions about these Terms, contact us at{" "}
                <a href="mailto:legal@verba.ai" className="text-blue-600 hover:text-blue-800">
                  legal@verba.ai
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

