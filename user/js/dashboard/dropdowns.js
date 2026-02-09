export function initDropdowns() {
  const avatar = document.getElementById("avatar");
  const dropdown = document.getElementById("dropdown");

  if (!avatar || !dropdown) return;

  avatar.addEventListener("click", () => {
    dropdown.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!avatar.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });
}
