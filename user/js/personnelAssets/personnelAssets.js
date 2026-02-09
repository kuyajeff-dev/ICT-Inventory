import { checkUserAuth } from "../userAuth.js";
import { bindLogoutButtons } from "../authUI.js";
import { loadPersonnelAssets } from "./personnelAssetsService.js";

document.addEventListener("DOMContentLoaded", async () => {
  await checkUserAuth();
  bindLogoutButtons();

  const params = new URLSearchParams(window.location.search);
  const personnelId = params.get("personnelId");

  if (!personnelId) {
    alert("No personnel selected");
    return;
  }

  await loadPersonnelAssets(personnelId);
});
