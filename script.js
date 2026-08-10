// ==================== TYPING ANIMATION ==================== 
class TypingAnimation {
    constructor(element, words, speed = 100, delayBetweenWords = 2000) {
        this.element = element;
        this.words = words;
        this.speed = speed;
        this.delayBetweenWords = delayBetweenWords;
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isDeleting) {
            // Deleting characters
            this.currentCharIndex--;
            this.element.textContent = currentWord.substring(0, this.currentCharIndex);
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
                setTimeout(() => this.type(), 500);
            } else {
                setTimeout(() => this.type(), this.speed / 2);
            }
        } else {
            // Typing characters
            this.currentCharIndex++;
            this.element.textContent = currentWord.substring(0, this.currentCharIndex);
            
            if (this.currentCharIndex === currentWord.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.delayBetweenWords);
            } else {
                setTimeout(() => this.type(), this.speed);
            }
        }
    }
}

// ==================== NAVIGATION ==================== 
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navbarMenu = document.getElementById('navbarMenu');
        this.hamburger = document.getElementById('hamburger');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollListener();
        this.setupSmoothScroll();
    }

    setupEventListeners() {
        // Hamburger menu toggle
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());

        // Navigation links click
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.setActiveLink(e.target);
                this.closeMobileMenu();
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.navbarMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
        this.hamburger.setAttribute('aria-expanded', 
            this.hamburger.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
        );
    }

    closeMobileMenu() {
        this.navbarMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
    }

    setActiveLink(element) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        element.classList.add('active');
    }

    setupScrollListener() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollPosition = window.scrollY;

                    // Add/remove scrolled class for navbar styling
                    if (scrollPosition > 50) {
                        this.navbar.classList.add('scrolled');
                    } else {
                        this.navbar.classList.remove('scrolled');
                    }

                    // Update active link based on scroll position
                    this.updateActiveOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateActiveOnScroll() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        if (currentSection) {
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === currentSection) {
                    link.classList.add('active');
                }
            });
        }
    }

    setupSmoothScroll() {
        const smoothLinks = [
            ...this.navLinks,
            ...document.querySelectorAll('.hero-buttons a[href^="#"], .about-cta[href^="#"], .footer-link[href^="#"]')
        ];

        smoothLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                const section = document.querySelector(target);
                
                if (section) {
                    const headerHeight = this.navbar.offsetHeight;
                    const sectionTop = section.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: sectionTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ==================== PARALLAX EFFECT ==================== 
class ParallaxEffect {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleParallax());
    }

    handleParallax() {
        const scrollPosition = window.scrollY;
        const parallaxElements = document.querySelectorAll('.hero-background > div');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    }
}

// ==================== INTERSECTION OBSERVER ==================== 
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all elements with animation classes
        document.querySelectorAll('[class*="fadeInUp"]').forEach(el => {
            observer.observe(el);
        });
    }
}

// ==================== SMOOTH SCROLL ENHANCEMENT ==================== 
class ScrollEnhancements {
    constructor() {
        this.init();
    }

    init() {
        // Add scroll performance optimization
        this.optimizeScrollPerformance();
    }

    optimizeScrollPerformance() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
}

// ==================== ACCESSIBILITY ==================== 
class Accessibility {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceFocusManagement();
        this.addAriaLabels();
    }

    enhanceFocusManagement() {
        // Trap focus in mobile menu when open
        const navbarMenu = document.getElementById('navbarMenu');
        const hamburger = document.getElementById('hamburger');
        
        if (navbarMenu && hamburger) {
            navbarMenu.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    navbarMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    hamburger.focus();
                }
            });
        }
    }

    addAriaLabels() {
        // Add aria-current to active nav link
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) {
            activeLink.setAttribute('aria-current', 'page');
        }
    }
}

// ==================== BUTTON INTERACTIONS ==================== 
class ButtonInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.setupButtonEffects();
        this.setupCVDownload();
    }

    setupButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });

            // Add ripple effect
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    }

    createRipple(e, button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.pointerEvents = 'none';
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        const size = Math.max(rect.width, rect.height);
        const animation = ripple.animate([
            { width: '0', height: '0', opacity: 1 },
            { width: size + 'px', height: size + 'px', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        });

        animation.onfinish = () => ripple.remove();
    }

    setupCVDownload() {
        // Existing CV button behavior is handled by the native download attribute.
        // No custom click interception is needed.
    }
}

// ==================== INITIALIZATION ==================== 
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    const typedText = document.getElementById('typedText');
    if (typedText) {
        new TypingAnimation(typedText, [
            'Frontend Developer & UI Enthusiast',
            'Frontend Developer',
            'UI Enthusiast'
        ], 80, 2000);
    }

    new Navigation();
    new ParallaxEffect();
    new AnimationObserver();
    new ScrollEnhancements();
    new Accessibility();
    new ButtonInteractions();

    console.log('✅ Portfolio initialized successfully');
});

// ==================== PERFORMANCE MONITORING ==================== 
if ('PerformanceObserver' in window) {
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 100) {
                    console.warn(`⚠️ Long task detected: ${entry.name} (${entry.duration}ms)`);
                }
            }
        });
        observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
        // Long task API not available
    }
}
