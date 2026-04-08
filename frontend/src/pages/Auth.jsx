import { useState } from "react";

import { loginUser, registerUser, setAuthToken } from "../services/api";

const initialRegisterForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const initialLoginForm = {
  email: "",
  password: "",
};

function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterForm((current) => ({ ...current, [name]: value }));
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setNotice({ type: "", message: "" });

    try {
      const response = await registerUser({
        ...registerForm,
        name: registerForm.name.trim(),
        email: registerForm.email.trim(),
        phone: registerForm.phone.trim(),
      });

      const { token, user } = response.data;
      setAuthToken(token);
      onAuthSuccess(user);
      setNotice({ type: "success", message: "Account created and logged in." });
      setRegisterForm(initialRegisterForm);
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setNotice({ type: "", message: "" });

    try {
      const response = await loginUser({
        email: loginForm.email.trim(),
        password: loginForm.password,
      });

      const { token, user } = response.data;
      setAuthToken(token);
      onAuthSuccess(user);
      setNotice({ type: "success", message: "Login successful." });
      setLoginForm(initialLoginForm);
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-4xl border-white/10 p-6 sm:p-8">
        <div className="section-kicker text-xs font-semibold text-amber-200/70">
          JWT authentication
        </div>
        <h1 className="mt-3 text-4xl text-white sm:text-5xl">
          Access your account
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-stone-300">
          Register or login to get a bearer token and track all your orders.
        </p>

        <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "login"
                ? "bg-amber-400 text-slate-950"
                : "text-stone-200 hover:text-white"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "register"
                ? "bg-amber-400 text-slate-950"
                : "text-stone-200 hover:text-white"
            }`}
          >
            Register
          </button>
        </div>
      </section>

      <section className="glass-panel rounded-4xl border-white/10 p-6 sm:p-8">
        {mode === "login" ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-200">
                Email
              </span>
              <input
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-amber-300/60"
                placeholder="name@example.com"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-200">
                Password
              </span>
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-amber-300/60"
                placeholder="Enter password"
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
            >
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleRegister}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-200">
                Name
              </span>
              <input
                type="text"
                name="name"
                value={registerForm.name}
                onChange={handleRegisterChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-amber-300/60"
                placeholder="Full name"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-200">
                Email
              </span>
              <input
                type="email"
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-amber-300/60"
                placeholder="name@example.com"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-200">
                Phone
              </span>
              <input
                type="tel"
                name="phone"
                value={registerForm.phone}
                onChange={handleRegisterChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-amber-300/60"
                placeholder="9876543210"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-200">
                Password
              </span>
              <input
                type="password"
                name="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-amber-300/60"
                placeholder="Minimum 6 characters"
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Register"}
            </button>
          </form>
        )}

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
      </section>
    </div>
  );
}

export default Auth;
