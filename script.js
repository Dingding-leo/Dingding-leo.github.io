document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 0. DARK MODE TOGGLE
    // =========================================
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    function updateThemeIcon(theme) {
        if (!sunIcon || !moonIcon) return;
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    // Initialize icon based on current theme (set in head.html)
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeIcon(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // =========================================
    // 1. PAGE LOADER & TRANSITIONS
    // =========================================
    const loader = document.getElementById('pageLoader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('loaded');
            }, 800);
        });
        if (document.readyState === 'complete') {
            setTimeout(() => loader.classList.add('loaded'), 800);
        }
    }

    // =========================================
    // 2. AUTO YEAR
    // =========================================
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // =========================================
    // 3. SCROLL REVEAL (Enhanced)
    // =========================================
    const observerOptions = { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 };
    
    // Auto-stagger logic for elements appearing at the same time
    let revealQueue = [];
    let revealTimer = null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                revealQueue.push(entry.target);
                observer.unobserve(entry.target);
            }
        });

        if (revealQueue.length > 0 && !revealTimer) {
            revealTimer = setTimeout(() => {
                revealQueue.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('in-view');
                    }, index * 100); // 100ms stagger
                });
                revealQueue = [];
                revealTimer = null;
            }, 50);
        }
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // =========================================
    // 4. MOUSE SPOTLIGHT & 3D TILT
    // =========================================
    const cards = document.querySelectorAll('.project-card, .note-link');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Spotlight
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // 3D Tilt
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4; // Max rotation 4deg
            const rotateY = ((x - centerX) / centerX) * 4;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // =========================================
    // 5. NAV SHADOW & READING PROGRESS & PARALLAX
    // =========================================
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('readingProgressBar');
    const backToTopBtn = document.getElementById('backToTop');
    const heroBg = document.querySelector('.hero-parallax-bg'); // If implemented

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Nav
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }

        // Reading Progress
        if (progressBar) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollY / docHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Back to top
        if (backToTopBtn) {
            if (scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================================
    // 6. HAMBURGER MENU (Mobile)
    // =========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // =========================================
    // 7. ANIMATED STAT COUNTERS
    // =========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'), 10);
                    animateCounter(el, 0, target, 1200);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el, start, end, duration) {
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);
            el.textContent = current;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // =========================================
    // 8. SMOOTH ANCHOR SCROLL
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // =========================================
    // 9. IMAGE FADE-IN
    // =========================================
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
            img.addEventListener('error', () => img.classList.add('loaded'));
        }
    });

});
