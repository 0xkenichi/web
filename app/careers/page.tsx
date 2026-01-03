"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CareersPage() {
  const router = useRouter();

  const openPositions = [
    {
      title: "Senior Full-Stack Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build and scale our AI-powered communication platform.",
    },
    {
      title: "AI/ML Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Improve our language models and translation algorithms.",
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Design beautiful and intuitive user experiences.",
    },
    {
      title: "Growth Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Drive user acquisition and growth strategies.",
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">We're Hiring! 🚀</h1>
          <p className="text-xl text-gray-600 mb-2">
            Join us in building the future of AI-powered communication
          </p>
          <p className="text-lg text-gray-500">
            We're a remote-first team passionate about breaking down language barriers
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why Work at Verba?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">🌍 Remote First</h3>
              <p className="text-gray-600">Work from anywhere in the world</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">💡 Impact</h3>
              <p className="text-gray-600">Help millions communicate better</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">🚀 Growth</h3>
              <p className="text-gray-600">Fast-paced startup environment</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">🤝 Team</h3>
              <p className="text-gray-600">Collaborative and supportive culture</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Open Positions</h2>
          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      <span>{position.department}</span>
                      <span>•</span>
                      <span>{position.location}</span>
                      <span>•</span>
                      <span>{position.type}</span>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                    Hiring
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{position.description}</p>
                <a
                  href={`mailto:careers@verba.ai?subject=Application: ${position.title}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Don't see a role that fits? We'd still love to hear from you!
          </p>
          <a
            href="mailto:careers@verba.ai"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Send Us Your Resume
          </a>
        </div>
      </main>
    </div>
  );
}

