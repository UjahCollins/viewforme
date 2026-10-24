import { api } from "./api.js";

export async function getAdminViewers({
  page = 1,
  limit = 100,
  status,
  city,
  coverageArea,
  search,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) params.set("status", status);
  if (city) params.set("city", city);
  if (coverageArea) params.set("coverageArea", coverageArea);
  if (search?.trim()) params.set("search", search.trim());

  return api.get(`/admin/viewers?${params.toString()}`);
}

export async function getAdminViewerById(id) {
  return api.get(
    `/admin/viewers/${encodeURIComponent(id)}`
  );
}