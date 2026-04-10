import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal.jsx";
import { ExpenseFilters } from "./components/ExpenseFilters.jsx";
import { ExpenseForm } from "./components/ExpenseForm.jsx";
import { ExpenseList } from "./components/ExpenseList.jsx";
import { Header } from "./components/Header.jsx";
import { MonthlySummary } from "./components/MonthlySummary.jsx";
import { SummaryCards } from "./components/SummaryCards.jsx";
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  fetchMonthlySummary,
} from "./lib/api.js";

function filtersToParams(filters) {
  const params = {};
  if (filters.category && filters.category !== "all") params.category = filters.category;
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;
  if (filters.search.trim()) params.search = filters.search.trim();
  return params;
}

function apiMessage(error) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.errors?.length) return data.errors.join(" ");
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }

  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [months, setMonths] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    dateFrom: "",
    dateTo: "",
    search: "",
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const searchDebounceRef = useRef(null);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 320);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [filters.search]);

  const queryParams = useMemo(
    () => filtersToParams({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  );

  const loadData = useCallback(async () => {
    setListLoading(true);
    setMonthlyLoading(true);

    try {
      const [expenseRows, monthRows] = await Promise.all([
        fetchExpenses(queryParams),
        fetchMonthlySummary(queryParams),
      ]);
      setExpenses(expenseRows);
      setMonths(monthRows);
    } catch (error) {
      toast.error(apiMessage(error));
      setExpenses([]);
      setMonths([]);
    } finally {
      setListLoading(false);
      setMonthlyLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreate(payload) {
    setFormSubmitting(true);
    try {
      const created = await createExpense(payload);
      setExpenses((previous) =>
        [created, ...previous].sort(
          (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
        ),
      );
      fetchMonthlySummary(queryParams).then(setMonths).catch(() => {});
      fetchExpenses(queryParams).then(setExpenses).catch(() => {});
      toast.success("Expense added");
    } catch (error) {
      toast.error(apiMessage(error));
    } finally {
      setFormSubmitting(false);
    }
  }

  const deleteTarget = deleteId ? expenses.find((expense) => expense._id === deleteId) : null;

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleteLoading(true);

    try {
      await deleteExpense(deleteId);
      setExpenses((previous) => previous.filter((expense) => expense._id !== deleteId));
      fetchMonthlySummary(queryParams).then(setMonths).catch(() => {});
      toast.success("Expense deleted");
      setDeleteId(null);
    } catch (error) {
      toast.error(apiMessage(error));
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="min-h-screen pb-16">
      <Header />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <ExpenseForm onSubmit={handleCreate} submitting={formSubmitting} />
        <SummaryCards expenses={expenses} loading={listLoading} />
        <ExpenseFilters value={filters} onChange={setFilters} />
        <ExpenseList
          expenses={expenses}
          loading={listLoading}
          onDeleteClick={(id) => setDeleteId(id)}
        />
        <MonthlySummary months={months} loading={monthlyLoading} />
      </main>

      <DeleteConfirmModal
        open={Boolean(deleteId)}
        title={deleteTarget?.title || ""}
        loading={deleteLoading}
        onCancel={() => !deleteLoading && setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
