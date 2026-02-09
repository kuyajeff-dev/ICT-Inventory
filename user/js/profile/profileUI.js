export function renderUser(user) {
  if (!user) return;

  document.getElementById("profileName").textContent =
    user.fullname || "Unknown User";

  document.querySelector(".profile-email").textContent =
    user.email || "-";
}

export function showError(message) {
  const container = document.querySelector(".profile-container");
  container.innerHTML = `
    <div style="padding:2rem; text-align:center; color:#b00020;">
      <h3>Error</h3>
      <p>${message}</p>
    </div>
  `;
}
