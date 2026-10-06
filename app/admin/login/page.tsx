"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/orders");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="border-b border-black/10 px-6 py-6 md:px-10">
        <h1 className="text-2xl font-black">MUSCOD</h1>
      </div>

      <section className="mx-auto flex min-h-[80vh] max-w-md items-center px-6">
        <div className="w-full">
          <p className="text-xs font-bold uppercase tracking-[0.3em]">
            MUSCOD / ADMIN
          </p>

          <h2 className="mt-4 text-5xl font-black uppercase">
            Login
          </h2>

          <p className="mt-3 text-sm text-neutral-500">
            Sign in to manage MUSCOD orders.
          </p>

          <form onSubmit={handleLogin} className="mt-10 space-y-6">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-black px-4 py-4 outline-none"
                placeholder="Admin email"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-black px-4 py-4 outline-none"
                placeholder="Password"
              />
            </div>

            {errorMessage && (
              <p className="text-sm font-bold text-red-600">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}