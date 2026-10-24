
import { api } from "./api.js";

export async function getAdminViewers({
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

  return api.get(`/admin/viewers?${params.toString()}`);
}

export async function getAdminViewerById(id) {
  return api.get(
    `/admin/viewers/${encodeURIComponent(id)}`
  );
  
}


export async function updateAdminViewer(id, payload) {
  return api.patch(
    `/admin/viewers/${encodeURIComponent(id)}`,
    payload
  );
}

export async function updateAdminViewerStatus(id, status) {
  return api.patch(
    `/admin/viewers/${encodeURIComponent(id)}/status`,
    { status }
  );
}

