import { useMemo, useState } from "react";

import { createCheckoutOrder } from "../services/api";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const initialCheckoutForm = {
  deliveryAddress: "",
  paymentMethod: "cod",
};

function Checkout({
  cartItems,
  onNavigate,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  authUser,
}) {
  const [checkoutForm, setCheckoutForm] = useState(initialCheckoutForm);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [placedOrder, setPlacedOrder] = useState(null);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (accumulator, item) =>
          accumulator + Number(item.price) * Number(item.quantity),
        0,
      ),
    [cartItems],
  );
  const taxAmount = Number((subtotal * 0.05).toFixed(2));
  const deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 40;
  const totalAmount = subtotal + taxAmount + deliveryFee;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCheckoutForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!checkoutForm.deliveryAddress.trim()) {
      return "Delivery address is required.";
    }

    if (!cartItems.length) {
      return "Your cart is empty.";
    }

    return "";
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    const validationMessage = validate();

    if (validationMessage) {
      setNotice({ type: "error", message: validationMessage });
      return;
    }

    setSubmitting(true);
    setNotice({ type: "", message: "" });
    setPlacedOrder(null);

    try {
      const response = await createCheckoutOrder({
        ...checkoutForm,
        deliveryAddress: checkoutForm.deliveryAddress.trim(),
        items: cartItems.map((item) => ({
          menuId: item._id,
          quantity: item.quantity,
        })),
      });

      setNotice({
        type: "success",
        message: `Order placed successfully. Order ID: ${response.data._id}`,
      });
      setPlacedOrder(response.data);
      setCheckoutForm(initialCheckoutForm);
      onClearCart();
    } catch (requestError) {
      setNotice({ type: "error", message: requestError.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-4xl border-white/10 p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="section-kicker text-xs font-semibold text-amber-200/70">
              Cart and checkout
            </div>
            <h1 className="mt-3 text-4xl text-white sm:text-5xl">
              Complete your order
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-stone-300">
              Review dishes, update quantities, and place a confirmed order into
              the database.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("menu")}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
          >
            Back to Menu
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-4xl border-white/10 p-6 sm:p-8">
          <h2 className="text-3xl text-white">Cart Items</h2>

          {!cartItems.length ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-stone-300">
              Your cart is currently empty.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <article
                  key={item._id}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-stone-300">
                        {currencyFormatter.format(item.price)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item._id, -1)}
                        className="h-9 w-9 rounded-full border border-white/15 text-lg text-white transition hover:bg-white/10"
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item._id, 1)}
                        className="h-9 w-9 rounded-full border border-white/15 text-lg text-white transition hover:bg-white/10"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-stone-400">
                      Line total:{" "}
                      {currencyFormatter.format(item.price * item.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item._id)}
                      className="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-500/20"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <section className="glass-panel rounded-4xl border-white/10 p-6 sm:p-8">
            <h2 className="text-3xl text-white">Order Summary</h2>

            <div className="mt-6 space-y-3 text-stone-200">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{currencyFormatter.format(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax (5%)</span>
                <span>{currencyFormatter.format(taxAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Fee</span>
                <span>{currencyFormatter.format(deliveryFee)}</span>
              </div>
              <div className="mt-3 border-t border-white/10 pt-3 text-lg font-semibold text-white flex items-center justify-between">
                <span>Total</span>
                <span>{currencyFormatter.format(totalAmount)}</span>
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-4xl border-white/10 p-6 sm:p-8">
            <h2 className="text-3xl text-white">Checkout Details</h2>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-stone-200">
              <p>Logged in as: {authUser?.name}</p>
              <p>{authUser?.email}</p>
              <p>{authUser?.phone}</p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleCheckout}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-stone-200">
                  Address
                </span>
                <textarea
                  name="deliveryAddress"
                  rows="3"
                  value={checkoutForm.deliveryAddress}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-stone-500 focus:border-amber-300/60"
                  placeholder="House no, street, city"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-stone-200">
                  Payment Method
                </span>
                <select
                  name="paymentMethod"
                  value={checkoutForm.paymentMethod}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-amber-300/60"
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={submitting || !cartItems.length}
                className="inline-flex w-full justify-center rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>

            {notice.message ? (
              <p
                className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                  notice.type === "success"
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                    : "border-rose-400/30 bg-rose-400/10 text-rose-100"
                }`}
              >
                {notice.message}
              </p>
            ) : null}

            {placedOrder ? (
              <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-emerald-50">
                <h3 className="text-xl font-semibold">Order Placed Summary</h3>

                <div className="mt-3 space-y-1 text-sm text-emerald-100">
                  <p>Order ID: {placedOrder._id}</p>
                  <p>Status: {placedOrder.status}</p>
                  <p>Payment: {placedOrder.paymentMethod.toUpperCase()}</p>
                  <p>Delivery Address: {placedOrder.deliveryAddress}</p>
                  <p>
                    Ordered At:{" "}
                    {new Date(placedOrder.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 space-y-2 rounded-xl border border-emerald-300/20 bg-slate-950/40 p-4 text-sm">
                  {placedOrder.items.map((item, index) => (
                    <div
                      key={`${placedOrder._id}-${index}`}
                      className="flex items-center justify-between"
                    >
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>{currencyFormatter.format(item.lineTotal)}</span>
                    </div>
                  ))}

                  <div className="mt-2 border-t border-white/15 pt-2 text-emerald-100">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span>
                        {currencyFormatter.format(placedOrder.subtotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tax</span>
                      <span>
                        {currencyFormatter.format(placedOrder.taxAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Delivery</span>
                      <span>
                        {currencyFormatter.format(placedOrder.deliveryFee)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-base font-semibold text-white">
                      <span>Total</span>
                      <span>
                        {currencyFormatter.format(placedOrder.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate("dashboard")}
                    className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
                  >
                    Track in My Orders
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate("menu")}
                    className="rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Continue Ordering
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </section>
    </div>
  );
}

export default Checkout;
