"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BlogPage() {
  const router = useRouter();

  const posts = [
    {
      title: "How to Write Professional Emails That Get Responses",
      excerpt: "Learn the art of crafting emails that command attention and get the responses you need.",
      date: "March 15, 2024",
      category: "Communication",
    },
    {
      title: "Breaking Down Language Barriers with AI",
      excerpt: "Discover how AI-powered translation is making global communication easier than ever.",
      date: "March 10, 2024",
      category: "Technology",
    },
    {
      title: "Cultural Nuances in Business Communication",
      excerpt: "Understanding cultural differences can make or break your international business relationships.",
      date: "March 5, 2024",
      category: "Business",
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600">
            Tips, insights, and stories about communication and language
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post, index) => (
            <article
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {post.category}
                </span>
                <span className="text-xs text-gray-500">{post.date}</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <Link
                href="#"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500">
          <p>More articles coming soon!</p>
        </div>
      </main>
    </div>
  );
}

