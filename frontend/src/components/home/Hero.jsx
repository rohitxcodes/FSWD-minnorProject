function Hero({ onViewMenu, onOpenDashboard }) {
  return (
    <section className="glass-panel fade-up overflow-hidden rounded-4xl border-white/10">
      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8 px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-16">
          <span className="section-kicker inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-semibold text-amber-100">
            Seasonal menu. Fast ordering. Fresh hospitality.
          </span>
          <div className="space-y-5">
            <h1 className="max-w-2xl text-5xl leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              Welcome to What&apos;s Fare is Fair
            </h1>
            <p className="max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
              A clean restaurant experience built on a modern MERN stack, ready
              for consumer signups, menu discovery, and a production-ready
              dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onViewMenu}
              className="rounded-full bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              Explore Menu
            </button>
            <button
              type="button"
              onClick={onOpenDashboard}
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
            >
              Open Dashboard
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["12+", "Signature dishes"],
              ["15 min", "Average prep window"],
              ["4.9", "Guest satisfaction"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/8 bg-white/5 p-4"
              >
                <div className="text-2xl font-semibold text-white">{value}</div>
                <div className="mt-1 text-sm text-stone-400">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-image-frame relative min-h-[28rem]">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
            <div className="max-w-sm rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5 backdrop-blur-md">
              <div className="text-xs uppercase tracking-[0.3em] text-amber-200/70">
                Featured dish
              </div>
              <div className="mt-3 text-2xl font-semibold text-white">
                Smoked citrus bowl
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-300">
                A bright, seasonal plate designed for quick ordering and easy
                filtering by price.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
