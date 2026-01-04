/**
 * ========================================
 * KSHETRA INTERIORS - JAVASCRIPT
 * Premium Interior Design Website
 * ========================================
 * 
 * This file contains all interactive functionality:
 * - Hero image carousel with auto-slide
 * - Navigation menu (mobile toggle & scroll effects)
 * - Smooth scrolling navigation
 * - Scroll-triggered animations
 * - Form validation
 * - Back to top button
 */

// ========================================
// INITIALIZATION - Wait for DOM to be ready
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initCarousel();
    initNavigation();
    initSmoothScroll();
    initScrollAnimations();
    initFormValidation();
    initBackToTop();
    initInteriorServicesClick();
});

// ========================================
// HERO CAROUSEL - Auto-sliding image carousel
// ========================================
let currentSlide = 0;
let carouselInterval;
const SLIDE_DURATION = 3000; // 3 seconds per slide

/**
 * Initialize the carousel functionality
 * Sets up auto-sliding and dot navigation
 */
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    // Return early if no slides found
    if (slides.length === 0) return;

    /**
     * Show a specific slide by index
     * @param {number} index - The slide index to show
     */
    function showSlide(index) {
        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Handle index wrapping
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Add active class to current slide
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    /**
     * Move to the next slide
     */
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    /**
     * Start the automatic carousel rotation
     */
    function startCarousel() {
        carouselInterval = setInterval(nextSlide, SLIDE_DURATION);
    }

    /**
     * Stop the automatic carousel rotation
     */
    function stopCarousel() {
        clearInterval(carouselInterval);
    }

    // Add click event listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopCarousel();
            showSlide(index);
            startCarousel();
        });
    });

    // Pause carousel on hover
    const carouselContainer = document.querySelector('.carousel');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopCarousel);
        carouselContainer.addEventListener('mouseleave', startCarousel);
    }

    // Start the carousel
    showSlide(0);
    startCarousel();

    // Handle visibility change (pause when tab is not visible)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopCarousel();
        } else {
            startCarousel();
        }
    });
}

// ========================================
// NAVIGATION - Mobile menu & scroll effects
// ========================================

/**
 * Initialize navigation functionality
 * Handles mobile menu toggle and scroll-based styling
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Navbar scroll effect - add background when scrolled
    function handleNavbarScroll() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    // Update active nav link based on scroll position
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Add scroll event listeners with throttling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleNavbarScroll();
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial check
    handleNavbarScroll();
}

// ========================================
// SMOOTH SCROLLING - For anchor links
// ========================================

/**
 * Initialize smooth scrolling for all anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just a "#"
            if (href === '#') return;

            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Calculate offset for fixed navbar
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// SCROLL ANIMATIONS - Reveal elements on scroll
// ========================================

/**
 * Initialize scroll-triggered animations
 * Uses Intersection Observer for better performance
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .feature-card');

    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for feature cards
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, index * 100);
                    
                    // Unobserve after animation (animate only once)
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for browsers without Intersection Observer
        animatedElements.forEach(el => {
            el.classList.add('animate');
        });
    }

    // Add scroll reveal for other sections
    const revealSections = document.querySelectorAll('.service-card, .interior-item, .review-card, .team-card');
    
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        revealSections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            sectionObserver.observe(section);
        });
    }
}

// ========================================
// INTERIOR SERVICES CLICK HANDLER
// ========================================

/**
 * Handle click on Interior Design card
 * Scrolls to the interior services section
 */
function initInteriorServicesClick() {
    const interiorCard = document.getElementById('interior-card');
    
    if (interiorCard) {
        interiorCard.addEventListener('click', showInteriorServices);
    }
}

/**
 * Scroll to interior services section
 */
