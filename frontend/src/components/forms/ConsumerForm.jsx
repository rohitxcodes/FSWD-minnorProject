import { useState } from "react";

import { createConsumer } from "../../services/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
};

function ConsumerForm() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!formData.name.trim()) {
      return "Name is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      return "Enter a valid email address.";
    }

    if (!/^[0-9+\-()\s]{7,20}$/.test(formData.phone.trim())) {
      return "Enter a valid phone number.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validate();

    if (validationMessage) {
      setStatus({ type: "error", message: validationMessage });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await createConsumer({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });

      setStatus({
        type: "success",
        message: response.message || "Consumer registered successfully.",
      });
      setFormData(initialForm);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="glass-panel fade-up-delay-2 rounded-[1.75rem] border-white/10 p-6 sm:p-8">
      <div className="mb-6">
        <div className="section-kicker text-xs font-semibold text-amber-200/70">
          Consumer registration
        </div>
        <h2 className="mt-3 text-3xl text-white">Reserve your next meal</h2>
        <p className="mt-3 max-w-2xl leading-7 text-stone-300">
          Register once and keep the customer flow clean. Validation runs on the
          frontend and backend, with duplicate email protection on the API.
        </p>
      </div>

      <form className="grid gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-stone-200">
            Name
          </span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-stone-500 focus:border-amber-300/60"
            placeholder="Enter full name"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-stone-200">
            Email
          </span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-stone-500 focus:border-amber-300/60"
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
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-stone-500 focus:border-amber-300/60"
            placeholder="9876543210"
          />
        </label>

        <div className="md:col-span-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full justify-center rounded-full bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {submitting ? "Submitting..." : "Register Consumer"}
          </button>

          {status.message ? (
            <p
              className={`rounded-2xl border px-4 py-3 text-sm ${
                status.type === "success"
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                  : "border-rose-400/30 bg-rose-400/10 text-rose-100"
              }`}
            >
              {status.message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default ConsumerForm;
