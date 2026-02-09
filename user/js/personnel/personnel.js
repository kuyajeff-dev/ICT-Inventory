import { checkUserAuth } from "../userAuth.js";
import { initDropdowns } from "../dashboard/dropdowns.js";
import { initFullNameWatcher } from "./fullNameWatcher.js";
import { initPersonnelForm } from "./personnelForm.js";

document.addEventListener("DOMContentLoaded", async () => {
  await checkUserAuth();

  initDropdowns();
  initFullNameWatcher();
  initPersonnelForm();
});
