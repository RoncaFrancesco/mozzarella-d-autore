// Mozzarella d'Autore - Storytelling App
// Pure branding and storytelling functionality with Telegram integration

class StorytellingApp {
    constructor() {
        this.config = window.TELEGRAM_CONFIG || {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAnimations();
        this.setupMobileOptimizations();
        this.logPerformance();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const closeMobileMenu = document.getElementById('close-mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (closeMobileMenu && mobileMenu) {
            closeMobileMenu.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }

        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu?.querySelectorAll('a[href^="#"]');
        mobileLinks?.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll animations
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    setupAnimations() {
        // Initialize animation observers
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right').forEach(el => {
            observer.observe(el);
        });
    }

    setupMobileOptimizations() {
        // Touch gestures for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });

        // Add touch-friendly interactions
        this.addTouchInteractions();
    }

    addTouchInteractions() {
        // Add ripple effect to buttons
        document.querySelectorAll('.telegram-cta-main, .floating-telegram').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    handleSwipe(startX, endX) {
        const threshold = this.config.UI?.SWIPE_THRESHOLD || 50;
        const mobileMenu = document.getElementById('mobile-menu');

        if (startX - endX > threshold && mobileMenu?.classList.contains('active')) {
            // Swipe left to close menu
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header-premium');

        // Add shadow to header on scroll
        if (header) {
            if (scrolled > 50) {
                header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
            }
        }

        // Hide/show floating button based on scroll
        const floatingButton = document.querySelector('.floating-telegram');
        if (floatingButton) {
            if (scrolled > 300) {
                floatingButton.style.opacity = '1';
                floatingButton.style.transform = 'translateY(0)';
            } else {
                floatingButton.style.opacity = '0.8';
                floatingButton.style.transform = 'translateY(10px)';
            }
        }
    }

    // Telegram integration methods
    orderOnTelegram() {
        const botUsername = this.config.BOT_USERNAME || 'MozzarellaAutoreBot';
        const defaultMessage = this.config.DEFAULT_MESSAGE || 'Ciao! Vorrei ordinare la vostra mozzarella di bufala DOP';

        // Detect if user is on mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // Create Telegram URL
        let telegramUrl;
        if (isMobile) {
            // Mobile: try to open app first, fallback to web
            telegramUrl = `tg://resolve?domain=${botUsername}`;
            setTimeout(() => {
                window.open(`https://t.me/${botUsername}`, '_blank');
            }, 100);
        } else {
            // Desktop: open web version
            telegramUrl = `https://t.me/${botUsername}`;
        }

        // Track the event if analytics is enabled
        this.trackEvent('telegram_click', 'engagement', 'order_on_telegram');

        // Open Telegram
        window.open(telegramUrl, isMobile ? '_self' : '_blank');

        // Log the action
        console.log('📱 Telegram order initiated:', { botUsername, isMobile, timestamp: new Date().toISOString() });
    }

    trackEvent(event, category, label) {
        if (this.config.ANALYTICS?.ENABLED && typeof gtag !== 'undefined') {
            gtag('event', event, {
                'event_category': category,
                'event_label': label
            });
        }
    }

    logPerformance() {
        if (this.config.FEATURES?.ENABLE_PERFORMANCE_TRACKING) {
            // Log page load performance
            window.addEventListener('load', () => {
                const navigation = performance.getEntriesByType('navigation')[0];
                console.log('🚀 Page Performance:', {
                    loadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
                    domComplete: Math.round(navigation.domComplete - navigation.fetchStart),
                    firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
                });
            });
        }
    }
}

// Close mobile menu function for HTML onclick
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Telegram order function for HTML onclick
function orderOnTelegram() {
    if (window.storytellingApp) {
        window.storytellingApp.orderOnTelegram();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.storytellingApp = new StorytellingApp();

    // Add ripple CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        .telegram-cta-main, .floating-telegram {
            position: relative;
            overflow: hidden;
        }

        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('🧀 Storytelling App initialized successfully');
});