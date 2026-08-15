"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  ShieldAlert,
  Users,
  Grid,
  FileText,
  Calendar,
  Trash2,
  RefreshCw,
  Plus,
  X,
  CheckCircle,
  AlertTriangle,
  FolderPlus,
  Loader2,
  Trash
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isDeleted: boolean;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: string | number;
  duration: number | null;
  categoryId: string;
  providerId: string;
  isActive: boolean;
  category?: { name: string };
  provider?: { name: string; email: string };
}

interface Booking {
  id: string;
  scheduledAt: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes: string | null;
  service: {
    title: string;
    price: string | number;
    provider?: { name: string; email: string };
  };
  customer: {
    name: string;
    email: string;
    phone: string | null;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "categories" | "services" | "bookings">("overview");

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Page loaders
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal / Form States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError("");

      const userRes = await localStorage.getItem("user");
      if (!userRes) {
        router.push("/login");
        return;
      }
      const parsedUser = JSON.parse(userRes);
      if (parsedUser.role !== "ADMIN") {
        router.push("/services");
        return;
      }

      // Fetch all required admin stats
      const [usersData, categoriesData, servicesData, bookingsData] = await Promise.all([
        api.get<{ data: User[] }>("/users?limit=100"),
        api.get<Category[]>("/categories"),
        api.get<{ data: Service[] }>("/services?limit=100"),
        api.get<{ data: Booking[] }>("/bookings"),
      ]);

      setUsers(usersData.data);
      setCategories(categoriesData);
      setServices(servicesData.data);
      setBookings(bookingsData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showSuccessMessage = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 4000);
  };

