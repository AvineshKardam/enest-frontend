import { Filter, Search, X } from "lucide-react";
import { CATEGORIES } from "../lib/categories.js";

export function ExpenseFilters({ value, onChange }) {
  const hasActive =
    value.category !== "all" || value.dateFrom || value.dateTo || value.search.trim();

  function clear() {
    onChange({ category: "all", dateFrom: "", dateTo: "", search: "" });
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[var(--shadow-card)] sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-800">
          <Filter className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold">Filters</h2>
        </div>
        {hasActive ? (
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search title..."
            value={value.search}
            onChange={(event) => onChange({ ...value, search: event.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-300 focus:bg-white focus:ring-4"
            aria-label="Search expenses by title"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Category</label>
          <select
            value={value.category}
            onChange={(event) => onChange({ ...value, category: event.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-500/15"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">From date</label>
          <input
            type="date"
            value={value.dateFrom}
            onChange={(event) => onChange({ ...value, dateFrom: event.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-500/15"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">To date</label>
          <input
            type="date"
            value={value.dateTo}
            onChange={(event) => onChange({ ...value, dateTo: event.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-500/15"
          />
        </div>
      </div>
    </section>
  );
}
