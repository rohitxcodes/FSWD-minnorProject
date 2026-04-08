import { useMemo, useState } from "react";

import { getSampleFoodImage } from "../../utils/sampleFoodImages";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function MenuCard({ item, onAddToCart }) {
  const imageUrl = useMemo(
    () => item.imageUrl || getSampleFoodImage(item.name),
    [item.imageUrl, item.name],
  );
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <article className="glass-panel hover-lift flex h-full flex-col justify-between rounded-[1.75rem] border-white/10 p-6">
      <div>
        {!hasImageError ? (
          <img
            src={imageUrl}
            alt={item.name}
            loading="lazy"
            onError={() => setHasImageError(true)}
            className="mb-5 h-44 w-full rounded-2xl border border-white/10 object-cover"
          />
        ) : (
          <div className="mb-5 flex h-44 w-full items-center justify-center rounded-2xl border border-white/10 bg-linear-to-br from-amber-500/20 to-emerald-500/20 text-sm font-semibold text-stone-200">
            Food image unavailable
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <h3 className="text-2xl text-white">{item.name}</h3>
          <div className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-sm font-semibold text-amber-100">
            {currencyFormatter.format(item.price)}
          </div>
        </div>
        <p className="mt-4 min-h-20 leading-7 text-stone-300">
          {item.description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onAddToCart(item)}
        className="mt-6 inline-flex w-fit rounded-full bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
      >
        Add to Cart
      </button>
    </article>
  );
}

export default MenuCard;