function showInteriorServices() {
    const interiorSection = document.getElementById('interior-services');
    
    if (interiorSection) {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = interiorSection.offsetTop - navbarHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ========================================
// FORM VALIDATION - Contact form handling
// ========================================

/**
 * Initialize form validation
 * Validates all fields and shows success message on submit
 */
function initFormValidation() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('successMessage');

    if (!form) return;

    // Form field references
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');

    // Error message references
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const messageError = document.getElementById('messageError');

    /**
     * Validate full name
     * @returns {boolean} - True if valid
     */
    function validateName() {
        const name = fullNameInput.value.trim();
        
        if (name === '') {
            showError(fullNameInput, nameError, 'Full name is required');
            return false;
        } else if (name.length < 2) {
            showError(fullNameInput, nameError, 'Name must be at least 2 characters');
            return false;
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
            showError(fullNameInput, nameError, 'Name can only contain letters and spaces');
            return false;
        }
        
        clearError(fullNameInput, nameError);
        return true;
    }

    /**
     * Validate email address
     * @returns {boolean} - True if valid
     */
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            showError(emailInput, emailError, 'Email address is required');
            return false;
        } else if (!emailRegex.test(email)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            return false;
        }
        
        clearError(emailInput, emailError);
        return true;
    }

    /**
     * Validate phone number
     * @returns {boolean} - True if valid
     */
    function validatePhone() {
        const phone = phoneInput.value.trim();
        const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
        
        if (phone === '') {
            showError(phoneInput, phoneError, 'Phone number is required');
            return false;
        } else if (!phoneRegex.test(phone)) {
            showError(phoneInput, phoneError, 'Please enter a valid phone number');
            return false;
        }
        
        clearError(phoneInput, phoneError);
        return true;
    }

    /**
     * Validate message
     * @returns {boolean} - True if valid
     */
    function validateMessage() {
        const message = messageInput.value.trim();
        
        if (message === '') {
            showError(messageInput, messageError, 'Message is required');
            return false;
        } else if (message.length < 10) {
            showError(messageInput, messageError, 'Message must be at least 10 characters');
            return false;
        }
        
        clearError(messageInput, messageError);
        return true;
    }

    /**
     * Show error message for a field
     * @param {HTMLElement} input - The input element
     * @param {HTMLElement} errorElement - The error message element
     * @param {string} message - Error message to display
     */
    function showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
    }

    /**
     * Clear error message for a field
     * @param {HTMLElement} input - The input element
     * @param {HTMLElement} errorElement - The error message element
     */
    function clearError(input, errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
    }

    // Real-time validation on blur
    fullNameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    phoneInput.addEventListener('blur', validatePhone);
    messageInput.addEventListener('blur', validateMessage);

    // Clear error on input
    fullNameInput.addEventListener('input', () => {
        if (fullNameInput.classList.contains('error')) validateName();
    });
    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('error')) validateEmail();
    });
    phoneInput.addEventListener('input', () => {
        if (phoneInput.classList.contains('error')) validatePhone();
    });
    messageInput.addEventListener('input', () => {
        if (messageInput.classList.contains('error')) validateMessage();
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isMessageValid = validateMessage();

        // If all valid, send email via EmailJS
        if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
            // Get submit button and show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            // Prepare template parameters
            const templateParams = {
                fullName: fullNameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                message: messageInput.value.trim()
            };

            // Send email using EmailJS
            emailjs.send('service_q9oymyq', 'template_ozvq1ih', templateParams)
                .then(function(response) {
                    console.log('Email sent successfully!', response.status, response.text);
                    // Show success popup
                    showPopupNotification('success', 'Thank you for your service! We will reach you soon.');
                    // Reset form
                    form.reset();
                    // Reset button
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                })
                .catch(function(error) {
                    console.error('Failed to send email:', error);
                    // Show error popup
                    showPopupNotification('error', 'Error occurred. Please try again later.');
                    // Reset button
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        }
    });
}

/**
 * Show popup notification
 * @param {string} type - 'success' or 'error'
 * @param {string} message - The message to display
 */
