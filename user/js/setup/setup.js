import { checkUserAuth } from "../userAuth.js";
import { initLocationPage } from "./setupHandlers.js";

document.addEventListener("DOMContentLoaded", async () => {
  const user = await checkUserAuth();

  if (!user) {
    Swal.fire("Unauthorized", "Please login first", "error");
    return;
  }

  initLocationPage(user);
});
