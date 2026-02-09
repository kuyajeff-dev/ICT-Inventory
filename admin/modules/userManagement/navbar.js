// modules/navbar.js
export function initNavbar() {
  const avatar = document.getElementById('avatar');
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  const dropdown = document.getElementById('dropdown');

  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
  // Avatar dropdown
avatar.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdown.style.display =
    dropdown.style.display === 'flex' ? 'none' : 'flex';
});

document.addEventListener('click', () => {
  dropdown.style.display = 'none';
});
}
