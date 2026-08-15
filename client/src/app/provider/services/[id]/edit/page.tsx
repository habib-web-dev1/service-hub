"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { api } from "@/lib/api";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: string | number;
  duration: number | null;
  categoryId: string;
  isActive: boolean;
}

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();

  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!serviceId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [serviceResult, categoriesResult] = await Promise.all([
          api.get<Service>(`/services/${serviceId}`),
          api.get<Category[]>("/categories"),
        ]);

        setService(serviceResult);
        setCategories(Array.isArray(categoriesResult) ? categoriesResult : []);

        setTitle(serviceResult.title);
        setDescription(serviceResult.description);
        setPrice(String(serviceResult.price));
        setDuration(
          serviceResult.duration !== null ? String(serviceResult.duration) : "",
        );
        setCategoryId(serviceResult.categoryId);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load service.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [serviceId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Service title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Service description is required.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    try {
      setSubmitting(true);

      await api.patch<Service>(`/services/${serviceId}`, {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        duration: duration ? Number(duration) : undefined,
        categoryId,
      });

      setSuccess("Service updated successfully!");

      setTimeout(() => {
        router.push("/provider/services");
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update service.",
      );
    } finally {
      setSubmitting(false);
    }
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

  if (!service) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/provider/services"
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            ← Back to My Services
          </Link>

          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
            <h1 className="text-2xl font-bold text-red-400">
              Service not found
            </h1>

            <p className="mt-3 text-red-300">
              {error || "The requested service could not be found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/provider/services"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to My Services
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <div>
            <h1 className="text-3xl font-bold">Edit Service</h1>

            <p className="mt-2 text-slate-400">
              Update your service information.
            </p>
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

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Service Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Professional Home Plumbing"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={6}
                placeholder="Describe your service..."
                required
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            {/* Price + Duration */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Price
                </label>

                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="50.00"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Duration (minutes)
                </label>

                <input
                  id="duration"
                  type="number"
                  min="1"
                  step="1"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  placeholder="60"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Category
              </label>

              <select
                id="category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              >
                <option value="">Select a category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Updating Service..." : "Update Service"}
              </button>

              <Link
                href="/provider/services"
                className="flex-1 rounded-lg border border-slate-700 px-6 py-3 text-center font-semibold transition hover:bg-slate-800"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
