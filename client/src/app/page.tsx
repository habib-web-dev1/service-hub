"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Star,
  CheckCircle2,
  ArrowRight,
  Clock,
  ShieldCheck,
  Award,
  MessageSquare,
  HelpCircle,
  Send,
  Sparkles,
  ChevronDown,
  Layers,
  Activity,
  HeartHandshake,
} from "lucide-react";

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
  category?: { id: string; name: string; slug: string };
  provider?: { id: string; name: string };
}

interface ServicesResponse {
  data: Service[];
  meta: { total: number };
}

const categoryImages: Record<string, string> = {
  plumbing:
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop",
  cleaning:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop",
  electrical:
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop",
  photography:
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop",
  fallback:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop",
};

const categoryIcons: Record<string, string> = {
  plumbing: "🔧",
  cleaning: "🧹",
  electrical: "⚡",
  photography: "📷",
};

const getCategoryImage = (slug?: string) => {
  if (!slug) return categoryImages.fallback;
  return categoryImages[slug.toLowerCase()] || categoryImages.fallback;
};

const steps = [
  {
    number: "01",
    title: "Find a Service",
    desc: "Browse categories or search for specific household services.",
  },
  {
    number: "02",
    title: "Schedule Date",
    desc: "Select a convenient date, time, and write instructions for the provider.",
  },
  {
    number: "03",
    title: "Get Work Done",
    desc: "A qualified local professional arrives to complete the job.",
  },
  {
    number: "04",
    title: "Leave Review",
    desc: "Write honest feedback and rate the service to help the community.",
  },
];

const testimonials = [
  {
    quote:
      "The plumbing expert resolved a pipe leak that had been bothering us for weeks in just under an hour. Outstanding service!",
    author: "David K.",
    role: "Homeowner",
    rating: 5,
  },
  {
    quote:
      "Outstanding deep cleaning! They were extremely meticulous and left the apartment smelling brand new. Highly recommended.",
    author: "Jessica M.",
    role: "Tech Recruiter",
    rating: 5,
  },
  {
    quote:
      "Our photographer was so professional and captured all key moments of the corporate party beautifully. Will book again!",
    author: "Robert T.",
    role: "Operations Lead",
    rating: 5,
  },
];

