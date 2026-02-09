import { checkAdminAuth, logout } from './auth.js';
import { initNavbar } from './utils/navbar.js';

import { SelectOptions } from './form/selectOptions.js';
import { populateSelect } from './form/dom.js';
import { loadUsers } from './form/users.js';
import { initStepper } from './form/stepper.js';
import { initAssetForm } from './form/assetForm.js';

document.addEventListener("DOMContentLoaded", async () => {
  initNavbar();

  const auth = await checkAdminAuth();
  const adminUserId = auth?.id;

  document.getElementById("logoutBtn")?.addEventListener("click", logout);

  // populate select options
  Object.entries(SelectOptions).forEach(([id, options]) => {
    populateSelect(id, options);
  });

  const userOptions = await loadUsers();
  populateSelect("accountableOfficer", userOptions);
  populateSelect("receivedBy", userOptions);

  initStepper();
  initAssetForm(adminUserId);
});
