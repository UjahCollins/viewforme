
import { api } from "./api.js";

export async function loginAdmin(credentials) {
  return api.post("/admin/auth/login", credentials);
}

export async function getCurrentAdmin() {
  return api.get("/admin/auth/me");
}

export async function logoutAdmin() {
  return api.post("/admin/auth/logout");
}
