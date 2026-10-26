

import { api } from "./api.js";

export async function getAdminReports({
  page = 1,
  limit = 20,
  search,
  status,
  serviceId,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  if (status && status !== "All") {
    params.set("status", status);
  }

  if (serviceId && serviceId !== "All") {
    params.set("serviceId", serviceId);
  }

  return api.get(`/admin/reports?${params.toString()}`);
}

export async function getAdminReportSummary() {
  return api.get("/admin/reports/summary");
}

export async function getAdminReportById(reportId) {
  return api.get(
    `/admin/reports/${encodeURIComponent(reportId)}`
  );
}

export async function approveAdminReport(reportId) {
  return api.patch(
    `/admin/reports/${encodeURIComponent(reportId)}/approve`,
    {}
  );
}

export async function deliverAdminReport(reportId) {
  return api.patch(
    `/admin/reports/${encodeURIComponent(reportId)}/deliver`,
    {
      deliveryConfirmed: true,
    }
  );
}


/**
 * Update the content of a viewing report.
 *
 * Only DRAFT and SUBMITTED reports can be edited.
 *
 * @param {string} reportId
 * @param {object} payload
 */


export async function updateAdminReport(reportId, payload) {
  return api.patch(
    `/admin/reports/${encodeURIComponent(reportId)}`,
    payload
  );
}