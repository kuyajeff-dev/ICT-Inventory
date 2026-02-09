import { logout } from "../js/userAuth.js";

export function bindLogoutButtons() {
  document.getElementById("logoutBtn")
    ?.addEventListener("click", logout);

  document.getElementById("mobileLogoutBtn")
    ?.addEventListener("click", logout);
}
