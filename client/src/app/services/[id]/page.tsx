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

interface Review {
  id: string;
  bookingId: string;
  serviceId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;

  user?: {
    id: string;
    name: string;
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "text-yellow-400" : "text-slate-700"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [error, setError] = useState("");
  const [reviewsError, setReviewsError] = useState("");

  useEffect(() => {
    if (!serviceId) return;

    const fetchService = async () => {
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

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewsError("");

        const result = await api.get<Review[]>(`/reviews/service/${serviceId}`);

        setReviews(Array.isArray(result) ? result : []);
      } catch (err) {
        setReviewsError(
          err instanceof Error ? err.message : "Failed to load reviews.",
        );
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchService();
    fetchReviews();
  }, [serviceId]);

  const handleBooking = () => {
    router.push(`/bookings?serviceId=${serviceId}`);
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : 0;

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

        {/* Main Service Card */}
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

        {/* Reviews Section */}
        <section className="mt-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold">Customer Reviews</h2>

              <p className="mt-2 text-slate-400">
                See what customers think about this service.
              </p>
            </div>

            {reviews.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold">
                    {averageRating.toFixed(1)}
                  </span>

                  <div>
                    <StarRating rating={Math.round(averageRating)} />

                    <p className="mt-1 text-sm text-slate-500">
                      {reviews.length}{" "}
                      {reviews.length === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reviews Error */}
          {reviewsError && (
            <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
              {reviewsError}
            </div>
          )}

          {/* Loading */}
          {reviewsLoading && (
            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

              <p className="text-slate-400">Loading reviews...</p>
            </div>
          )}

          {/* Empty */}
          {!reviewsLoading && !reviewsError && reviews.length === 0 && (
            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
              <p className="text-lg font-medium">No reviews yet</p>

              <p className="mt-2 text-slate-500">
                Be the first customer to review this service.
              </p>
            </div>
          )}

          {/* Review List */}
          {!reviewsLoading && reviews.length > 0 && (
            <div className="mt-8 space-y-4">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="font-semibold">
                        {review.user?.name ?? "Customer"}
                      </h3>

                      <div className="mt-2">
                        <StarRating rating={review.rating} />
                      </div>
                    </div>

                    <time className="text-sm text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </time>
                  </div>

                  {review.comment && (
                    <p className="mt-5 leading-7 text-slate-400">
                      {review.comment}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
