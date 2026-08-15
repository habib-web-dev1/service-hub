"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { User, Briefcase } from "lucide-react";

interface RegisterResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: "CUSTOMER" | "PROVIDER";
  };
  token: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER">("CUSTOMER");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await api.post<RegisterResponse>("/auth/register", {
        name,
        email,
        password,
        phone: phone || null,
        role,
      });

      saveAuth(result.token, result.user);

      // Redirect based on role
      if (result.user.role === "PROVIDER") {
        router.push("/provider");
      } else {
        router.push("/services");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="mt-2 text-slate-400">
              Join ServiceHub today as a client or partner
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Choose Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("CUSTOMER")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all duration-200 cursor-pointer ${
                    role === "CUSTOMER"
                      ? "border-cyan-400 bg-cyan-950/20 text-cyan-400 shadow-md shadow-cyan-500/5"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <User className="h-6 w-6 mb-2" />
                  <span className="text-sm font-semibold">Customer</span>
                  <span className="text-xs text-slate-500 mt-1">
                    I want to hire services
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("PROVIDER")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all duration-200 cursor-pointer ${
                    role === "PROVIDER"
                      ? "border-blue-400 bg-blue-950/20 text-blue-400 shadow-md shadow-blue-500/5"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <Briefcase className="h-6 w-6 mb-2" />
                  <span className="text-sm font-semibold">
                    Service Provider
                  </span>
                  <span className="text-xs text-slate-500 mt-1">
                    I want to offer services
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
                minLength={2}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Phone
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+880..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-linear-to-r from-cyan-500 to-blue-500 px-6 py-3 font-semibold text-slate-950 transition hover:opacity-95 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-cyan-400 hover:text-cyan-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
