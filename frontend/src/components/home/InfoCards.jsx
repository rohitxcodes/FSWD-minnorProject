const cards = [
  {
    title: "About Us",
    description:
      "We blend a modern kitchen workflow with a simple customer experience, built for fast ordering and clean data capture.",
    label: "Story",
  },
  {
    title: "Menu",
    description:
      "Browse dishes directly from the backend, filter by price range, and confirm orders with a single tap.",
    label: "Explore",
  },
  {
    title: "Working Hours",
    description:
      "Monday to Friday: 11:00 AM - 10:30 PM. Weekends: 10:00 AM - 11:00 PM for relaxed dining.",
    label: "Hours",
  },
];

function InfoCards({ onNavigate }) {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.title}
          className="glass-panel hover-lift fade-up-delay rounded-[1.75rem] border-white/10 p-6"
        >
          <div className="section-kicker text-xs font-semibold text-amber-200/70">
            {card.label}
          </div>
          <h2 className="mt-3 text-3xl text-white">{card.title}</h2>
          <p className="mt-4 leading-7 text-stone-300">{card.description}</p>
          {card.title === "Menu" ? (
            <button
              type="button"
              onClick={() => onNavigate("menu")}
              className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-amber-300/30 hover:bg-amber-300/10"
            >
              View Menu
            </button>
          ) : null}
        </article>
      ))}
    </section>
  );
}

export default InfoCards;
