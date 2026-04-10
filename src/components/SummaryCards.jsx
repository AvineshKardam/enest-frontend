import { BarChart3, Layers, TrendingUp } from "lucide-react";
import { categoryIcon } from "../lib/categories.js";
import { formatInr } from "../lib/formatCurrency.js";

function topCategory(expenses) {
  if (!expenses.length) return null;

  const totals = new Map();
  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) || 0) + expense.amount);
  }

  let bestName = null;
  let bestTotal = 0;

  for (const [name, total] of totals.entries()) {
    if (total > bestTotal) {
      bestName = name;
      bestTotal = total;
    }
  }

  return bestName ? { name: bestName, total: bestTotal } : null;
}

function Skeleton() {
  return <div className="h-28 animate-pulse rounded-2xl bg-slate-100" aria-hidden />;
}

export function SummaryCards({ expenses, loading }) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const count = expenses.length;
  const top = topCategory(expenses);
  const TopIcon = top ? categoryIcon[top.name] : TrendingUp;

  if (loading && !expenses.length) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Total spending</p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-slate-900">
              {formatInr(total)}
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <TrendingUp className="h-5 w-5" />
          </span>
        </div>
        <p className="mt-3 text-xs text-slate-400">Based on current filters</p>
      </article>

      <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Expenses</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{count}</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Layers className="h-5 w-5" />
          </span>
        </div>
        <p className="mt-3 text-xs text-slate-400">Records in this view</p>
      </article>

      <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-500">Top category</p>
            {top ? (
              <>
                <p className="mt-1 truncate text-lg font-semibold text-slate-900">{top.name}</p>
                <p className="font-mono text-sm text-slate-600">{formatInr(top.total)}</p>
              </>
            ) : (
              <p className="mt-1 text-slate-400">-</p>
            )}
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            {top ? <TopIcon className="h-5 w-5" /> : <BarChart3 className="h-5 w-5" />}
          </span>
        </div>
        <p className="mt-3 text-xs text-slate-400">Highest spend in view</p>
      </article>
    </div>
  );
}
