import { renderUser, showError } from "./profileUI.js";
import { renderAssets } from "./assetsTable.js";
import { renderPersonnel } from "./personnelTable.js";

export async function loadProfile() {
  try {
    const res = await fetch("/api/profile/profile", {
      credentials: "include"
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error("Invalid JSON response");
    }

    const { success, data } = await res.json();
    if (!success) throw new Error("API failed");

    renderUser(data.user);
    renderAssets(data.assets);
    renderPersonnel(data.personnel);

  } catch (err) {
    console.error("Profile fetch failed:", err);
    showError("Unable to load profile data. Please login again.");
  }
}
