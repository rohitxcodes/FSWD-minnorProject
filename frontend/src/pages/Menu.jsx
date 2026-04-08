import { useEffect, useState } from "react";

import MenuList from "../components/menu/MenuList";
import { getMenu } from "../services/api";

const initialFilters = {
  minPrice: "",
  maxPrice: "",
};

function Menu({ onNavigate, onAddToCart, cartCount }) {
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const loadMenu = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getMenu(appliedFilters);
        setMenuItems(response.data || []);
      } catch (requestError) {
        setError(requestError.message);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, [appliedFilters]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAppliedFilters(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const handleAddToCart = (item) => {
    onAddToCart(item);
    setNotice(`${item.name} added to cart.`);
  };

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-4xl border-white/10 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="section-kicker text-xs font-semibold text-amber-200/70">
              Menu browser
            </div>
            <h1 className="mt-3 text-4xl text-white sm:text-5xl">
              Browse the current menu
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-stone-300">
              Menu data is fetched from the backend and can be filtered by price
              before rendering. Add items to cart, then continue to checkout.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
          >
            Back to Home
          </button>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => onNavigate("checkout")}
            className="rounded-full bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Go to Checkout ({cartCount})
          </button>
        </div>

        <form
          className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr_auto_auto]"
          onSubmit={handleSubmit}
        >
          <label>
            <span className="mb-2 block text-sm font-medium text-stone-200">
              Minimum price
            </span>
            <input
              type="number"
              name="minPrice"
              min="0"
              value={filters.minPrice}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-stone-500 focus:border-amber-300/60"
              placeholder="0"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-medium text-stone-200">
              Maximum price
            </span>
            <input
              type="number"
              name="maxPrice"
              min="0"
              value={filters.maxPrice}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-stone-500 focus:border-amber-300/60"
              placeholder="500"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Filter Menu
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
          >
            Reset
          </button>
        </form>

        {error ? (
          <p className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </p>
        ) : null}

        {notice ? (
          <p className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {notice}
          </p>
        ) : null}
      </section>

      <MenuList
        items={menuItems}
        loading={loading}
        onAddToCart={handleAddToCart}
        emptyMessage="No dishes match the selected price range."
      />
    </div>
  );
}

export default Menu;
