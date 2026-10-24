
import { api } from "./api.js";

export async function getAdminBookings({
  page = 1,
  limit = 5,
  search = "",
  status,
  paymentStatus,
  serviceId,
  startDate,
  endDate,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) params.set("search", search.trim());
  if (status) params.set("status", status);
  if (paymentStatus) params.set("paymentStatus", paymentStatus);
  if (serviceId) params.set("serviceId", serviceId);
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  return api.get(`/admin/bookings?${params.toString()}`);
}

export async function getAdminBookingById(id) {
  return api.get(`/admin/bookings/${encodeURIComponent(id)}`);
}


export async function confirmAdminBooking(id) {
  return api.patch(
    `/admin/bookings/${encodeURIComponent(id)}/confirm`
  );
}


export async function cancelAdminBooking(id, reason) {
  return api.patch(
    `/admin/bookings/${encodeURIComponent(id)}/cancel`,
    { reason }
  );
}

export async function completeAdminBooking(id) {
  return api.patch(
    `/admin/bookings/${encodeURIComponent(id)}/complete`
  );
}


export async function deliverAdminBookingReport(id) {
  return api.patch(
    `/admin/bookings/${encodeURIComponent(id)}/deliver-report`
  );
}