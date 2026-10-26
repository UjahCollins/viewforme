
import { api } from "./api.js";

export async function getAdminPayments({
  page = 1,
  limit = 20,
  status,
  search,
  startDate,
  endDate,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status && status !== "All") {
    params.set("status", status);
  }

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  if (startDate) {
    params.set("startDate", startDate);
  }

  if (endDate) {
    params.set("endDate", endDate);
  }

  return api.get(`/admin/payments?${params.toString()}`);
}

export async function getAdminPaymentSummary() {
  return api.get("/admin/payments/summary");
}

export async function getAdminPaymentById(paymentId) {
  return api.get(
    `/admin/payments/${encodeURIComponent(paymentId)}`
  );
}

export async function reconcileAdminPayment(paymentId) {
  return api.post(
    `/admin/payments/${encodeURIComponent(paymentId)}/reconcile`
  );
}
