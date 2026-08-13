"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

interface Service {
  id: string;
  title: string;
  price: string | number;
  duration: number | null;
}

interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  status: string;
  scheduledAt: string;
  notes: string | null;
}

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const serviceId = searchParams.get("serviceId");

  const [service, setService] = useState<Service | null>(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!serviceId) {
      setError("No service selected.");
      setLoading(false);
      return;
    }

    const loadService = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await api.get<Service>(`/services/${serviceId}`);

        setService(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load service.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [serviceId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!serviceId) {
      setError("No service selected.");
      return;
    }

    if (!scheduledAt) {
      setError("Please select a date and time.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await api.post<Booking>("/bookings", {
        serviceId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        notes: notes.trim() || undefined,
      });

      setSuccess("Booking created successfully!");

      setTimeout(() => {
        router.push("/bookings");
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create booking.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading booking page...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/services"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Services
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h1 className="text-3xl font-bold">Book a Service</h1>

          <p className="mt-2 text-slate-400">
            Choose a date and time for your service.
          </p>

          {service && (
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5">
              <h2 className="text-xl font-semibold">{service.title}</h2>

              <div className="mt-3 flex gap-6 text-sm text-slate-400">
                <span>
                  Price:{" "}
                  <strong className="text-cyan-400">
                    ${Number(service.price).toFixed(2)}
                  </strong>
                </span>

                <span>
                  Duration:{" "}
                  <strong className="text-white">
                    {service.duration ? `${service.duration} min` : "Flexible"}
                  </strong>
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-400">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="scheduledAt"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Date & Time
              </label>

              <input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) => setScheduledAt(event.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Notes
              </label>

              <textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={5}
                placeholder="Add any additional information..."
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !service}
              className="w-full rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Creating Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function BookingLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

        <p className="text-slate-400">Loading booking page...</p>
      </div>
    </main>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<BookingLoading />}>
      <BookingForm />
    </Suspense>
  );
}