const faqs = [
  {
    q: "How do I book a local service?",
    a: "Simply browse through our available categories, select a service card, and click 'Book This Service'. You'll be prompted to set a date, time, and custom notes before confirming your booking.",
  },
  {
    q: "Can I cancel a scheduled appointment?",
    a: "Yes. Customers can cancel any booking in 'Pending' or 'Confirmed' status directly from the 'My Bookings' tab on their profile dashboard.",
  },
  {
    q: "How can I start offering services as a provider?",
    a: "Register an account and choose 'Service Provider', or log into your client account, head over to your profile page, and click 'Become a Service Provider' to unlock service creation.",
  },
  {
    q: "Are service providers screened?",
    a: "We display ratings, reviews, and detailed provider histories so you can check qualifications and select top-tier professionals with peace of mind.",
  },
];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoadingServices(true);
        const [catRes, svcRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/categories`,
          ).then((r) => r.json()),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/services?limit=3`,
          ).then((r) => r.json()),
        ]);
        if (catRes.success) setCategories(catRes.data ?? []);
        if (svcRes.success)
          setFeaturedServices((svcRes.data as ServicesResponse).data ?? []);
      } catch {
        // silently fail — homepage degrades gracefully
      } finally {
        setLoadingServices(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-x-hidden font-sans">
      {/* 1. HERO */}
      <section className="relative px-6 py-20 md:py-32 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]">
        <div className="mx-auto max-w-7xl text-center relative z-10">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/10 px-4 py-1.5 text-xs font-semibold text-cyan-400 mb-6">
            <Sparkles className="h-4 w-4" />
            Verified Local Service Experts
          </div>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            Find Trusted Services. <br />
            <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Book With Absolute Confidence.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-slate-400">
            Connect directly with verified service experts. Book appointments,
            track schedules, and review work — all in one premium platform.
          </p>

          <form onSubmit={handleSearch} className="mx-auto mt-10 max-w-2xl">
            <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-2.5 shadow-xl backdrop-blur-md">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service do you need? (e.g. cleaning, plumbing...)"
                  className="w-full bg-transparent py-3 pl-12 pr-4 text-sm text-white placeholder-slate-600 outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 px-8 py-3 text-sm font-bold text-slate-950 transition hover:opacity-90 cursor-pointer"
              >
                Search Pros
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-slate-500">
            <span>Popular:</span>
            <Link
              href="/services?search=cleaning"
              className="text-slate-400 hover:text-cyan-400"
            >
              Deep Cleaning
            </Link>
            <span>•</span>
            <Link
              href="/services?search=plumbing"
              className="text-slate-400 hover:text-cyan-400"
            >
              Pipe Repairs
            </Link>
            <span>•</span>
            <Link
              href="/services?search=electrical"
              className="text-slate-400 hover:text-cyan-400"
            >
              Panel Installation
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="border-y border-slate-900 bg-slate-950 px-6 py-10">
        <div className="mx-auto max-w-7xl grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
          <div>
            <p className="text-4xl font-extrabold text-cyan-400">10k+</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
              Bookings Completed
            </p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-white">4.9★</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
              Average Rating
            </p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-500">250+</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
              Verified Partners
            </p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-white">100%</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
              Satisfaction Pledge
            </p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES */}
      <section className="px-6 py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center md:text-left md:flex md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Explore Services By Category
              </h2>
              <p className="mt-2 text-slate-400">
                Select a category to view matching listings instantly
              </p>
            </div>
            <Link
              href="/services"
              className="mt-4 md:mt-0 flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Browse All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {categories.length === 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-36 rounded-2xl border border-slate-800 bg-slate-900/30 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/services?categoryId=${cat.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5"
                >
                  <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition duration-300">
                    <img
                      src={getCategoryImage(cat.slug)}
                      alt={cat.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="text-3xl mb-4">
                      {categoryIcons[cat.slug.toLowerCase()] ?? "🛠️"}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-cyan-400 transition">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. FEATURED SERVICES */}
      <section className="px-6 py-20 bg-slate-900/20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Top Handpicked Services
            </h2>
            <p className="mt-2 text-slate-400">
              Discover premium offers highly rated by our customer base
            </p>
          </div>

          {loadingServices ? (
            <div className="grid gap-8 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-72 rounded-2xl border border-slate-800 bg-slate-900/60 animate-pulse"
                />
              ))}
            </div>
          ) : featuredServices.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <p>
                No services available yet.{" "}
                <Link
                  href="/register?role=PROVIDER"
                  className="text-cyan-400 hover:underline"
                >
                  Be the first provider!
                </Link>
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {featuredServices.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg group hover:border-cyan-500/30 transition duration-300"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={getCategoryImage(service.category?.slug)}
                      alt={service.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {service.category && (
                      <span className="absolute top-4 left-4 rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold text-slate-950">
                        {service.category.name}
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="mt-2 text-xl font-bold text-white group-hover:text-cyan-400 transition">
                        {service.title}
                      </h3>
                      {service.provider && (
                        <p className="text-xs text-slate-500 mt-1">
                          By {service.provider.name}
                        </p>
                      )}
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                      <div>
                        <p className="text-xs text-slate-500">Service Fee</p>
                        <p className="text-xl font-bold text-cyan-400">
                          ${Number(service.price).toFixed(2)}
                        </p>
                      </div>
                      <Link
                        href={`/services/${service.id}`}
                        className="flex items-center justify-center rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 text-xs transition cursor-pointer"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 hover:border-cyan-400 hover:text-cyan-400 transition"
            >
              View All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="px-6 py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              How It Works
            </h2>
            <p className="mt-2 text-slate-400">
              Get your tasks completed in four simplified steps
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative p-6 rounded-2xl border border-slate-900 bg-slate-900/10 hover:bg-slate-900/20 transition"
              >
                <span className="text-5xl font-black text-slate-800/30 absolute right-6 top-6">
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-white mt-4">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BECOME A PROVIDER CTA */}
      <section className="px-6 py-20 bg-slate-950">
        <div className="mx-auto max-w-5xl rounded-3xl border border-blue-500/20 bg-linear-to-br from-blue-950/20 to-slate-900 p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5">
            <Layers className="h-96 w-96 text-blue-500" />
          </div>
          <div className="flex-1 space-y-4 relative z-10 text-center md:text-left">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <Activity className="h-3 w-3" /> Join the Network
            </span>
            <h2 className="text-3xl font-bold md:text-4xl">
              Grow Your Business on ServiceHub
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Are you an independent provider looking for clients? Register
              today as a Provider to publish services, schedule client bookings,
              manage reviews, and get paid instantly.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-green-400" /> Zero signup
                fees
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-green-400" /> Set your own
                rates
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-green-400" /> 24/7
                business dashboard
              </div>
            </div>
          </div>
          <div className="shrink-0 relative z-10">
            <Link
              href="/register?role=PROVIDER"
              className="inline-flex items-center justify-center rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold px-8 py-4 shadow-lg transition cursor-pointer"
            >
              Start Earning <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="px-6 py-20 bg-slate-900/10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mt-2 text-slate-400">
              Read verified reviews from customers about booked professionals
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between relative"
              >
                <MessageSquare className="h-8 w-8 text-cyan-500/10 absolute right-6 top-6" />
                <div>
                  <div className="flex gap-0.5 text-yellow-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm italic text-slate-300 leading-relaxed font-light">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 border-t border-slate-800/60 pt-4">
                  <p className="font-bold text-slate-200 text-sm">{t.author}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="px-6 py-20 bg-slate-950">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl flex items-center justify-center gap-2">
              <HelpCircle className="h-8 w-8 text-cyan-400" /> Frequently Asked
              Questions
            </h2>
            <p className="mt-2 text-slate-400">
              Clear and concise info on bookings, pricing, and cancellations
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-900 bg-slate-900/20 overflow-hidden"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full py-4 px-6 text-left flex justify-between items-center hover:bg-slate-900/40 transition cursor-pointer"
                >
                  <span className="font-semibold text-sm md:text-base">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${faqOpen === idx ? "rotate-180" : ""}`}
                  />
                </button>
                {faqOpen === idx && (
                  <div className="py-4 px-6 border-t border-slate-900 text-xs md:text-sm text-slate-400 leading-relaxed bg-slate-950/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. NEWSLETTER */}
      <section className="px-6 py-20 bg-slate-950">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/40 p-8 md:p-12 text-center backdrop-blur-md">
          <h2 className="text-2xl font-bold md:text-3xl">Stay in the Loop</h2>
          <p className="mx-auto mt-3 max-w-xl text-xs md:text-sm text-slate-400">
            Get notified when new service categories and providers go live in
            your area.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const emailInput = form.elements.namedItem(
                "email",
              ) as HTMLInputElement;
              emailInput.value = "";
              // Real email subscription would POST to an endpoint here
            }}
            className="mx-auto mt-8 max-w-md flex flex-col sm:flex-row gap-3"
          >
            <input
              name="email"
              type="email"
              placeholder="Enter your email address"
              required
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 text-sm transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              Subscribe <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-6 text-slate-500 text-xs md:text-sm">
        <div className="mx-auto max-w-7xl grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <Link
              href="/"
              className="text-xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            >
              ServiceHub
            </Link>
            <p className="text-xs leading-relaxed max-w-xs">
              ServiceHub is a marketplace matching vetted service providers with
              local clients.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-300 uppercase tracking-widest text-xs mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/services" className="hover:text-slate-300">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link
                  href="/services?search=cleaning"
                  className="hover:text-slate-300"
                >
                  Cleaning
                </Link>
              </li>
              <li>
                <Link
                  href="/services?search=plumbing"
                  className="hover:text-slate-300"
                >
                  Plumbing
                </Link>
              </li>
              <li>
                <Link
                  href="/services?search=electrical"
                  className="hover:text-slate-300"
                >
                  Electrical
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-300 uppercase tracking-widest text-xs mb-4">
              Partnership
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/register?role=PROVIDER"
                  className="hover:text-slate-300"
                >
                  Join as Provider
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-slate-300">
                  Provider Login
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-slate-300">
                  Browse Listings
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-300 uppercase tracking-widest text-xs mb-4">
              Trust & Safety
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-cyan-400" /> Fully Insured
              </li>
              <li className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-cyan-400" /> Premium Quality
              </li>
              <li className="flex items-center gap-1.5">
                <HeartHandshake className="h-4 w-4 text-cyan-400" /> 100%
                Satisfaction
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl border-t border-slate-900 mt-10 pt-8 text-center text-xs text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>
            &copy; {new Date().getFullYear()} ServiceHub Inc. All rights
            reserved.
          </span>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-slate-400 cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
