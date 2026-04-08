import { useEffect, useState } from "react";

import { getOrders } from "../services/api";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function Dashboard({ onNavigate, isAuthenticated }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await getOrders();
        setOrders(response.data || []);
      } catch (requestError) {
        setError(requestError.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-4xl border-white/10 p-6 sm:p-8">
        <div className="section-kicker text-xs font-semibold text-amber-200/70">
          User dashboard
        </div>
        <h1 className="mt-3 text-4xl text-white sm:text-5xl">
          Track your orders
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-stone-300">
          Review all orders placed from your account and monitor current status.
        </p>

        {!isAuthenticated ? (
          <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-5 text-rose-100">
            Please login first to view your dashboard.
          </div>
        ) : null}
      </section>

      {isAuthenticated ? (
        <section className="glass-panel rounded-4xl border-white/10 p-6 sm:p-8">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-2xl border border-white/8 bg-white/5"
                />
              ))}
            </div>
          ) : error ? (
            <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </p>
          ) : !orders.length ? (
            <div className="rounded-2xl border border-white/8 bg-white/5 p-6 text-stone-300">
              No orders found for your account yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-lg font-semibold text-white">
                      Order #{order._id.slice(-6)}
                    </p>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-stone-300">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>

                  <div className="mt-4 grid gap-2">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order._id}-${index}`}
                        className="flex items-center justify-between text-sm text-stone-200"
                      >
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>{currencyFormatter.format(item.lineTotal)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-4 flex items-center justify-between text-white font-semibold">
                    <span>Total</span>
                    <span>{currencyFormatter.format(order.totalAmount)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}

      <section>
        <button
          type="button"
          onClick={() => onNavigate("menu")}
          className="rounded-full bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
        >
          Browse Menu
        </button>
      </section>
    </div>
  );
}

export default Dashboard;
