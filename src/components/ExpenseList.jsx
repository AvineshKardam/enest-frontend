import { format } from "date-fns";
import { Loader2, Receipt, Trash2 } from "lucide-react";
import { categoryAccent, categoryIcon } from "../lib/categories.js";
import { formatInr } from "../lib/formatCurrency.js";

export function ExpenseList({ expenses, loading, onDeleteClick }) {
  if (loading && !expenses.length) {
    return (
      <section className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" aria-label="Loading" />
      </section>
    );
  }

  if (!expenses.length) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Receipt className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">No expenses added yet</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
          Use the form above to log a purchase, or adjust filters if you expected to see
          results here.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
        <h2 className="text-sm font-semibold text-slate-900">All expenses</h2>
        {loading ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Updating...
          </span>
        ) : null}
      </div>

      <div className="hidden md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3 text-right">Amount</th>
              <th className="w-14 px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((expense) => {
              const Icon = categoryIcon[expense.category];
              const accent = categoryAccent[expense.category];

              return (
                <tr key={expense._id} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-5 py-3.5 font-medium text-slate-900">{expense.title}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${accent}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {format(new Date(expense.date), "MMM d, yyyy")}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-semibold text-slate-900">
                    {formatInr(expense.amount)}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => onDeleteClick(expense._id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${expense.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-slate-100 md:hidden">
        {expenses.map((expense) => {
          const Icon = categoryIcon[expense.category];
          const accent = categoryAccent[expense.category];

          return (
            <li key={expense._id} className="flex gap-3 p-4">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${accent}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{expense.title}</p>
                <p className="text-xs text-slate-500">
                  {expense.category} · {format(new Date(expense.date), "MMM d, yyyy")}
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-slate-800">
                  {formatInr(expense.amount)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDeleteClick(expense._id)}
                className="self-start rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                aria-label={`Delete ${expense.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
