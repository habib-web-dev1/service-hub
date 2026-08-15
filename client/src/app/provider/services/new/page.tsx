"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function CreateServicePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setError("Please login before creating a service.");
      setLoadingCategories(false);
      return;
    }

    try {
      const parsedUser: User = JSON.parse(storedUser);

      setUser(parsedUser);

      if (parsedUser.role !== "PROVIDER") {
        setError("Only providers can create services.");
        setLoadingCategories(false);
        return;
      }
    } catch {
      setError("Invalid user session. Please login again.");
      setLoadingCategories(false);
      return;
    }

    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        setError("");

        const result = await api.get<Category[]>("/categories");

        setCategories(Array.isArray(result) ? result : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load categories.",
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!user) {
      setError("Please login before creating a service.");
      return;
    }

    if (user.role !== "PROVIDER") {
      setError("Only providers can create services.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    const parsedPrice = Number(price);
    const parsedDuration = duration ? Number(duration) : undefined;

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (
      parsedDuration !== undefined &&
      (!Number.isInteger(parsedDuration) || parsedDuration <= 0)
    ) {
      setError("Duration must be a positive whole number.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/services", {
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        ...(parsedDuration !== undefined && {
          duration: parsedDuration,
        }),
        categoryId,
        providerId: user.id,
      });

      setSuccess("Service created successfully!");

      setTitle("");
      setDescription("");
      setPrice("");
      setDuration("");
      setCategoryId("");

      setTimeout(() => {
        router.push("/provider");
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create service.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCategories) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="text-slate-400">Loading service form...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/provider"
          className="text-sm text-cyan-400 transition hover:text-cyan-300"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl md:p-10">
          <div>
            <p className="text-sm font-medium text-cyan-400">Provider</p>

            <h1 className="mt-2 text-3xl font-bold">Create a Service</h1>

            <p className="mt-2 text-slate-400">
              Add a new service that customers can discover and book.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
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
                placeholder="e.g. Professional Plumbing Repair"
                minLength={3}
                maxLength={150}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />

              <p className="mt-2 text-xs text-slate-500">3–150 characters</p>
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
                placeholder="Describe what this service includes..."
                minLength={10}
                maxLength={2000}
                rows={6}
                required
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />

              <p className="mt-2 text-xs text-slate-500">10–2000 characters</p>
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

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    $
                  </span>

                  <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="50.00"
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-8 pr-4 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Duration
                </label>

                <div className="relative">
                  <input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                    placeholder="60"
                    min="1"
                    step="1"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-4 pr-16 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    min
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500">Optional</p>
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

              {categories.length === 0 && (
                <p className="mt-2 text-sm text-yellow-400">
                  No categories are available.
                </p>
              )}
            </div>

            {/* Provider */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-500">Service Provider</p>

              <p className="mt-1 font-medium text-slate-200">
                {user?.name || "Current Provider"}
              </p>

              <p className="mt-1 text-sm text-slate-500">{user?.email || ""}</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={submitting || !user || categories.length === 0}
                className="flex-1 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Creating Service..." : "Create Service"}
              </button>

              <Link
                href="/provider"
                className="rounded-lg border border-slate-700 px-6 py-3 text-center font-semibold text-slate-200 transition hover:bg-slate-800"
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
