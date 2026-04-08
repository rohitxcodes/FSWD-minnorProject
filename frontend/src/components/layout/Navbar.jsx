const navItems = [
  { key: "home", label: "Home" },
  { key: "menu", label: "Menu" },
  { key: "checkout", label: "Checkout" },
  { key: "dashboard", label: "My Orders" },
];

const publicPages = ["home"];

function Navbar({
  activePage,
  onNavigate,
  cartCount,
  isAuthenticated,
  theme,
  onToggleTheme,
  userName,
  onLogout,
}) {
  return (
    <header className="page-layer sticky top-0 z-40 border-b border-white/8 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="text-left"
        >
          <div className="text-sm uppercase tracking-[0.35em] text-amber-200/75">
            Restaurant MERN
          </div>
          <div className="text-xl font-semibold text-white">
            What&apos;s Fare is Fair
          </div>
        </button>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 shadow-lg shadow-black/10">
            {navItems
              .filter(
                (item) => isAuthenticated || publicPages.includes(item.key),
              )
              .map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onNavigate(item.key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activePage === item.key
                      ? "bg-amber-400 text-slate-950"
                      : "text-stone-200 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.key === "checkout" && cartCount > 0 ? (
                    <span className="ml-2 rounded-full bg-slate-950/90 px-2 py-0.5 text-xs text-amber-200">
                      {cartCount}
                    </span>
                  ) : null}
                </button>
              ))}

            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => onNavigate("auth")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activePage === "auth"
                    ? "bg-amber-400 text-slate-950"
                    : "text-stone-200 hover:bg-white/8 hover:text-white"
                }`}
              >
                Login
              </button>
            ) : (
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-500/20"
              >
                Logout {userName ? `(${userName.split(" ")[0]})` : ""}
              </button>
            )}
          </nav>

          <button
            type="button"
            onClick={onToggleTheme}
            className="theme-toggle-btn rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-stone-200 transition hover:bg-white/12 hover:text-white"
            title="Toggle theme"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
