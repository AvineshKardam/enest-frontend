import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export async function fetchExpenses(params) {
  const { data } = await api.get("/api/expenses", { params });
  return data;
}

export async function fetchMonthlySummary(params) {
  const { data } = await api.get("/api/expenses/summary/monthly", { params });
  return data.months;
}

export async function createExpense(body) {
  const { data } = await api.post("/api/expenses", body);
  return data;
}

export async function deleteExpense(id) {
  await api.delete(`/api/expenses/${id}`);
}
