"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  };
  provider?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!serviceId) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await api.get<Service>(`/services/${serviceId}`);

        setService(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load service");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleBooking = () => {
    router.push(`/bookings?serviceId=${serviceId}`);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="text-slate-400">Loading service...</p>
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/services"
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            ← Back to Services
          </Link>

          <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-8">
            <h1 className="text-2xl font-bold text-red-400">
              Service not found
            </h1>

            <p className="mt-3 text-red-300">
              {error || "The requested service could not be found."}
            </p>

            <Link
              href="/services"
              className="mt-6 inline-block rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link
          href="/services"
          className="text-sm text-cyan-400 transition hover:text-cyan-300"
        >
          ← Back to Services
        </Link>

        {/* Main Card */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="p-8 md:p-10">
            {/* Category */}
            {service.category && (
              <span className="inline-block rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400">
                {service.category.name}
              </span>
            )}

            {/* Title */}
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
              {service.title}
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg leading-8 text-slate-400">
              {service.description}
            </p>

            {/* Price / Duration */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm text-slate-500">Price</p>

                <p className="mt-2 text-3xl font-bold text-cyan-400">
                  ${Number(service.price).toFixed(2)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm text-slate-500">Duration</p>

                <p className="mt-2 text-3xl font-bold">
                  {service.duration ? `${service.duration} min` : "Flexible"}
                </p>
              </div>
            </div>

            {/* Provider */}
            {service.provider && (
              <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-6">
                <p className="text-sm uppercase tracking-wide text-slate-500">
                  Service Provider
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {service.provider.name}
                </h2>

                <p className="mt-1 text-slate-400">{service.provider.email}</p>

                {service.provider.phone && (
                  <p className="mt-1 text-slate-400">
                    {service.provider.phone}
                  </p>
                )}
              </div>
            )}

            {/* Booking */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleBooking}
                className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Book This Service
              </button>

              <Link
                href="/services"
                className="rounded-lg border border-slate-700 px-6 py-3 text-center font-semibold transition hover:bg-slate-800"
              >
                Browse More Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
