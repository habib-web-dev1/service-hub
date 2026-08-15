"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  User,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { logout as authLogout } from "@/lib/auth";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setToken(localStorage.getItem("token"));

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    authLogout();
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-50 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hover:opacity-90"
        >
          ServiceHub
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/services"
            className={`text-sm font-medium transition ${
              pathname === "/services"
                ? "text-cyan-400"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Services
          </Link>

          {mounted && token && user ? (
            <>
              {/* Customer specific links */}
              {user.role === "CUSTOMER" && (
                <Link
                  href="/bookings"
                  className={`flex items-center gap-1 text-sm font-medium transition ${
                    pathname === "/bookings"
                      ? "text-cyan-400"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  My Bookings
                </Link>
              )}

              {/* Provider specific links */}
              {user.role === "PROVIDER" && (
                <>
                  <Link
                    href="/provider"
                    className={`flex items-center gap-1 text-sm font-medium transition ${
                      pathname === "/provider"
                        ? "text-cyan-400"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <Link
                    href="/provider/bookings"
                    className={`flex items-center gap-1 text-sm font-medium transition ${
                      pathname === "/provider/bookings"
                        ? "text-cyan-400"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <ClipboardList className="h-4 w-4" />
                    Bookings
                  </Link>
                </>
              )}

              {/* Admin specific links */}
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1 text-sm font-medium transition ${
                    pathname === "/admin"
                      ? "text-cyan-400"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <ShieldAlert className="h-4 w-4 text-cyan-400 animate-pulse" />
                  Admin Panel
                </Link>
              )}

              <Link
                href="/profile"
                className={`flex items-center gap-1 text-sm font-medium transition ${
                  pathname === "/profile"
                    ? "text-cyan-400"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : mounted ? (
            <>
              <Link
                href="/login"
                className={`text-sm font-medium transition ${
                  pathname === "/login"
                    ? "text-cyan-400"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-linear-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-95 hover:shadow-md cursor-pointer"
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