  // User Actions
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action soft-deletes the user account.")) {
      return;
    }

    try {
      setActionLoading(true);
      await api.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showSuccessMessage("User deleted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user.");
    } finally {
      setActionLoading(false);
    }
  };

  // Category Actions
  const handleCreateCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;

    try {
      setActionLoading(true);
      const newCategory = await api.post<Category>("/categories", {
        name: newCatName,
        slug: newCatSlug.toLowerCase().trim().replace(/\s+/g, "-"),
        description: newCatDesc || undefined,
      });

      setCategories((prev) => [...prev, newCategory]);
      setIsCategoryModalOpen(false);
      setNewCatName("");
      setNewCatSlug("");
      setNewCatDesc("");
      showSuccessMessage("Category created successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!window.confirm("Are you sure you want to delete this category? Services in this category will remain, but the category slug will be soft-deleted.")) {
      return;
    }

    try {
      setActionLoading(true);
      await api.delete(`/categories/${catId}`);
      setCategories((prev) =>
        prev.map((c) => (c.id === catId ? { ...c, isDeleted: true } : c))
      );
      showSuccessMessage("Category deleted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestoreCategory = async (catId: string) => {
    try {
      setActionLoading(true);
      const restored = await api.patch<Category>(`/categories/${catId}/restore`);
      setCategories((prev) =>
        prev.map((c) => (c.id === catId ? { ...c, isDeleted: false } : c))
      );
      showSuccessMessage("Category restored successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore category.");
    } finally {
      setActionLoading(false);
    }
  };

  // Service Actions
  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm("Are you sure you want to delete this service? This is a soft-delete.")) {
      return;
    }

    try {
      setActionLoading(true);
      await api.delete(`/services/${serviceId}`);
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      showSuccessMessage("Service deleted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete service.");
    } finally {
      setActionLoading(false);
    }
  };

  // Booking Actions
  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setActionLoading(true);
      await api.patch(`/bookings/${bookingId}/status`, {
        status: "CANCELLED",
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "CANCELLED" } : b))
      );
      showSuccessMessage("Booking cancelled successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel booking.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-cyan-400" />
          <p className="text-slate-400">Loading admin control center...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Top Banner */}
      <div className="border-b border-slate-800 bg-slate-900/40 py-6 px-6 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Control Panel</h1>
              <p className="text-sm text-slate-400">Monitor platform metrics, manage database records, and control bookings</p>
            </div>
          </div>
          <button
            onClick={loadAllData}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold transition hover:bg-slate-900 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Status Alerts */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-5 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition cursor-pointer ${
              activeTab === "overview" ? "bg-cyan-500 text-slate-950" : "bg-slate-900 hover:bg-slate-800 text-slate-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition cursor-pointer ${
              activeTab === "users" ? "bg-cyan-500 text-slate-950" : "bg-slate-900 hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Users className="h-4 w-4" />
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition cursor-pointer ${
              activeTab === "categories" ? "bg-cyan-500 text-slate-950" : "bg-slate-900 hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Grid className="h-4 w-4" />
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition cursor-pointer ${
              activeTab === "services" ? "bg-cyan-500 text-slate-950" : "bg-slate-900 hover:bg-slate-800 text-slate-300"
            }`}
          >
            <FileText className="h-4 w-4" />
            Services ({services.length})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition cursor-pointer ${
              activeTab === "bookings" ? "bg-cyan-500 text-slate-950" : "bg-slate-900 hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Bookings ({bookings.length})
          </button>
        </div>

        {/* -------------------- OVERVIEW TAB -------------------- */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">Total Users</p>
                  <Users className="h-6 w-6 text-cyan-400" />
                </div>
                <p className="mt-4 text-4xl font-extrabold">{users.length}</p>
                <div className="mt-2 text-xs text-slate-500">Registered customers & providers</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">Categories</p>
                  <Grid className="h-6 w-6 text-blue-400" />
                </div>
                <p className="mt-4 text-4xl font-extrabold">{categories.length}</p>
                <div className="mt-2 text-xs text-slate-500">Service categorization options</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">Active Services</p>
                  <FileText className="h-6 w-6 text-purple-400" />
                </div>
                <p className="mt-4 text-4xl font-extrabold">
                  {services.filter((s) => s.isActive).length}
                </p>
                <div className="mt-2 text-xs text-slate-500">Available client listings</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">Bookings Made</p>
                  <Calendar className="h-6 w-6 text-yellow-400" />
                </div>
                <p className="mt-4 text-4xl font-extrabold">{bookings.length}</p>
                <div className="mt-2 text-xs text-slate-500">Appointments scheduled</div>
              </div>
            </div>

            {/* Quick Summary Panels */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Recent Bookings */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
                  <span>Recent Bookings</span>
                  <button onClick={() => setActiveTab("bookings")} className="text-xs text-cyan-400 hover:underline">
                    View all
                  </button>
                </h3>
                <div className="divide-y divide-slate-800">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="py-3 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-semibold text-slate-200">{booking.service.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">By {booking.customer.name}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                          booking.status === "COMPLETED" ? "bg-blue-500/10 text-blue-400" :
                          booking.status === "CONFIRMED" ? "bg-green-500/10 text-green-400" :
                          booking.status === "CANCELLED" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"
                        }`}>
                          {booking.status}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">{new Date(booking.scheduledAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <p className="text-slate-500 text-center py-6">No bookings registered in the system.</p>
                  )}
                </div>
              </div>

              {/* System Users Overview */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
                  <span>Newest Registrations</span>
                  <button onClick={() => setActiveTab("users")} className="text-xs text-cyan-400 hover:underline">
                    View all
                  </button>
                </h3>
                <div className="divide-y divide-slate-800">
                  {users.slice(0, 5).map((u) => (
                    <div key={u.id} className="py-3 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-semibold text-slate-200">{u.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{u.email}</p>
                      </div>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                        u.role === "ADMIN" ? "bg-red-500/10 text-red-400" :
                        u.role === "PROVIDER" ? "bg-blue-500/10 text-blue-400" : "bg-slate-800 text-slate-400"
                      }`}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className="text-slate-500 text-center py-6">No users found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- USERS TAB -------------------- */}
        {activeTab === "users" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                    <th className="py-4 px-6 font-semibold">User Details</th>
                    <th className="py-4 px-6 font-semibold">Email</th>
                    <th className="py-4 px-6 font-semibold">Phone</th>
                    <th className="py-4 px-6 font-semibold text-center">Role</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/10 transition">
                      <td className="py-4 px-6 font-medium text-slate-200">{u.name}</td>
                      <td className="py-4 px-6 text-slate-300 break-all">{u.email}</td>
                      <td className="py-4 px-6 text-slate-400">{u.phone || "—"}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                          u.role === "ADMIN" ? "bg-red-500/10 text-red-400" :
                          u.role === "PROVIDER" ? "bg-blue-500/10 text-blue-400" : "bg-slate-800 text-slate-400"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {u.role !== "ADMIN" ? (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={actionLoading}
                            className="text-red-400 hover:text-red-300 transition p-1.5 hover:bg-red-500/10 rounded-lg cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        ) : (
                          <span className="text-xs text-slate-600 italic">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 px-6 text-center text-slate-500">
                        No registered users.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- CATEGORIES TAB -------------------- */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Category Catalog</h3>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                      <th className="py-4 px-6 font-semibold">Category Name</th>
                      <th className="py-4 px-6 font-semibold">Slug Identifier</th>
                      <th className="py-4 px-6 font-semibold">Description</th>
                      <th className="py-4 px-6 font-semibold text-center">Status</th>
                      <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {categories.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-900/10 transition">
                        <td className="py-4 px-6 font-medium text-slate-200">{c.name}</td>
                        <td className="py-4 px-6 text-slate-400 font-mono text-xs">{c.slug}</td>
                        <td className="py-4 px-6 text-slate-300 max-w-xs truncate">{c.description || "—"}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                            c.isDeleted ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
                          }`}>
                            {c.isDeleted ? "Deleted" : "Active"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {c.isDeleted ? (
                            <button
                              onClick={() => handleRestoreCategory(c.id)}
                              disabled={actionLoading}
                              className="text-green-400 hover:text-green-300 transition p-1.5 hover:bg-green-500/10 rounded-lg cursor-pointer text-xs font-semibold"
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteCategory(c.id)}
                              disabled={actionLoading}
                              className="text-red-400 hover:text-red-300 transition p-1.5 hover:bg-red-500/10 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- SERVICES TAB -------------------- */}
        {activeTab === "services" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                    <th className="py-4 px-6 font-semibold">Service Listing</th>
                    <th className="py-4 px-6 font-semibold">Category</th>
                    <th className="py-4 px-6 font-semibold">Provider</th>
                    <th className="py-4 px-6 font-semibold">Hourly/Flat Rate</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {services.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-900/10 transition">
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-200">{s.title}</div>
                        <div className="text-xs text-slate-500 mt-1 max-w-sm truncate">{s.description}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-400">
                          {s.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-slate-200">{s.provider?.name || "—"}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.provider?.email}</p>
                      </td>
                      <td className="py-4 px-6 text-cyan-400 font-bold">
                        ${Number(s.price).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeleteService(s.id)}
                          disabled={actionLoading}
                          className="text-red-400 hover:text-red-300 transition p-1.5 hover:bg-red-500/10 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {services.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 px-6 text-center text-slate-500">
                        No services published on the platform.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- BOOKINGS TAB -------------------- */}
        {activeTab === "bookings" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                    <th className="py-4 px-6 font-semibold">Service Booked</th>
                    <th className="py-4 px-6 font-semibold">Client Details</th>
                    <th className="py-4 px-6 font-semibold">Scheduled Date</th>
                    <th className="py-4 px-6 font-semibold text-center">Status</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-900/10 transition">
                      <td className="py-4 px-6">
                        <p className="font-semibold text-slate-200">{b.service.title}</p>
                        <p className="text-xs text-slate-500 mt-1">Provider: {b.service.provider?.name || "—"}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-slate-200">{b.customer.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{b.customer.email}</p>
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {new Date(b.scheduledAt).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                          b.status === "COMPLETED" ? "bg-blue-500/10 text-blue-400" :
                          b.status === "CONFIRMED" ? "bg-green-500/10 text-green-400" :
                          b.status === "CANCELLED" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {b.status !== "CANCELLED" && b.status !== "COMPLETED" ? (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            disabled={actionLoading}
                            className="text-red-400 hover:text-red-300 text-xs font-semibold border border-red-500/20 rounded px-2.5 py-1.5 hover:bg-red-500/10 transition cursor-pointer"
                          >
                            Cancel Appointment
                          </button>
                        ) : (
                          <span className="text-xs text-slate-600 italic">No Actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 px-6 text-center text-slate-500">
                        No bookings exist.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Category Creation Overlay Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-6">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-cyan-400">
                <FolderPlus className="h-5 w-5" />
                <h3 className="text-xl font-bold">Add New Category</h3>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category Name</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    // Autofill slug suggestion
                    setNewCatSlug(e.target.value.toLowerCase().trim().replace(/\s+/g, "-"));
                  }}
                  placeholder="e.g. Gardening Services"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Slug Identifier</label>
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  placeholder="e.g. gardening-services"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white font-mono text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Add category details..."
                  rows={4}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 rounded-lg border border-slate-700 py-3 text-sm font-semibold transition hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 cursor-pointer disabled:opacity-50"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
