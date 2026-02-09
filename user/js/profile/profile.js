import { checkUserAuth } from "../userAuth.js";
import { initDropdowns } from "../dashboard/dropdowns.js";
import { initSectionDropdowns } from "./dropdownSections.js";
import { loadProfile } from "./profileService.js";

document.addEventListener("DOMContentLoaded", async () => {
  await checkUserAuth();

  initDropdowns();          // avatar dropdown
  initSectionDropdowns();   // profile sections

  await loadProfile();

  // Example data - replace with your real data
const stats = {
  return: 5,
  transfer: 3,
  unserviceable: 2,
  retired: 1,
  transferred: 4
};

document.getElementById("countReturn").innerText = stats.return;
document.getElementById("countTransfer").innerText = stats.transfer;
document.getElementById("countUnserviceable").innerText = stats.unserviceable;
document.getElementById("countRetired").innerText = stats.retired;
document.getElementById("countTransferred").innerText = stats.transferred;

});
