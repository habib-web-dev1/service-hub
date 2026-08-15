"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ProviderDashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-cyan-400">
              Provider Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Welcome{user?.name ? `, ${user.name}` : ""}
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your services and keep track of your business.
            </p>
          </div>

          <Link
            href="/provider/services/new"
            className="rounded-lg bg-cyan-500 px-5 py-3 text-center font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            + Create Service
          </Link>
        </div>

        {/* Statistics */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">Total Services</p>

            <p className="mt-3 text-4xl font-bold text-white">—</p>

            <p className="mt-2 text-sm text-slate-400">
              Your published services
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">Active Services</p>

            <p className="mt-3 text-4xl font-bold text-cyan-400">—</p>

            <p className="mt-2 text-sm text-slate-400">
              Currently available services
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">Bookings</p>

            <p className="mt-3 text-4xl font-bold text-white">—</p>

            <p className="mt-2 text-sm text-slate-400">Customer bookings</p>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Quick Actions</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Link
              href="/provider/services"
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-500/50 hover:bg-slate-900/80"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Manage Services</h3>

                <span className="text-xl text-cyan-400 transition group-hover:translate-x-1">
                  →
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                View, edit, activate, or deactivate the services you provide.
              </p>
            </Link>

            <Link
              href="/provider/services/new"
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-500/50 hover:bg-slate-900/80"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Create a Service</h3>

                <span className="text-xl text-cyan-400 transition group-hover:translate-x-1">
                  →
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Add a new service that customers can discover and book.
              </p>
            </Link>
          </div>
        </section>

        {/* Account Information */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Account</h2>

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Name</p>

                <p className="mt-1 text-slate-200">{user?.name || "—"}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Email</p>

                <p className="mt-1 text-slate-200">{user?.email || "—"}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Role</p>

                <p className="mt-1 font-medium text-cyan-400">
                  {user?.role || "PROVIDER"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
