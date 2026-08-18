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
  service?: Service;
}

interface Review {
  id: string;
  bookingId: string;
  serviceId: string;
  rating: number;
  comment: string | null;
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
    return <BookingLoading />;
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
                Write Notes
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

function ReviewModal({
  booking,
  onClose,
  onSuccess,
}: {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await api.post<Review>("/reviews", {
        bookingId: booking.id,
        serviceId: booking.serviceId,
        rating,
        comment: comment.trim() || undefined,
      });

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Write a Review</h2>

            <p className="mt-1 text-sm text-slate-400">
              {booking.service?.title ?? "Completed Service"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-500 transition hover:text-white"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <p className="mb-3 text-sm font-medium text-slate-300">Rating</p>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl transition ${
                    star <= rating
                      ? "text-yellow-400"
                      : "text-slate-700 hover:text-yellow-300"
                  }`}
                  aria-label={`Rate ${star} out of 5`}
                >
                  ★
                </button>
              ))}
            </div>

            <p className="mt-2 text-sm text-slate-500">{rating} out of 5</p>
          </div>

          <div>
            <label
              htmlFor="review-comment"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Comment
            </label>

            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={5}
              placeholder="Share your experience..."
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-lg border border-slate-700 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await api.get<Booking[]>("/bookings/my");

        setBookings(Array.isArray(result) ? result : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load bookings.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleReviewSuccess = () => {
    setReviewBooking(null);
    setReviewSuccess("Review submitted successfully!");

    setTimeout(() => {
      setReviewSuccess("");
    }, 3000);
  };

  if (loading) {
    return <BookingLoading />;
  }

  return (
    <>
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold">My Bookings</h1>

              <p className="mt-2 text-slate-400">
                View and manage your service bookings.
              </p>
            </div>

            <Link
              href="/services"
              className="rounded-lg bg-cyan-500 px-5 py-3 text-center font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Browse Services
            </Link>
          </div>

          {reviewSuccess && (
            <div className="mt-8 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-400">
              {reviewSuccess}
            </div>
          )}

          {error && (
            <div className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {!error && bookings.length === 0 && (
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
              <h2 className="text-xl font-semibold">No bookings yet</h2>

              <p className="mt-2 text-slate-400">
                You haven&apos;t booked any services yet.
              </p>

              <Link
                href="/services"
                className="mt-6 inline-block rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Find a Service
              </Link>
            </div>
          )}

          {bookings.length > 0 && (
            <div className="mt-8 space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {booking.service?.title ?? "Service Booking"}
                      </h2>

                      <p className="mt-2 text-sm text-slate-400">
                        Booking ID: {booking.id}
                      </p>
                    </div>

                    <span
                      className={`h-fit rounded-full px-3 py-1 text-sm font-medium ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-500/10 text-green-400"
                          : booking.status === "CANCELLED"
                            ? "bg-red-500/10 text-red-400"
                            : booking.status === "COMPLETED"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-slate-500">Scheduled</p>

                      <p className="mt-1 text-slate-200">
                        {new Date(booking.scheduledAt).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Price</p>

                      <p className="mt-1 text-cyan-400">
                        {booking.service
                          ? `$${Number(booking.service.price).toFixed(2)}`
                          : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Duration</p>

                      <p className="mt-1 text-slate-200">
                        {booking.service?.duration
                          ? `${booking.service.duration} min`
                          : "Flexible"}
                      </p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-6 border-t border-slate-800 pt-4">
                      <p className="text-sm text-slate-500">Notes</p>

                      <p className="mt-1 text-slate-300">{booking.notes}</p>
                    </div>
                  )}

                  {booking.status === "COMPLETED" && (
                    <div className="mt-6 border-t border-slate-800 pt-5">
                      <button
                        type="button"
                        onClick={() => setReviewBooking(booking)}
                        className="rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-yellow-300"
                      >
                        ★ Leave a Review
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </>
  );
}

function BookingLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

        <p className="text-slate-400">Loading bookings...</p>
      </div>
    </main>
  );
}

function BookingPageContent() {
  const searchParams = useSearchParams();

  const serviceId = searchParams.get("serviceId");

  if (serviceId) {
    return <BookingForm />;
  }

  return <MyBookings />;
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<BookingLoading />}>
      <BookingPageContent />
    </Suspense>
  );
}
