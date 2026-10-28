
/* =========================================================
   SAMUEL ODEYEMI — PREMIUM PORTFOLIO
   File: script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // -------------------------------------------------------
  // 1. ELEMENTS
  // -------------------------------------------------------

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const scrollProgress = document.getElementById("scrollProgress");
  const currentYear = document.getElementById("currentYear");

  const navigationLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
  );

  const pageSections = document.querySelectorAll(
    "main section[id]"
  );

  // -------------------------------------------------------
  // 2. CURRENT YEAR
  // -------------------------------------------------------

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------
  // 3. MOBILE NAVIGATION
  // -------------------------------------------------------

  function openMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.add("is-open");
    menuToggle.classList.add("is-active");
    document.body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
  }

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("is-open");
    menuToggle.classList.remove("is-active");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.contains("is-open");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close the menu when a navigation link is clicked.
    navigationLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close the menu with the Escape key.
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        navLinks.classList.contains("is-open")
      ) {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Close the menu if the screen becomes desktop-sized.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // -------------------------------------------------------
  // 4. SCROLL PROGRESS BAR
  // -------------------------------------------------------

  let scrollTicking = false;

  function updateScrollProgress() {
    if (!scrollProgress) return;

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (scrollableHeight <= 0) {
      scrollProgress.style.width = "0%";
      return;
    }

    const scrollPosition =
      window.scrollY || document.documentElement.scrollTop;

    const progress = Math.min(
      100,
      Math.max(0, (scrollPosition / scrollableHeight) * 100)
    );

    scrollProgress.style.width = `${progress}%`;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;

      scrollTicking = true;

      window.requestAnimationFrame(() => {
        updateScrollProgress();
        scrollTicking = false;
      });
    },
    { passive: true }
  );

  updateScrollProgress();

  // -------------------------------------------------------
  // 5. ACTIVE NAVIGATION LINK
  // -------------------------------------------------------

  function setActiveLink(sectionId) {
    navigationLinks.forEach((link) => {
      const targetId = link.getAttribute("href");

      if (targetId === `#${sectionId}`) {
        link.classList.add("active");
        link.setAttribute("aria-current", "location");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && pageSections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visibleSections.length > 0) {
          setActiveLink(visibleSections[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    pageSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // -------------------------------------------------------
  // 6. IMAGE FALLBACKS
  // -------------------------------------------------------

  const projectImages = document.querySelectorAll(
    ".project-image img, .hero-portrait"
  );

  projectImages.forEach((img) => {
    img.addEventListener("error", () => {
      img.classList.add("image-unavailable");
      console.warn(
        `Portfolio image could not be loaded: ${img.getAttribute("src")}`
      );
    });
  });

  // -------------------------------------------------------
  // 7. REDUCED MOTION PREFERENCE
  // -------------------------------------------------------

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (prefersReducedMotion.matches) {
    document.documentElement.classList.add("reduce-motion");
  }

  // -------------------------------------------------------
  // 8. CONSOLE MESSAGE
  // -------------------------------------------------------

  console.log(
    "%cSamuel Odeyemi — Portfolio",
    "font-size: 16px; font-weight: bold; color: #245bff;"
  );

  console.log(
    "%cBuilt with intention.",
    "font-size: 12px; color: #858b97;"
  );
});
