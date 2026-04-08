import MenuCard from "./MenuCard";

function MenuList({
  items,
  loading,
  onAddToCart,
  emptyMessage = "No menu items found.",
}) {
  if (loading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="glass-panel h-56 animate-pulse rounded-[1.75rem] border-white/10 bg-white/5"
          />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="glass-panel rounded-[1.75rem] border-white/10 p-8 text-center text-stone-300">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <MenuCard
          key={item._id || item.name}
          item={item}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default MenuList;
