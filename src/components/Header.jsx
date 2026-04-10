import { Wallet } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
            <Wallet className="h-6 w-6" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              Expense Tracker
            </h1>
            <p className="text-sm text-slate-500">
              Add, filter, and review spending in one place
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
