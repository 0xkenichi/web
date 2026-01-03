"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import Logo from "../components/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        // User created, check if email confirmation is needed
        setError(
          "Check your email for the confirmation link, or sign in if already confirmed."
        );
      }
    } catch (err: any) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--verba-cloud)]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border border-[var(--verba-line)]">
        <div className="flex flex-col items-center">
          <Logo size="lg" showText={true} />
          <p className="mt-4 text-center text-[var(--verba-slate)]">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-[var(--verba-line)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--verba-indigo)] focus:border-[var(--verba-indigo)]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-[var(--verba-line)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--verba-indigo)] focus:border-[var(--verba-indigo)]"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 verba-gradient text-white py-2 px-4 rounded-md hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="flex-1 bg-[var(--verba-slate)] text-white py-2 px-4 rounded-md hover:bg-[var(--verba-ink)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
