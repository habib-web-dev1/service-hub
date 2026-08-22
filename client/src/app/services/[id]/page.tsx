"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Star,
  Clock,
  Tag,
  Mail,
  Phone,
  Calendar,
  User,
  MessageSquare,
  CheckCircle,
  Shield,
} from "lucide-react";
import Image from "next/image";

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

const categoryImages: Record<string, string> = {
  plumbing:
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1000&auto=format&fit=crop",
  cleaning:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&auto=format&fit=crop",
  electrical:
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1000&auto=format&fit=crop",
  photography:
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000&auto=format&fit=crop",
  fallback:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&auto=format&fit=crop",
};

const getCategoryImage = (slug?: string) => {
  if (!slug) return categoryImages.fallback;
  return categoryImages[slug.toLowerCase()] || categoryImages.fallback;
};

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
        <div className="text-center animate-pulse">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
          <p className="text-slate-400">Loading service details.....</p>
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
            className="flex items-center gap-1 text-sm text-cyan-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Service listings
          </Link>
          <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <h1 className="text-2xl font-bold text-red-400">
              Service Not Found
            </h1>
            <p className="mt-3 text-red-300">
              {error || "The service details could not be retrieved."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 pb-20 text-white">
      {/* Cover Header Image */}
      <div className="h-64 md:h-400 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/30 to-transparent z-10" />
        <Image
          src={getCategoryImage(service.category?.slug)}
          alt={service.title}
          className="h-full w-full object-cover object-center relative z-0"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-20 -mt-16 md:-mt-24">
        {/* Navigation */}
        <Link
          href="/services"
          className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-800 px-4 py-1.5 text-xs text-cyan-400 hover:text-white transition backdrop-blur-md mb-6"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Listings
        </Link>

        {/* 2-Column Grid */}
        <div className="grid gap-8 lg:grid-cols-3 items-start">
          {/* LEFT: Details, Descriptions, and Reviews */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl border border-slate-850 bg-slate-900/40 p-6 md:p-8 backdrop-blur-md">
              {/* Category */}
              {service.category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                  <Tag className="h-3.5 w-3.5" />
                  {service.category.name}
                </span>
              )}

              {/* Title */}
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight md:text-4xl text-white">
                {service.title}
              </h1>

              {/* Quick Summary Badges */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400 items-center">
                <div className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <Star className="h-4 w-4 fill-yellow-400" />
                  {averageRating > 0 ? averageRating.toFixed(1) : "No ratings"}
                  {reviews.length > 0 && (
                    <span className="text-slate-500 font-normal">
                      ({reviews.length} reviews)
                    </span>
                  )}
                </div>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {service.duration
                    ? `${service.duration} mins`
                    : "Flexible Duration"}
                </span>
              </div>

              {/* Description */}
              <div className="mt-8 border-t border-slate-800/80 pt-6">
                <h3 className="text-lg font-bold text-slate-200 mb-3">
                  Service Description
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-slate-300 whitespace-pre-line">
                  {service.description}
                </p>
              </div>

              {/* Features List */}
              <div className="mt-8 border-t border-slate-800/80 pt-6">
                <h3 className="text-lg font-bold text-slate-200 mb-3">
                  What is included
                </h3>
                <ul className="grid gap-2.5 sm:grid-cols-2 text-xs md:text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />{" "}
                    Vetted local professional
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />{" "}
                    Service tools & equipment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />{" "}
                    Appointment insurance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />{" "}
                    100% moneyback guarantee
                  </li>
                </ul>
              </div>
            </div>

            {/* REVIEWS LIST */}
            <div className="rounded-2xl border border-slate-850 bg-slate-900/40 p-6 md:p-8 backdrop-blur-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
                <div>
                  <h3 className="text-xl font-bold text-slate-200">
                    Customer Feedbacks
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Direct feedback from verified bookings
                  </p>
                </div>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-3 rounded-xl bg-slate-950 px-4 py-2 border border-slate-850">
                    <span className="text-2xl font-black text-white">
                      {averageRating.toFixed(1)}
                    </span>
                    <div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < Math.round(averageRating) ? "fill-yellow-400" : "text-slate-800"}`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {reviews.length} reviews
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {reviewsError && (
                <div className="text-sm text-red-400">{reviewsError}</div>
              )}
              {reviewsLoading ? (
                <div className="text-center py-6 text-slate-500">
                  Loading reviews...
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <MessageSquare className="mx-auto h-8 w-8 mb-3 text-slate-700" />
                  <p className="text-sm">
                    No reviews left for this service yet.
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Book the service and be the first to share feedback!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl bg-slate-950/40 p-4 border border-slate-900"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-bold text-slate-300 text-xs md:text-sm">
                            {rev.user?.name || "Client"}
                          </p>
                          <div className="flex text-yellow-400 gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-800"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-600">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {rev.comment && (
                        <p className="text-xs md:text-sm text-slate-400 mt-3.5 leading-relaxed italic">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Booking Action Box */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            {/* Booking Card */}
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 rounded-bl-xl bg-cyan-500/10 px-3 py-1 text-[10px] font-bold text-cyan-400 border-l border-b border-cyan-500/20">
                Verified Listing
              </div>

              <div className="mb-6">
                <p className="text-xs text-slate-500 uppercase tracking-widest">
                  Rate
                </p>
                <p className="text-3xl font-black text-cyan-400 mt-1">
                  ${Number(service.price).toFixed(2)}
                  <span className="text-xs text-slate-400 font-normal">
                    {" "}
                    / job
                  </span>
                </p>
              </div>

              <div className="space-y-4 border-t border-slate-800 pt-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> Duration:
                  </span>
                  <span className="font-semibold">
                    {service.duration
                      ? `${service.duration} minutes`
                      : "Flexible"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Shield className="h-4 w-4" /> Insurance:
                  </span>
                  <span className="font-semibold text-green-400">Included</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="mt-8 w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 py-3.5 text-sm font-bold text-slate-950 transition hover:opacity-95 shadow-md shadow-cyan-500/5 cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Book This Appointment
              </button>
            </div>

            {/* Provider Snapshot Card */}
            {service.provider && (
              <div className="rounded-2xl border border-slate-850 bg-slate-900/40 p-6 backdrop-blur-md space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  Service Professional
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">
                      {service.provider.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                      Certified Pro
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="h-3.5 w-3.5 text-slate-500" />
                    <span className="truncate">{service.provider.email}</span>
                  </div>
                  {service.provider.phone && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="h-3.5 w-3.5 text-slate-500" />
                      <span>{service.provider.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
