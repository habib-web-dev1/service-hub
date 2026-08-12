"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-white">
          ServiceHub
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/services" className="text-slate-300 hover:text-white">
            Services
          </Link>

          {token ? (
            <>
              <Link
                href="/bookings"
                className="text-slate-300 hover:text-white"
              >
                My Bookings
              </Link>

              <button
                onClick={logout}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-300 hover:text-white">
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
