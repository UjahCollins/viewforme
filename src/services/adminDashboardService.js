import { api } from "./api.js";

export async function getAdminDashboardOverview() {
  return api.get("/admin/dashboard/overview");
}