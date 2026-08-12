import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-6">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-400">
            Service marketplace
          </p>

          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Find trusted services.
            <span className="text-violet-500"> Book with confidence.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            ServiceHub connects customers with trusted service providers.
            Discover services, book appointments, and manage everything in one
            place.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/services"
              className="rounded-lg bg-violet-600 px-6 py-3 font-medium text-white hover:bg-violet-700"
            >
              Browse Services
            </Link>

            <Link
              href="/register"
              className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-200 hover:bg-slate-900"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
