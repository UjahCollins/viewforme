import { api } from "./api.js";

export async function getAdminAssignments({
  bookingId,
  viewerId,
  status,
  page = 1,
  limit = 100,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (bookingId) params.set("bookingId", bookingId);
  if (viewerId) params.set("viewerId", viewerId);
  if (status) params.set("status", status);

  return api.get(`/admin/assignments?${params.toString()}`);
}

export async function createAdminAssignment({
  bookingId,
  viewerId,
  notes,
}) {
  return api.post("/admin/assignments", {
    bookingId,
    viewerId,
    ...(notes?.trim() && { notes: notes.trim() }),
  });
}

export async function acceptAdminAssignment(id) {
  return api.patch(
    `/admin/assignments/${encodeURIComponent(id)}/accept`,
    {}
  );
}

export async function declineAdminAssignment(id, reason) {
  return api.patch(
    `/admin/assignments/${encodeURIComponent(id)}/decline`,
    { reason }
  );
}

export async function cancelAdminAssignment(id, reason) {
  return api.patch(
    `/admin/assignments/${encodeURIComponent(id)}/cancel`,
    { reason }
  );
}