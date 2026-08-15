"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { api } from "@/lib/api";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string | number;
  duration: number | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  scheduledAt: string;
  notes: string | null;
  service: Service & {
    provider: User;
  };
  customer: User;
}

export default function BookingDetailsPage() {
  const params = useParams();

  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!bookingId) {
      return;
    }

    const loadBooking = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await api.get<Booking>(`/bookings/${bookingId}`);

        setBooking(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load booking.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  const handleCancel = async () => {
    if (!booking) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setError("");
      setSuccess("");

      const result = await api.patch<Booking>(`/bookings/${booking.id}/cancel`);

      setBooking((current) =>
        current
          ? {
              ...current,
              status: result.status,
            }
          : current,
      );

      setSuccess("Booking cancelled successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel booking.",
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <BookingDetailsLoading />;
  }

  if (error && !booking) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/bookings"
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            ← Back to My Bookings
          </Link>

          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/bookings"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to My Bookings
        </Link>

        <div className="mt-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-500">Booking Details</p>

              <h1 className="mt-1 text-3xl font-bold">
                {booking.service.title}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Booking ID: {booking.id}
              </p>
            </div>

            <StatusBadge status={booking.status} />
          </div>

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

          {/* Service */}
          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Service Information</h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm text-slate-500">Service</p>

                <p className="mt-1 text-lg font-medium text-white">
                  {booking.service.title}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Description</p>

                <p className="mt-1 text-slate-300">
                  {booking.service.description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Price</p>

                  <p className="mt-1 text-cyan-400">
                    ${Number(booking.service.price).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Duration</p>

                  <p className="mt-1 text-slate-200">
                    {booking.service.duration
                      ? `${booking.service.duration} min`
                      : "Flexible"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Booking */}
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Booking Information</h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Status</p>

                <div className="mt-2">
                  <StatusBadge status={booking.status} />
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500">Scheduled At</p>

                <p className="mt-1 text-slate-200">
                  {new Date(booking.scheduledAt).toLocaleString()}
                </p>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-6 border-t border-slate-800 pt-5">
                <p className="text-sm text-slate-500">Notes</p>

                <p className="mt-1 text-slate-300">{booking.notes}</p>
              </div>
            )}
          </section>

          {/* Provider */}
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Provider Information</h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Name</p>

                <p className="mt-1 text-slate-200">
                  {booking.service.provider.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Email</p>

                <p className="mt-1 text-slate-200">
                  {booking.service.provider.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Phone</p>

                <p className="mt-1 text-slate-200">
                  {booking.service.provider.phone ?? "Not provided"}
                </p>
              </div>
            </div>
          </section>

          {/* Customer */}
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Customer Information</h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Name</p>

                <p className="mt-1 text-slate-200">{booking.customer.name}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Email</p>

                <p className="mt-1 text-slate-200">{booking.customer.email}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Phone</p>

                <p className="mt-1 text-slate-200">
                  {booking.customer.phone ?? "Not provided"}
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/bookings"
              className="rounded-lg border border-slate-700 px-5 py-3 text-center font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
            >
              Back to Bookings
            </Link>

            {booking.status !== "COMPLETED" &&
              booking.status !== "CANCELLED" && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="rounded-lg bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Cancel Booking"}
                </button>
              )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const styles = {
    PENDING: "bg-yellow-500/10 text-yellow-400",
    CONFIRMED: "bg-green-500/10 text-green-400",
    COMPLETED: "bg-blue-500/10 text-blue-400",
    CANCELLED: "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function BookingDetailsLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

        <p className="text-slate-400">Loading booking details...</p>
      </div>
    </main>
  );
}
