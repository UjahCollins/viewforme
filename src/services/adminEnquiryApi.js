
import { api } from "./api.js";

// Fetch all enquiries, optionally filtered
export async function getAdminEnquiries(params = {}) {
  const query = new URLSearchParams();

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params.status && params.status !== "ALL") {
    query.set("status", params.status);
  }

  const queryString = query.toString();

  return api.get(
    `/admin/enquiries${queryString ? `?${queryString}` : ""}`
  );
}

// Fetch a single enquiry
export async function getAdminEnquiryById(id) {
  return api.get(`/admin/enquiries/${encodeURIComponent(id)}`);
}

// Update enquiry status
export async function updateAdminEnquiryStatus(id, status) {
  return api.patch(
    `/admin/enquiries/${encodeURIComponent(id)}/status`,
    { status }
  );
}

// Delete an enquiry
export async function deleteAdminEnquiry(id) {
  return api.delete(
    `/admin/enquiries/${encodeURIComponent(id)}`
  );
}
