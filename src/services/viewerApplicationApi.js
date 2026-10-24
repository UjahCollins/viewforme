
import { api } from "./api.js";

export async function submitViewerApplication(payload) {
  return api.post("/viewers/apply", payload);
}
