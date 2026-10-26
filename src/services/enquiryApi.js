
import { api } from "./api.js";

export async function submitEnquiry(payload) {
  return api.post("/enquiries", payload);
}
