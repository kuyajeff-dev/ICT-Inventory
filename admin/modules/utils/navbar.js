export function initNavbar() {
  // auto highlight active nav link
  const links = document.querySelectorAll(".nav-links li");

  links.forEach(li => {
    li.classList.remove("active");
  });

  const currentPath = window.location.pathname;

  links.forEach(li => {
    const anchor = li.querySelector("a");
    const href = anchor.getAttribute("href");

    // if current URL includes href, set active
    if (currentPath.includes(href.replace('./', '/'))) {
      li.classList.add("active");
    }
  });
}
