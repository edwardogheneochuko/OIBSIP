// =========================================================
// Portfolio enhancements (optional JS, allowed by the task)
// =========================================================

const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");

// 1. Add a background to the navbar once the page is scrolled
function handleScroll() {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
}

// 2. Highlight the nav link of the section currently on screen
function highlightActiveLink() {
  let currentId = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) {
      currentId = section.id;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
  });
}

window.addEventListener("scroll", () => {
  handleScroll();
  highlightActiveLink();
});

// 3. Close the mobile menu after a link is tapped
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.checked = false;
  });
});

// 4. Keep the footer year up to date
document.getElementById("year").textContent = new Date().getFullYear();

handleScroll();
highlightActiveLink();
