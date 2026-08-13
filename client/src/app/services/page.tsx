"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string | number;
  duration: number | null;
  categoryId: string;
  providerId: string;
  isActive: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  provider?: {
    id: string;
    name: string;
    email: string;
  };
}

interface ServicesResponse {
  data: Service[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await api.get<ServicesResponse>("/services");

        setServices(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load services",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <Link
            href="/"
            className="mb-6 inline-block text-sm text-cyan-400 transition hover:text-cyan-300"
          >
            ← Back to Home
          </Link>

          <h1 className="text-4xl font-bold tracking-tight">
            Available Services
          </h1>

          <p className="mt-3 text-slate-400">
            Find trusted professionals for your service needs.
          </p>
        </div>

        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

              <p className="text-slate-400">Loading services...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
            <h2 className="text-lg font-semibold text-red-400">
              Failed to load services
            </h2>

            <p className="mt-2 text-sm text-red-300">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && services.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h2 className="text-xl font-semibold">No services available</h2>

            <p className="mt-2 text-slate-400">
              There are currently no active services.
            </p>
          </div>
        )}

        {!loading && !error && services.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                {services.length} service
                {services.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-cyan-500/50"
                >
                  {service.category && (
                    <span className="mb-4 w-fit rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                      {service.category.name}
                    </span>
                  )}

                  <h2 className="text-xl font-semibold">{service.title}</h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                    {service.description}
                  </p>

                  <div className="mt-6">
                    <span className="text-2xl font-bold text-cyan-400">
                      ${Number(service.price).toFixed(2)}
                    </span>
                  </div>

                  {/* Duration */}
                  {service.duration !== null && (
                    <p className="mt-2 text-sm text-slate-500">
                      Duration: {service.duration} minutes
                    </p>
                  )}

                  {/* Provider */}
                  {service.provider && (
                    <div className="mt-5 border-t border-slate-800 pt-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Provider
                      </p>

                      <p className="mt-1 font-medium text-slate-200">
                        {service.provider.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        {service.provider.email}
                      </p>
                    </div>
                  )}

                  {/* Button */}
                  <div className="mt-auto pt-6">
                    <Link
                      href={`/services/${service.id}`}
                      className="block w-full rounded-lg bg-cyan-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                      View Service
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
