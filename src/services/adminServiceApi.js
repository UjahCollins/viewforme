
import { api } from "./api.js";

export async function getAdminServices() {
  return api.get("/admin/services");
}
