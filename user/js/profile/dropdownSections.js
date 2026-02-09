export function initSectionDropdowns() {
  document.querySelectorAll(".dropdown-header").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      const arrow = btn.querySelector(".arrow");

      target.classList.toggle("open");
      arrow.textContent =
        target.classList.contains("open") ? "▴" : "▾";
    });
  });
}
