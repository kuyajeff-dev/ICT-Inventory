// modules/main.js
import { checkAdminAuth,logout } from './auth.js'; 
import { UserManager } from './userManagement/user.js';
import { initNavbar } from './userManagement/navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  await checkAdminAuth();
  new UserManager();

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', logout);
});
