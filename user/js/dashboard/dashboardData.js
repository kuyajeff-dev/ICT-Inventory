import {
  updateStats,
  renderAssetsTable
} from "./dashboardUI.js";

export async function loadDashboardData() {
  try {
    const res = await fetch("/api/profile/profile", {
      credentials: "include"
    });

    const { success, data } = await res.json();
    if (!success) return;

    updateStats(data);
    renderAssetsTable(data.assets);

  } catch (err) {
    console.error("Failed to load dashboard data:", err);
  }
}
