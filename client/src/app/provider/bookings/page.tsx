"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { api } from "@/lib/api";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Service {
  id: string;
  title: string;
  price: string | number;
  duration: number | null;
  category?: Category;
}

interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  scheduledAt: string;
  notes: string | null;
  service: Service;
  customer: Customer;
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
      className={`rounded-full px-3 py-1 text-sm font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

        <p className="text-slate-400">Loading provider bookings...</p>
      </div>
    </main>
  );
}

export default function ProviderBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await api.get<Booking[]>("/bookings/provider");

      setBookings(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load provider bookings.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateStatus = async (
    bookingId: string,
    status: "CONFIRMED" | "COMPLETED",
  ) => {
    try {
      setUpdatingId(bookingId);
      setError("");
      setSuccess("");

      await api.patch(`/bookings/${bookingId}/status`, {
        status,
      });

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking,
        ),
      );

      setSuccess(
        status === "CONFIRMED"
          ? "Booking confirmed successfully."
          : "Booking marked as completed successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update booking status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/provider/services"
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              ← Back to My Services
            </Link>

            <h1 className="mt-4 text-3xl font-bold">Provider Bookings</h1>

            <p className="mt-2 text-slate-400">
              Manage bookings made for your services.
            </p>
          </div>

          <Link
            href="/provider/services"
            className="rounded-lg border border-slate-700 px-5 py-3 text-center font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
          >
            My Services
          </Link>
        </div>

        {error && (
          <div className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-8 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-400">
            {success}
          </div>
        )}

        {bookings.length === 0 && !error && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h2 className="text-xl font-semibold">No bookings yet</h2>

            <p className="mt-2 text-slate-400">
              Customers haven&apos;t booked any of your services yet.
            </p>
          </div>
        )}

        {bookings.length > 0 && (
          <div className="mt-8 space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold">
                        {booking.service.title}
                      </h2>

                      <StatusBadge status={booking.status} />
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Booking ID: {booking.id}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {booking.status === "PENDING" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(booking.id, "CONFIRMED")}
                        disabled={updatingId === booking.id}
                        className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingId === booking.id
                          ? "Updating..."
                          : "Confirm Booking"}
                      </button>
                    )}

                    {booking.status === "CONFIRMED" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(booking.id, "COMPLETED")}
                        disabled={updatingId === booking.id}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingId === booking.id
                          ? "Updating..."
                          : "Mark Completed"}
                      </button>
                    )}

                    <Link
                      href={`/bookings/${booking.id}`}
                      className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
                    >
                      View Booking Details
                    </Link>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 border-t border-slate-800 pt-6 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-slate-500">Customer</p>

                    <p className="mt-1 font-medium text-slate-200">
                      {booking.customer.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Email</p>

                    <p className="mt-1 break-all text-slate-300">
                      {booking.customer.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Scheduled</p>

                    <p className="mt-1 text-slate-200">
                      {new Date(booking.scheduledAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Price</p>

                    <p className="mt-1 text-cyan-400">
                      ${Number(booking.service.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                {booking.customer.phone && (
                  <div className="mt-5">
                    <p className="text-sm text-slate-500">Phone</p>

                    <p className="mt-1 text-slate-300">
                      {booking.customer.phone}
                    </p>
                  </div>
                )}

                {booking.notes && (
                  <div className="mt-5 border-t border-slate-800 pt-5">
                    <p className="text-sm text-slate-500">Customer Notes</p>

                    <p className="mt-1 text-slate-300">{booking.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
