import { useState } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import { CATEGORIES } from "../lib/categories.js";

function validate(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = "Title is required";
  if (!values.category) errors.category = "Category is required";
  if (!values.date) errors.date = "Date is required";

  const amount = parseFloat(values.amount);
  if (values.amount === "" || Number.isNaN(amount)) errors.amount = "Amount is required";
  else if (amount <= 0) errors.amount = "Amount must be greater than 0";

  return errors;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseForm({ onSubmit, submitting }) {
  const [values, setValues] = useState({
    title: "",
    amount: "",
    category: "",
    date: today(),
  });
  const [errors, setErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    await onSubmit({
      title: values.title.trim(),
      amount: parseFloat(values.amount),
      category: values.category,
      date: new Date(`${values.date}T12:00:00`).toISOString(),
    });

    setValues({ title: "", amount: "", category: "", date: today() });
    setErrors({});
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <PlusCircle className="h-5 w-5 text-blue-600" />
        <h2 className="text-base font-semibold text-slate-900">New expense</h2>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
        <div className="sm:col-span-2 lg:col-span-4">
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            autoComplete="off"
            placeholder="e.g. Lunch with team"
            value={values.title}
            onChange={(event) => setValues((state) => ({ ...state, title: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-300 focus:bg-white focus:ring-4"
          />
          {errors.title ? <p className="mt-1 text-sm text-red-600">{errors.title}</p> : null}
        </div>

        <div className="sm:col-span-1 lg:col-span-2">
          <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-slate-700">
            Amount (₹)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={values.amount}
            onChange={(event) => setValues((state) => ({ ...state, amount: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 font-mono text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-300 focus:bg-white focus:ring-4"
          />
          {errors.amount ? <p className="mt-1 text-sm text-red-600">{errors.amount}</p> : null}
        </div>

        <div className="sm:col-span-1 lg:col-span-3">
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            id="category"
            value={values.category}
            onChange={(event) =>
              setValues((state) => ({ ...state, category: event.target.value }))
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-300 focus:bg-white focus:ring-4"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category ? (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2 lg:col-span-2">
          <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-slate-700">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={values.date}
            onChange={(event) => setValues((state) => ({ ...state, date: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-300 focus:bg-white focus:ring-4"
          />
          {errors.date ? <p className="mt-1 text-sm text-red-600">{errors.date}</p> : null}
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
            Add
          </button>
        </div>
      </form>
    </section>
  );
}
