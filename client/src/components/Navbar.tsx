"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setToken(localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-cyan-400">
          ServiceHub
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/services"
            className="text-slate-300 transition hover:text-white"
          >
            Services
          </Link>

          {mounted && token ? (
            <>
              <Link
                href="/bookings"
                className="text-slate-300 transition hover:text-white"
              >
                My Bookings
              </Link>

              <Link
                href="/profile"
                className="text-slate-300 transition hover:text-white"
              >
                Profile
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
              >
                Logout
              </button>
            </>
          ) : mounted ? (
            <>
              <Link
                href="/login"
                className="text-slate-300 transition hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Register
              </Link>
            </>
          ) : (
            // Keep server and initial client render identical.
            <div className="h-9 w-32" />
          )}
        </div>
      </nav>
    </header>
  );
}
