import { checkUserAuth } from "../userAuth.js";
import { bindLogoutButtons } from "../authUI.js";
import { initDropdowns } from "./dropdowns.js";
import { loadDashboardData } from "./dashboardData.js";
import { setWelcomeName } from "./dashboardUI.js";


document.addEventListener("DOMContentLoaded", async () => {
  const user = await checkUserAuth();

  bindLogoutButtons();
  initDropdowns();
  setWelcomeName(user.fullname);

  await loadDashboardData();
});
