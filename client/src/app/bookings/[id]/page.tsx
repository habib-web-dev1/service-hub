"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { api } from "@/lib/api";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

interface Service {
  id: string;
  title: string;
  description: string | null;
  price: string | number;
  duration: number | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  status: BookingStatus;
  scheduledAt: string;
  notes: string | null;
  createdAt?: string;
  updatedAt?: string;
  service: Service;
  customer: Customer;
}

export default function ProviderBookingDetailsPage() {
  const params = useParams();

  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
          err instanceof Error
            ? err.message
            : "Failed to load booking details.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  const updateStatus = async (status: BookingStatus) => {
    if (!booking) {
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const result = await api.patch<Booking>(
        `/bookings/${booking.id}/status`,
        {
          status,
        },
      );

      setBooking(result);

      setSuccess(
        status === "CONFIRMED"
          ? "Booking confirmed successfully."
          : status === "COMPLETED"
            ? "Booking marked as completed."
            : "Booking cancelled successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update booking status.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = (status: BookingStatus) => {
    if (!booking) {
      return;
    }

    const message =
      status === "CONFIRMED"
        ? "Are you sure you want to confirm this booking?"
        : status === "COMPLETED"
          ? "Are you sure you want to mark this booking as completed?"
          : "Are you sure you want to cancel this booking?";

    if (!window.confirm(message)) {
      return;
    }

    updateStatus(status);
  };

  if (loading) {
    return <ProviderBookingLoading />;
  }

  if (error && !booking) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/provider/bookings"
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            ← Back to Provider Bookings
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
          href="/provider/bookings"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Provider Bookings
        </Link>

        <div className="mt-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold">Booking Details</h1>

              <p className="mt-2 text-sm text-slate-400">
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

          <div className="mt-8 space-y-6">
            {/* Service */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">Service</h2>

              <div className="mt-5">
                <h3 className="text-2xl font-bold">
                  {booking.service?.title ?? "Service"}
                </h3>

                {booking.service?.description && (
                  <p className="mt-3 leading-7 text-slate-400">
                    {booking.service.description}
                  </p>
                )}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <InfoItem
                  label="Price"
                  value={
                    booking.service
                      ? `$${Number(booking.service.price).toFixed(2)}`
                      : "—"
                  }
                  valueClassName="text-cyan-400"
                />

                <InfoItem
                  label="Duration"
                  value={
                    booking.service?.duration
                      ? `${booking.service.duration} min`
                      : "Flexible"
                  }
                />

                <InfoItem
                  label="Category"
                  value={booking.service?.category?.name ?? "—"}
                />
              </div>
            </section>

            {/* Customer */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">Customer</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoItem label="Name" value={booking.customer?.name ?? "—"} />

                <InfoItem
                  label="Email"
                  value={booking.customer?.email ?? "—"}
                />

                <InfoItem
                  label="Phone"
                  value={booking.customer?.phone ?? "Not provided"}
                />
              </div>
            </section>

            {/* Schedule */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">Schedule</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoItem
                  label="Scheduled Date & Time"
                  value={new Date(booking.scheduledAt).toLocaleString()}
                />

                {booking.createdAt && (
                  <InfoItem
                    label="Booked On"
                    value={new Date(booking.createdAt).toLocaleString()}
                  />
                )}
              </div>
            </section>

            {/* Notes */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">Customer Notes</h2>

              <p className="mt-4 whitespace-pre-wrap text-slate-400">
                {booking.notes || "No additional notes."}
              </p>
            </section>

            {/* Actions */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">Booking Actions</h2>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                {booking.status === "PENDING" && (
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleStatusChange("CONFIRMED")}
                    className="rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Confirm Booking"}
                  </button>
                )}

                {booking.status === "CONFIRMED" && (
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleStatusChange("COMPLETED")}
                    className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Mark as Completed"}
                  </button>
                )}

                {(booking.status === "PENDING" ||
                  booking.status === "CONFIRMED") && (
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleStatusChange("CANCELLED")}
                    className="rounded-lg bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Cancel Booking"}
                  </button>
                )}

                <Link
                  href="/provider/bookings"
                  className="rounded-lg border border-slate-700 px-6 py-3 text-center font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
                >
                  Back to Bookings
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoItem({
  label,
  value,
  valueClassName = "text-slate-200",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>

      <p className={`mt-1 ${valueClassName}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-400",
    CONFIRMED: "bg-green-500/10 text-green-400",
    COMPLETED: "bg-blue-500/10 text-blue-400",
    CANCELLED: "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ProviderBookingLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

        <p className="text-slate-400">Loading booking details...</p>
      </div>
    </main>
  );
}
