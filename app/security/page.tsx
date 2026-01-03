"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SecurityPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Security</h1>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-xl text-gray-600 mb-8">
              Your security and privacy are our top priorities. Here's how we protect your data.
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Encryption</h2>
              <p>
                All data transmitted to and from Verba is encrypted using industry-standard TLS/SSL 
                encryption. Your messages are encrypted in transit and at rest.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Secure Infrastructure</h2>
              <p>We use:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Secure cloud infrastructure with regular security audits</li>
                <li>Firewall protection and intrusion detection</li>
                <li>Regular security updates and patches</li>
                <li>Access controls and authentication</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Handling</h2>
              <p>
                Your messages are processed securely and are not stored longer than necessary. 
                We do not use your messages to train our models without your explicit consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Security</h2>
              <p>
                All payments are processed through secure, PCI-compliant payment processors. 
                We never store your full payment card information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reporting Security Issues</h2>
              <p>
                If you discover a security vulnerability, please report it to{" "}
                <a href="mailto:security@verba.ai" className="text-blue-600 hover:text-blue-800">
                  security@verba.ai
                </a>
                . We take all security reports seriously and will respond promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Compliance</h2>
              <p>
                We are committed to maintaining compliance with relevant data protection regulations 
                including GDPR and CCPA. For more information, see our{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

