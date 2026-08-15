"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { api } from "@/lib/api";
import ConfirmModal from "@/components/ConfirmModal";

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
  };
}

interface MyServicesResponse {
  data: Service[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ProviderServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await api.get<MyServicesResponse>("/services/my");

      setServices(result?.data ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load your services.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (serviceId: string) => {
    setConfirmDeleteId(serviceId);
  };

  const confirmDelete = async () => {
    const serviceId = confirmDeleteId;
    setConfirmDeleteId(null);
    if (!serviceId) return;

    try {
      setDeletingId(serviceId);
      setError("");

      await api.delete(`/services/${serviceId}`);

      setServices((currentServices) =>
        currentServices.filter((service) => service.id !== serviceId),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete the service.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="text-slate-400">Loading your services...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold">My Services</h1>

              <p className="mt-2 text-slate-400">
                Manage the services you provide.
              </p>
            </div>

            <Link
              href="/provider/services/new"
              className="rounded-lg bg-cyan-500 px-5 py-3 text-center font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              + Create Service
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!error && services.length === 0 && (
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
              <h2 className="text-xl font-semibold">No services yet</h2>

              <p className="mt-2 text-slate-400">
                You haven't created any services yet.
              </p>

              <Link
                href="/provider/services/new"
                className="mt-6 inline-block rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Create Your First Service
              </Link>
            </div>
          )}

          {/* Services */}
          {services.length > 0 && (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {service.category && (
                        <span className="inline-block rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                          {service.category.name}
                        </span>
                      )}

                      <h2 className="mt-3 text-xl font-semibold">
                        {service.title}
                      </h2>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        service.isActive
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                    {service.description}
                  </p>

                  {/* Details */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <p className="text-xs text-slate-500">Price</p>

                      <p className="mt-1 text-lg font-semibold text-cyan-400">
                        ${Number(service.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <p className="text-xs text-slate-500">Duration</p>

                      <p className="mt-1 text-lg font-semibold text-white">
                        {service.duration
                          ? `${service.duration} min`
                          : "Flexible"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`/services/${service.id}`}
                      className="flex-1 rounded-lg border border-slate-700 px-4 py-3 text-center text-sm font-semibold transition hover:bg-slate-800"
                    >
                      View
                    </Link>

                    <Link
                      href={`/provider/services/${service.id}/edit`}
                      className="flex-1 rounded-lg bg-cyan-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(service.id)}
                      disabled={deletingId === service.id}
                      className="flex-1 rounded-lg border border-red-500/40 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === service.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {confirmDeleteId && (
        <ConfirmModal
          title="Delete Service"
          message="Are you sure you want to delete this service? This action cannot be undone."
          confirmLabel="Delete"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </>
  );
}
