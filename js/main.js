/**
 * Actor Portfolio Website - Main JavaScript
 * Handles navigation, gallery filtering, lightbox, form submission, and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    Gallery.init();
    Lightbox.init();
    ContactForm.init();
    ScrollAnimations.init();
    SmoothScroll.init();
});

/**
 * Navigation Module
 * Handles mobile menu toggle and scroll-based navbar styling
 */
const Navigation = {
    navbar: null,
    navToggle: null,
    navMenu: null,
    navLinks: null,

    init() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        if (!this.navbar || !this.navToggle || !this.navMenu) return;

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Close menu on resize if switching to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
    },

    toggleMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    },

    closeMenu() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    },

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    },

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
};

/**
 * Gallery Module
 * Handles filtering of gallery items by category
 */
const Gallery = {
    filterButtons: null,
    galleryItems: null,

    init() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.galleryItems = document.querySelectorAll('.gallery-item');

        if (this.filterButtons.length === 0) return;

        this.bindEvents();
    },

    bindEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.filterGallery(e));
        });
    },

    filterGallery(e) {
        const filter = e.target.dataset.filter;

        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Filter items
        this.galleryItems.forEach(item => {
            const category = item.dataset.category;

            if (filter === 'all' || category === filter) {
                item.classList.remove('hidden');
                item.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                item.classList.add('hidden');
            }
        });
    }
};

/**
 * Lightbox Module
 * Handles image lightbox for gallery
 */
const Lightbox = {
    lightbox: null,
    lightboxImage: null,
    currentIndex: 0,
    galleryItems: [],

    init() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = this.lightbox?.querySelector('.lightbox-image');
        this.galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

        if (!this.lightbox || this.galleryItems.length === 0) return;

        this.bindEvents();
    },

    bindEvents() {
        // Open lightbox on gallery item click
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => this.open(index));
        });

        // Close button
        this.lightbox.querySelector('.lightbox-close')?.addEventListener('click', () => this.close());

        // Navigation buttons
        this.lightbox.querySelector('.lightbox-prev')?.addEventListener('click', () => this.prev());
        this.lightbox.querySelector('.lightbox-next')?.addEventListener('click', () => this.next());

        // Close on background click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.close();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
            }
        });
    },

    open(index) {
        // Filter out hidden items
        const visibleItems = this.galleryItems.filter(item => !item.classList.contains('hidden'));
        this.currentIndex = visibleItems.indexOf(this.galleryItems[index]);

        if (this.currentIndex === -1) this.currentIndex = 0;

        this.updateImage(visibleItems);
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    },

    prev() {
        const visibleItems = this.galleryItems.filter(item => !item.classList.contains('hidden'));
        this.currentIndex = (this.currentIndex - 1 + visibleItems.length) % visibleItems.length;
        this.updateImage(visibleItems);
    },

    next() {
        const visibleItems = this.galleryItems.filter(item => !item.classList.contains('hidden'));
        this.currentIndex = (this.currentIndex + 1) % visibleItems.length;
        this.updateImage(visibleItems);
    },

    updateImage(visibleItems) {
        const item = visibleItems[this.currentIndex];
        const placeholder = item.querySelector('.image-placeholder span');
        const text = placeholder ? placeholder.textContent : 'Gallery Image';

        // In a real implementation, you would set the actual image source
        this.lightboxImage.innerHTML = text;
    }
};

/**
 * Contact Form Module
 * Handles form validation and submission
 */
const ContactForm = {
    form: null,

    init() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;

        this.bindEvents();
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    },

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Validate all fields
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Simulate form submission
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            console.log('Form data:', data);
            this.showSuccess();
            this.form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    },

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        if (field.required && !value) {
            this.showError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }

        if (isValid) {
            this.clearError(field);
        }

        return isValid;
    },

    showError(field, message) {
        this.clearError(field);
        field.style.borderColor = '#e74c3c';
        const error = document.createElement('span');
        error.className = 'error-message';
        error.textContent = message;
        error.style.cssText = 'color: #e74c3c; font-size: 0.8rem; margin-top: 0.25rem; display: block;';
        field.parentNode.appendChild(error);
    },

    clearError(field) {
        field.style.borderColor = '';
        const error = field.parentNode.querySelector('.error-message');
        if (error) error.remove();
    },

    showSuccess() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div style="background: #2ecc71; color: white; padding: 1rem; border-radius: 4px; margin-bottom: 1rem; text-align: center;">
                Thank you for your message! I'll get back to you soon.
            </div>
        `;
        this.form.insertBefore(message, this.form.firstChild);

        setTimeout(() => {
            message.remove();
        }, 5000);
    }
};

/**
 * Scroll Animations Module
 * Handles fade-in animations on scroll
 */
const ScrollAnimations = {
    animatedElements: null,
    observer: null,

    init() {
        // Add fade-in class to elements that should animate
        const elementsToAnimate = document.querySelectorAll(
            '.about-content, .resume-category, .reel-container, .additional-reels, ' +
            '.gallery-grid, .contact-info, .contact-form-wrapper'
        );

        elementsToAnimate.forEach(el => el.classList.add('fade-in'));

        this.animatedElements = document.querySelectorAll('.fade-in');

        if (this.animatedElements.length === 0) return;

        this.setupObserver();
    },

    setupObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        this.animatedElements.forEach(el => {
            this.observer.observe(el);
        });
    }
};

/**
 * Smooth Scroll Module
 * Enhances anchor link scrolling
 */
const SmoothScroll = {
    init() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }
};

/**
 * Utility: Debounce function
 * Limits the rate at which a function can fire
 */
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Video Placeholder Click Handler
 * In production, this would open a video modal or play an embedded video
 */
document.querySelectorAll('.play-button, .play-button-small').forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        // In a real implementation, you would:
        // 1. Open a modal with the video
        // 2. Or redirect to a video page
        // 3. Or play an embedded video
        console.log('Video play button clicked - integrate your video player here');
        alert('Replace this with your actual demo reel video embed (YouTube, Vimeo, etc.)');
    });
});
