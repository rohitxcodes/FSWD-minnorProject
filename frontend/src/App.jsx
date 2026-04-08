import { useEffect, useState } from "react";

import "./App.css";
import Navbar from "./components/layout/Navbar";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import { clearAuthToken, getCurrentUser, getAuthToken } from "./services/api";

function App() {
  const [activePage, setActivePage] = useState("home");
  const [cartItems, setCartItems] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );
  const isAuthenticated = Boolean(authUser);
  const protectedPages = ["menu", "checkout", "dashboard"];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = getAuthToken();

      if (!token) {
        setAuthReady(true);
        return;
      }

      try {
        const response = await getCurrentUser();
        setAuthUser(response.data);
      } catch (error) {
        clearAuthToken();
        setAuthUser(null);
      } finally {
        setAuthReady(true);
      }
    };

    bootstrapAuth();
  }, []);

  const cartCount = cartItems.reduce(
    (accumulator, item) => accumulator + item.quantity,
    0,
  );

  const handleAddToCart = (menuItem) => {
    if (!menuItem || !menuItem._id) {
      return;
    }

    setCartItems((current) => {
      const existingItem = current.find((item) => item._id === menuItem._id);

      if (existingItem) {
        return current.map((item) =>
          item._id === menuItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { ...menuItem, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (menuId, delta) => {
    setCartItems((current) =>
      current
        .map((item) =>
          item._id === menuId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveFromCart = (menuId) => {
    setCartItems((current) => current.filter((item) => item._id !== menuId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const navigateToPage = (page) => {
    if (!isAuthenticated && protectedPages.includes(page)) {
      setActivePage("auth");
      return;
    }

    setActivePage(page);
  };

  const renderPage = () => {
    if (!authReady) {
      return (
        <div className="glass-panel rounded-4xl border-white/10 p-8 text-stone-200">
          Loading account...
        </div>
      );
    }

    if (activePage === "auth") {
      return (
        <Auth
          onAuthSuccess={(user) => {
            setAuthUser(user);
            setActivePage("dashboard");
          }}
        />
      );
    }

    if (activePage === "menu") {
      if (!isAuthenticated) {
        return (
          <div className="glass-panel rounded-4xl border-white/10 p-8 text-stone-200">
            Please login to access this page.
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setActivePage("auth")}
                className="rounded-full bg-amber-400 px-5 py-2 font-semibold text-slate-950"
              >
                Go to Login
              </button>
            </div>
          </div>
        );
      }

      return (
        <Menu
          onNavigate={navigateToPage}
          onAddToCart={handleAddToCart}
          cartCount={cartCount}
        />
      );
    }

    if (activePage === "checkout") {
      if (!isAuthenticated) {
        return (
          <div className="glass-panel rounded-4xl border-white/10 p-8 text-stone-200">
            Please login to continue with checkout.
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigateToPage("auth")}
                className="rounded-full bg-amber-400 px-5 py-2 font-semibold text-slate-950"
              >
                Go to Login
              </button>
            </div>
          </div>
        );
      }

      return (
        <Checkout
          onNavigate={navigateToPage}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
          authUser={authUser}
        />
      );
    }

    if (activePage === "dashboard") {
      return (
        <Dashboard
          onNavigate={navigateToPage}
          isAuthenticated={isAuthenticated}
        />
      );
    }

    return <Home onNavigate={navigateToPage} />;
  };

  return (
    <div className="app-shell soft-grid">
      <Navbar
        activePage={activePage}
        onNavigate={navigateToPage}
        cartCount={cartCount}
        isAuthenticated={isAuthenticated}
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => (current === "dark" ? "light" : "dark"))
        }
        userName={authUser?.name}
        onLogout={() => {
          clearAuthToken();
          setAuthUser(null);
          setActivePage("auth");
        }}
      />
      <main className="page-layer mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
