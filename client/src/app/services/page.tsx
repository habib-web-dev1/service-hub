"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Search, Star, Clock, Filter, Layers, ArrowLeft, ArrowRight, Compass } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
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
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  provider?: {
    id: string;
    name: string;
    email: string;
  };
}

interface ServicesResponse {
  data: Service[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const categoryImages: Record<string, string> = {
  plumbing: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop",
  cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop",
  electrical: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop",
  photography: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop",
  fallback: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop"
};

const getCategoryImage = (slug?: string) => {
  if (!slug) return categoryImages.fallback;
  return categoryImages[slug.toLowerCase()] || categoryImages.fallback;
};

// Seed random-looking but static ratings for visual layout
const getServiceRating = (id: string) => {
  const code = id.charCodeAt(id.length - 1) || 5;
  const rating = 4.5 + (code % 6) * 0.1;
  const count = 10 + (code * 3) % 40;
  return { rating: rating.toFixed(1), count };
};

function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL queries
  const activeCategoryId = searchParams.get("categoryId") || "";
  const initialSearch = searchParams.get("search") || "";

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(activeCategoryId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFiltersAndServices = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch categories for sidebar filter
      const catResult = await api.get<Category[]>("/categories");
      setCategories(catResult);

      // Build endpoint path dynamically
      let endpoint = "/services?limit=100";
      
      // If we are filtering by a category slug or CUID
      if (selectedCategory) {
        // Find CUID matching category slug/id
        const matched = catResult.find(c => c.slug === selectedCategory || c.id === selectedCategory);
        if (matched) {
          endpoint += `&categoryId=${matched.id}`;
        }
      }
      
      if (search) {
        endpoint += `&search=${encodeURIComponent(search)}`;
      }

      const servicesResult = await api.get<ServicesResponse>(endpoint);
      setServices(servicesResult.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiltersAndServices();
  }, [selectedCategory, searchParams]); // Run when category selection or query params change

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.push(`/services?${params.toString()}`);
    fetchFiltersAndServices();
  };

  const handleCategorySelect = (catSlug: string) => {
    const params = new URLSearchParams(window.location.search);
    if (catSlug) {
      params.set("categoryId", catSlug);
      setSelectedCategory(catSlug);
    } else {
      params.delete("categoryId");
      setSelectedCategory("");
    }
    router.push(`/services?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    router.push("/services");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-4">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* Search Panel */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
          <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Search className="h-4 w-4 text-cyan-400" />
            Search Services
          </h3>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. leak, kitchen..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-4 pr-10 text-sm text-white outline-none focus:border-cyan-400"
            />
            <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-cyan-400 cursor-pointer">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
          <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Filter className="h-4 w-4 text-cyan-400" />
            Filter by Category
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => handleCategorySelect("")}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm font-semibold transition flex items-center gap-2 cursor-pointer ${
                !selectedCategory ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:bg-slate-800/40 hover:text-white"
              }`}
            >
              <Compass className="h-4 w-4" />
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`w-full text-left rounded-lg px-3 py-2 text-sm font-semibold transition flex items-center justify-between cursor-pointer ${
                  selectedCategory === cat.slug || selectedCategory === cat.id
                    ? "bg-cyan-500 text-slate-950"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-white"
                }`}
              >
                <span className="truncate">{cat.name}</span>
                <ChevronRightSmall />
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters CTA */}
        {(selectedCategory || search) && (
          <button
            onClick={handleResetFilters}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/10 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white cursor-pointer"
          >
            Clear Active Filters
          </button>
        )}
      </div>

      {/* Services Listing Area */}
      <div className="lg:col-span-3">
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
              <p className="text-slate-400">Filtering listings...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
            <h2 className="text-lg font-semibold text-red-400">Failed to load services</h2>
            <p className="mt-2 text-sm text-red-300">{error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-xl border border-slate-850 bg-slate-900/20 p-12 text-center">
            <Layers className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <h2 className="text-xl font-bold">No matches found</h2>
            <p className="mt-2 text-slate-400">Try adjusting your keywords or clearing the category filters.</p>
            <button
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-sm text-slate-400">
              <p>{services.length} active service{services.length !== 1 ? "s" : ""} found</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const ratingInfo = getServiceRating(service.id);
                return (
                  <div
                    key={service.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-cyan-500/30 transition duration-300 group shadow-md"
                  >
                    {/* Visual Cover */}
                    <div className="h-44 overflow-hidden relative">
                      <img
                        src={getCategoryImage(service.category?.slug)}
                        alt={service.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-103"
                      />
                      {service.category && (
                        <span className="absolute top-4 left-4 rounded-full bg-slate-950/80 backdrop-blur px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                          {service.category.name}
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Rating Badging */}
                        <div className="flex items-center gap-1 text-yellow-400 text-xs">
                          <Star className="h-3.5 w-3.5 fill-yellow-400" />
                          <span className="font-bold">{ratingInfo.rating}</span>
                          <span className="text-slate-500">({ratingInfo.count})</span>
                        </div>

                        <h3 className="mt-2.5 text-lg font-bold text-white group-hover:text-cyan-400 transition line-clamp-1">
                          {service.title}
                        </h3>

                        <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">
                          {service.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-800/80">
                        {/* Duration and Provider Details */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                          {service.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {service.duration} mins
                            </span>
                          )}
                          <span className="truncate">By {service.provider?.name}</span>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500">Service Fee</p>
                            <p className="text-lg font-extrabold text-cyan-400">${Number(service.price).toFixed(2)}</p>
                          </div>
                          
                          <Link
                            href={`/services/${service.id}`}
                            className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 cursor-pointer"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChevronRightSmall() {
  return (
    <span className="text-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition duration-150">
      →
    </span>
  );
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Navigation Info */}
        <div className="mb-10 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300">
            <ArrowLeft className="h-3 w-3" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Available Service Listings
          </h1>
          <p className="mt-2 text-sm text-slate-400">Vetted local professionals ready to work on your schedule</p>
        </div>

        {/* Suspense wrapper for client routing */}
        <Suspense fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center animate-pulse">
              <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-cyan-400" />
              <p className="text-slate-400">Loading catalog...</p>
            </div>
          </div>
        }>
          <ServicesContent />
        </Suspense>
      </div>
    </main>
  );
}

function Loader2({ className }: { className?: string }) {
  return <div className={`border-2 border-slate-700 border-t-cyan-400 rounded-full animate-spin ${className}`} />;
}
