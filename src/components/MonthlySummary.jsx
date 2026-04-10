import { CalendarRange, Loader2 } from "lucide-react";
import { formatInr } from "../lib/formatCurrency.js";

export function MonthlySummary({ months, loading }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <CalendarRange className="h-5 w-5 text-indigo-600" />
        <h2 className="text-base font-semibold text-slate-900">Monthly summary</h2>
      </div>
      <p className="mb-4 text-sm text-slate-500">
        Total spent per month (respects your current filters).
      </p>

      {loading && !months.length ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : !months.length ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-10 text-center text-sm text-slate-500">
          No data for this filter range.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {months.map((month) => (
            <article
              key={month.key}
              className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50/80 to-white p-4 transition hover:border-indigo-200 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {month.label}
              </p>
              <p className="mt-2 font-mono text-xl font-bold text-slate-900">
                {formatInr(month.total)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {month.count} expense{month.count === 1 ? "" : "s"}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
