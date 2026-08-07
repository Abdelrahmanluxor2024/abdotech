// ==================== NAVIGATION ==================== 
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

let ticking = false;

function onScroll() {
    const scrollY = window.scrollY;
    
    // Navbar background
    if (scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
    }
}, { passive: true });

// ==================== MOBILE MENU TOGGLE ====================
if (navToggle) {
    navToggle.addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            const isOpen = navMenu.classList.toggle('mobile-open');
            navToggle.classList.toggle('active', isOpen);
        }
    });
}

// Close mobile menu when a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('mobile-open');
            navToggle.classList.remove('active');
        }
    });
});

// ==================== COUNTER ANIMATION ====================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 1200;
    const start = performance.now();
    
    function step(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1);
        element.textContent = Math.floor(progress * target);
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(step);
}

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.classList.contains('animated')) {
                animateCounter(statNumber);
                statNumber.classList.add('animated');
            }
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-item').forEach(stat => {
    counterObserver.observe(stat);
});

// ==================== SMOOTH SCROLLING ====================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== CARD ANIMATIONS (CSS CLASS BASED) ====================
const cards = document.querySelectorAll('.philosophy-card, .skill-card, .contact-card, .project-card');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            cardObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '50px'
});

cards.forEach((card) => {
    cardObserver.observe(card);
});

// Console Branding
console.log('%c🚀 Built by Abdelrahman Yasser', 'color: #667eea; font-size: 14px; font-weight: bold;');

