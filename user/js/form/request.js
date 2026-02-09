import { checkUserAuth } from "../userAuth.js";
import { initDropdowns } from "../dashboard/dropdowns.js";
import { SelectOptions } from './selectOptions.js';
import { populateSelect } from './dom.js';
import { loadPersonnel } from './users.js';
import { initStepper } from './stepper.js';
import { initAssetForm } from './assetForm.js';

document.addEventListener("DOMContentLoaded", async () => {
  const auth = await checkUserAuth();
  const userId = auth ?.id;

  initDropdowns();
   // populate select options
    Object.entries(SelectOptions).forEach(([id, options]) => {
      populateSelect(id, options);
    });
  
    const userOptions = await loadPersonnel();
    populateSelect("accountableOfficer", userOptions);
    populateSelect("receivedBy", userOptions);
  
    initStepper();
    initAssetForm(userId);
});
