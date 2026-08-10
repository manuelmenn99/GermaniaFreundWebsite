document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. HEADER SCROLL EFFECT ---
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    
    // --- 2. MOBILE MENU TOGGLE ---
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navLinks.classList.toggle('mobile-active');
            
            // Prevent body scroll when menu is open
            if (navLinks.classList.contains('mobile-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when a link is clicked (except dropdown toggles on mobile)
        navLinks.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navLinks.classList.remove('mobile-active');
                document.body.style.overflow = '';
            });
        });

        // Toggle dropdowns on mobile
        const dropdowns = navLinks.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    if (window.innerWidth <= 992) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const isActive = dropdown.classList.contains('active');
                        // Close other dropdowns
                        dropdowns.forEach(d => {
                            if (d !== dropdown) d.classList.remove('active');
                        });
                        
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });
    }
    
    
    // --- 3. ACTIVE LINK HIGHLIGHTER ---
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-link');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        const isTeamSubPage = currentPath.includes('erste-mannschaft.html') || 
                              currentPath.includes('zweite-mannschaft.html') || 
                              currentPath.includes('frauenmannschaft.html');
        // Check if current path ends with href, or if it's a team sub-page, or if it's the home page
        if (currentPath.endsWith(href) || 
            (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('index.html') || currentPath === '')) ||
            (href === 'mannschaften.html' && isTeamSubPage)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    
    // --- 4. SCROLL REVEAL ANIMATIONS (FAIRLY SIMPLE) ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };
    
    // Add css styles dynamically for reveal elements
    const style = document.createElement('style');
    style.innerHTML = `
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
    
    
    // --- 5. TEAM & VEREIN FILTERING (TABS WITH HASH SUPPORT) ---
    const teamButtons = document.querySelectorAll('.team-btn');
    const teamSections = document.querySelectorAll('.team-section-wrapper');
    
    function activateTab(targetId) {
        // Set active button
        teamButtons.forEach(btn => {
            if (btn.getAttribute('data-target') === targetId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show target section, hide others
        teamSections.forEach(sec => {
            if (sec.id === targetId) {
                sec.classList.add('active');
            } else {
                sec.classList.remove('active');
            }
        });
    }

    if (teamButtons.length > 0 && teamSections.length > 0) {
        teamButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');
                activateTab(target);
                // Update hash in URL without jumping
                history.pushState(null, null, '#' + target);
            });
        });

        // Activate tab from URL hash on page load
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                const buttonExists = Array.from(teamButtons).some(btn => btn.getAttribute('data-target') === hash);
                if (buttonExists) {
                    activateTab(hash);
                }
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Run on initial load
    }
    
    
    // --- 7. MOBILE CARD FLIP FOR YOUTH TEAMS ---
    const youthItems = document.querySelectorAll('.youth-item');
    youthItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // If the user clicked on a link (like email), don't prevent default or toggle flip
                if (e.target.closest('a')) {
                    return;
                }
                e.preventDefault();
                
                const isFlipped = item.classList.contains('flipped');
                // Close other flipped cards
                youthItems.forEach(y => {
                    if (y !== item) y.classList.remove('flipped');
                });
                
                item.classList.toggle('flipped');
            }
        });
    });

    // --- 8. AUTO UPDATE COPYRIGHT YEAR ---
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    
});