function showPopupNotification(type, message) {
    // Remove existing popup if any
    const existingPopup = document.querySelector('.popup-notification');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create popup element
    const popup = document.createElement('div');
    popup.className = `popup-notification ${type}`;
    
    // Create icon
    const icon = type === 'success' ? '✓' : '✕';
    
    popup.innerHTML = `
        <div class="popup-icon">${icon}</div>
        <div class="popup-content">
            <p class="popup-message">${message}</p>
        </div>
        <button class="popup-close" onclick="this.parentElement.remove()">×</button>
    `;

    // Add to body
    document.body.appendChild(popup);

    // Trigger animation
    setTimeout(() => popup.classList.add('show'), 10);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }, 5000);
}

/**
 * Reset the contact form to initial state
 * Called when user clicks "Send Another Message"
 */
function resetForm() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('successMessage');

    if (form && successMessage) {
        // Reset form fields
        form.reset();
        
        // Clear any error states
        const inputs = form.querySelectorAll('input, textarea');
        const errorMessages = form.querySelectorAll('.error-message');
        
        inputs.forEach(input => input.classList.remove('error'));
        errorMessages.forEach(error => error.textContent = '');
        
        // Show form and hide success message
        form.style.display = 'block';
        successMessage.classList.remove('show');
    }
}

// ========================================
// BACK TO TOP BUTTON
// ========================================

/**
 * Initialize back to top button functionality
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    function toggleBackToTop() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add scroll listener with throttling
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                toggleBackToTop();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce delay in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait = 100) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Throttle function to ensure a function is called at most once per interval
 * @param {Function} func - The function to throttle
 * @param {number} limit - The throttle interval in milliseconds
 * @returns {Function} - The throttled function
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// ADDITIONAL ENHANCEMENTS
// ========================================

/**
 * Add parallax effect to hero section (optional enhancement)
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    
    if (!hero) return;

    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.scrollY;
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            const parallaxOffset = scrolled * 0.4;
            const heroContent = hero.querySelector('.hero-content');
            
            if (heroContent) {
                heroContent.style.transform = `translateY(${parallaxOffset}px)`;
                heroContent.style.opacity = 1 - (scrolled / heroHeight);
            }
        }
    }, 16));
}

/**
 * Add typing effect to hero subtitle (optional enhancement)
 */
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = 1;

    let charIndex = 0;
    
    function typeChar() {
        if (charIndex < text.length) {
            subtitle.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 50);
        }
    }

    // Start typing after hero animation completes
    setTimeout(typeChar, 1500);
}

// ========================================
// IMAGE LAZY LOADING (Performance Enhancement)
// ========================================

/**
 * Initialize lazy loading for images
 * Uses Intersection Observer for efficient loading
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// ========================================
// KEYBOARD ACCESSIBILITY
// ========================================

/**
 * Add keyboard navigation support
 */
function initKeyboardNav() {
    // Handle escape key for mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('nav-menu');
            
            if (navMenu && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Add focus styles for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea');
    
    interactiveElements.forEach(el => {
        el.addEventListener('focus', () => {
            el.style.outline = '2px solid var(--color-primary)';
            el.style.outlineOffset = '2px';
        });
        
        el.addEventListener('blur', () => {
            el.style.outline = '';
            el.style.outlineOffset = '';
        });
    });
}

// Initialize keyboard navigation
document.addEventListener('DOMContentLoaded', initKeyboardNav);

// ========================================
// CONSOLE BRANDING
// ========================================
console.log(
    '%c 🏠 Kshetra Interiors ',
    'background: #2D4739; color: white; font-size: 24px; padding: 10px; border-radius: 5px;'
);
console.log(
    '%c Designing Spaces That Inspire ',
    'color: #C4A77D; font-size: 14px; font-style: italic;'
);
console.log('%c Website developed with ❤️', 'color: #5C5C5C; font-size: 12px;');
