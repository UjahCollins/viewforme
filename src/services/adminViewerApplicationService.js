
import { api } from "./api.js";

export async function getAdminViewerApplications({
  page = 1,
  limit = 20,
  status,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status && status !== "All") {
    params.set("status", status);
  }

  return api.get(
    `/admin/viewer-applications?${params.toString()}`
  );
}

export async function getAdminViewerApplicationById(id) {
  return api.get(
    `/admin/viewer-applications/${encodeURIComponent(id)}`
  );
}

export async function markViewerApplicationUnderReview(
  id,
  reviewNotes
) {
  return api.patch(
    `/admin/viewer-applications/${encodeURIComponent(id)}/review`,
    { reviewNotes }
  );
}

export async function approveViewerApplication(
  id,
  reviewNotes
) {
  return api.patch(
    `/admin/viewer-applications/${encodeURIComponent(id)}/approve`,
    { reviewNotes }
  );
}

export async function rejectViewerApplication(
  id,
  reviewNotes
) {
  return api.patch(
    `/admin/viewer-applications/${encodeURIComponent(id)}/reject`,
    { reviewNotes }
  );
}
