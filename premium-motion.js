
/* =========================================================
   SAMUEL ODEYEMI — PREMIUM MOTION SYSTEM
   Entrance animations, scroll reveals, skill bars,
   smooth scrolling, and accessibility fallbacks.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const hasGSAP = typeof window.gsap !== "undefined";
  const hasScrollTrigger =
    hasGSAP && typeof window.ScrollTrigger !== "undefined";
  const hasLenis = typeof window.Lenis !== "undefined";

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  const revealElements = [
    ".section-heading",
    ".about-intro",
    ".skills-panel",
    ".experience-item",
    ".projects-intro",
    ".project-card",
    ".projects-footer",
    ".contact-main",
    ".contact-links",
  ];

  /* ---------------------------------------------------------
     1. PREPARE SKILL BARS
     --------------------------------------------------------- */

  function prepareSkillBars() {
    document.querySelectorAll(".skill-fill").forEach((bar) => {
      const row = bar.closest("[data-skill]");

      if (row) {
        const skillValue = Number(row.dataset.skill);
        const safeValue = Math.min(100, Math.max(0, skillValue || 0));

        bar.style.setProperty("--skill-width", `${safeValue}%`);
      }
    });
  }

  /* ---------------------------------------------------------
     2. SIMPLE FALLBACK REVEALS
     Used if GSAP or ScrollTrigger is unavailable.
     --------------------------------------------------------- */

  function showAllElements() {
    document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right")
      .forEach((element) => {
        element.classList.add("is-visible");
        element.style.opacity = "1";
        element.style.visibility = "visible";
        element.style.transform = "none";
      });

    document.querySelectorAll(".skills-panel").forEach((panel) => {
      panel.classList.add("is-visible");
    });
  }

  function setupFallbackReveals() {
    const elements = document.querySelectorAll(revealElements.join(", "));

    if (!("IntersectionObserver" in window)) {
      showAllElements();
      return;
    }

    elements.forEach((element) => {
      element.classList.add("reveal-up");
    });

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");

          if (entry.target.matches(".skills-panel")) {
            entry.target.classList.add("is-visible");
          }

          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));
  }

  /* ---------------------------------------------------------
     3. GSAP SCROLL REVEALS
     --------------------------------------------------------- */

  function setupGSAPReveals() {
    if (!hasGSAP || !hasScrollTrigger) {
      setupFallbackReveals();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    revealElements.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        if (element.dataset.motionReady === "true") return;

        element.dataset.motionReady = "true";
        element.classList.add("reveal-up");

        gsap.fromTo(
          element,
          {
            autoAlpha: 0,
            y: 28,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            delay: selector === ".project-card" ? (index % 3) * 0.08 : 0,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
            onComplete: () => {
              element.classList.add("is-visible");
              element.style.removeProperty("visibility");
            },
          }
        );
      });
    });
  }

  /* ---------------------------------------------------------
     4. HERO ENTRANCE
     --------------------------------------------------------- */

  function setupHeroAnimation() {
    const hero = document.querySelector(".hero");

    if (!hero || !hasGSAP || prefersReducedMotion) return;

    const heroItems = hero.querySelectorAll(
      ".hero-eyebrow, .hero-title, .hero-description, " +
      ".hero-actions, .hero-meta, .hero-visual, .hero-image, .hero-scroll"
    );

    if (!heroItems.length) return;

    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    timeline.fromTo(
      heroItems,
      {
        autoAlpha: 0,
        y: 24,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.1,
        clearProps: "transform",
      }
    );
  }

  /* ---------------------------------------------------------
     5. SKILL BAR ANIMATION
     --------------------------------------------------------- */

  function setupSkillAnimations() {
    const panels = document.querySelectorAll(".skills-panel");

    if (!panels.length) return;

    if (prefersReducedMotion) {
      panels.forEach((panel) => panel.classList.add("is-visible"));
      return;
    }

    if (hasGSAP && hasScrollTrigger) {
      panels.forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top 82%",
          once: true,
          onEnter: () => {
            panel.classList.add("is-visible");
          },
        });
      });

      return;
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, currentObserver) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.2 }
      );

      panels.forEach((panel) => observer.observe(panel));
    } else {
      panels.forEach((panel) => panel.classList.add("is-visible"));
    }
  }

  /* ---------------------------------------------------------
     6. LENIS SMOOTH SCROLLING
     --------------------------------------------------------- */

  function setupSmoothScrolling() {
    if (prefersReducedMotion) return;

    let lenis = null;

    if (hasLenis) {
      lenis = new window.Lenis({
        duration: 1.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
      });

      window.lenis = lenis;

      if (hasGSAP && hasScrollTrigger) {
        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
      }
    }

    /* Smooth-scroll internal links and respect sticky header. */
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        let target;

        try {
          target = document.querySelector(href);
        } catch {
          return;
        }

        if (!target) return;

        event.preventDefault();

        if (lenis) {
          lenis.scrollTo(target, {
            offset: -80,
            duration: 1.1,
          });
        } else {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }

        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", href);
        }
      });
    });
  }

  /* ---------------------------------------------------------
     7. PROJECT IMAGE MICRO-INTERACTIONS
     --------------------------------------------------------- */

  function setupProjectInteractions() {
    if (prefersReducedMotion) return;

    document.querySelectorAll(".project-card").forEach((card) => {
      const image = card.querySelector(".project-image img");

      if (!image) return;

      card.addEventListener("mouseenter", () => {
        if (hasGSAP) {
          gsap.to(image, {
            scale: 1.045,
            duration: 0.65,
            ease: "power2.out",
            overwrite: true,
          });
        }
      });

      card.addEventListener("mouseleave", () => {
        if (hasGSAP) {
          gsap.to(image, {
            scale: 1,
            duration: 0.65,
            ease: "power2.out",
            overwrite: true,
          });
        }
      });
    });
  }

  /* ---------------------------------------------------------
     8. REFRESH SCROLL TRIGGERS AFTER IMAGES LOAD
     --------------------------------------------------------- */

  function setupLayoutRefresh() {
    if (!hasScrollTrigger) return;

    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
    });

    document.querySelectorAll("img").forEach((image) => {
      if (!image.complete) {
        image.addEventListener(
          "load",
          () => ScrollTrigger.refresh(),
          { once: true }
        );
      }
    });
  }

  /* ---------------------------------------------------------
     9. INITIALIZE
     --------------------------------------------------------- */

  prepareSkillBars();

  if (prefersReducedMotion) {
    showAllElements();
    return;
  }

  setupGSAPReveals();
  setupHeroAnimation();
  setupSkillAnimations();
  setupSmoothScrolling();
  setupProjectInteractions();
  setupLayoutRefresh();

  console.info("Premium motion system initialized.");
});
