// Premium Application with Telegram Integration
// Load configuration
const CONFIG = window.TELEGRAM_CONFIG || {};
const TELEGRAM_BOT_USERNAME = CONFIG.BOT_USERNAME || 'MozzarellaAutoreBot';
const TELEGRAM_BOT_URL = `${CONFIG.BASE_URL || 'https://t.me'}/${TELEGRAM_BOT_USERNAME}`;
const DEFAULT_MESSAGE = CONFIG.DEFAULT_MESSAGE || 'Ciao! Vorrei ordinare la vostra mozzarella di bufala DOP';

// Application state
let products = [];
let categories = [];
let settings = {};
let content = {};
let qrCodes = {};

// Analytics tracking
function trackTelegramEvent(productId, productName, action = 'telegram_redirect') {
    // Google Analytics tracking (if available)
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'product_id': productId,
            'product_name': productName,
            'source_page': window.location.pathname
        });
    }

    // Console logging for debugging
    console.log(`Telegram Event: ${action} - ${productName} (${productId})`);
}

// Detect mobile device
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
}

// Telegram deep linking function
function orderOnTelegram(productId = null, productName = null) {
    // Track the event
    trackTelegramEvent(productId, productName || 'general');

    // Build Telegram URL with deep linking
    let telegramUrl = TELEGRAM_BOT_URL;

    if (productId && productName) {
        const encodedMessage = encodeURIComponent(`Ciao! Vorrei ordinare: ${productName}`);
        telegramUrl += `?start=${productId}&text=${encodedMessage}`;
    } else {
        const generalMessage = encodeURIComponent(DEFAULT_MESSAGE);
        telegramUrl += `?text=${generalMessage}`;
    }

    // Open Telegram based on device
    if (isMobile()) {
        // On mobile, try to open the app directly
        window.location.href = telegramUrl;

        // Fallback to web if app doesn't open
        setTimeout(() => {
            window.open(telegramUrl, '_blank');
        }, 1000);
    } else {
        // On desktop, open in new tab
        window.open(telegramUrl, '_blank');
    }

    // Show notification
    showNotification('Sto aprendo Telegram...', 'info');
}

// QR Code generation
async function generateQRCode(text, elementId, size = 120) {
    try {
        const qrContainer = document.getElementById(elementId);
        qrContainer.innerHTML = ''; // Clear existing content

        await QRCode.toCanvas(qrContainer, text, {
            width: size,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        document.getElementById(elementId).innerHTML = '<p class="text-xs text-gray-500">QR non disponibile</p>';
    }
}

// Show notification (accessible)
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

    notification.className = `fixed top-24 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300 max-w-sm`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="fas ${icon} text-xl"></i>
            <div>
                <p class="font-semibold">${type === 'success' ? 'Successo!' : type === 'error' ? 'Errore!' : 'Info'}</p>
                <p class="text-sm">${message}</p>
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    // Remove after 4 seconds for accessibility
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, CONFIG.UI?.NOTIFICATION_DURATION || 4000);

    // Announce to screen readers
    announceToScreenReader(message);
}

// Screen reader announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
}

// Initialize premium animations
function initializeAnimations() {
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

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMobileMenu = document.getElementById('close-mobile-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
    }

    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    // Close menu when clicking on links
    mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            mobileMenu.classList.remove('active');
        }
    });
}

// Render premium product cards
function renderProducts() {
    const container = document.getElementById('products-grid');
    const categoryFilter = document.getElementById('category-filter')?.value || 'all';
    const availableFilter = document.getElementById('available-filter')?.checked || false;

    let filteredProducts = products;

    if (categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.categoria === categoryFilter);
    }

    if (availableFilter) {
        filteredProducts = filteredProducts.filter(p => p.disponibile);
    }

    container.innerHTML = filteredProducts.map(product => `
        <div class="product-card-premium fade-in-up">
            <div class="relative overflow-hidden h-48">
                <img src="${product.immagine}"
                     alt="${product.nome}"
                     class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRkFGOEYzIi8+CjxwYXRoIGQ9Ik0xMzYuNCA3Ni4xQzEzNi40IDc2LjEgMTQwLjggNzYuMSAxNDAuOCA4MC41QzE0MC44IDg0LjkgMTM2LjQgODQuOSAxMzYuNCA4NC45Vjg4LjNDMTM2LjQgODguMyAxMzIuOSA5MS44IDEyOC45IDkxLjhDMTI0LjkgOTEuOCAxMjEuNCA4OC4zIDEyMS40IDg4LjNWODQuOUMxMjEuNCA4NC45IDExNyA4NC45IDExNyA4MC41QzExNyA3Ni4xIDEyMS40IDc2LjEgMTIxLjQgNzYuMVY3Mi43QzEyMS40IDY4LjMgMTI0LjkgNjQuOCAxMjguOSA2NC44QzEzMi45IDY0LjggMTM2LjQgNjguMyAxMzYuNCA3Mi43Vjc2LjFaTTE2MC40IDY0LjhDMTY0LjQgNjQuOCAxNjcuOSA2OC4zIDE2Ny45IDcyLjdWNzYuMUMxNjcuOSA3Ni4xIDE3Mi4zIDc2LjEgMTcyLjMgODAuNUMxNzIuMyA4NC45IDE2Ny45IDg0LjkgMTY3LjkgODQuOVY4OC4zQzE2Ny45IDg4LjMgMTY0LjQgOTEuOCAxNjAuNCA5MS44QzE1Ni40IDkxLjggMTUyLjkgODguMyAxNTIuOSA4OC4zVjg0LjlDMTUyLjkgODQuOSAxNDguNSA4NC45IDE0OC41IDgwLjVDMTQ4LjUgNzYuMSAxNTIuOSA3Ni4xIDE1Mi45IDc2LjFWNzIuN0MxNTIuOSA2OC4zIDE1Ni40IDY0LjggMTYwLjQgNjQuOFoiIGZpbGw9IiMyRTNGMUYiLz4KPHBhdGggZD0iTTEyOCA5Ni4yQzE0NS44IDk2LjIgMTYwLjMgMTEwLjcgMTYwLjMgMTI4LjNDMTYwLjMgMTQ1LjkgMTQ1LjggMTYwLjQgMTI4IDE2MC40QzExMC4yIDE2MC40IDk1LjcgMTQ1LjkgOTUuNyAxMjguM0M5NS43IDExMC43IDExMC4yIDk2LjIgMTI4IDk2LjJaTTEyOCAxNTEuMUMxNDIuNCAxNTEuMSAxNTQuNSAxMzkgMTU0LjUgMTI0LjVDMTU0LjUgMTEwIDE0Mi40IDk3LjkgMTI4IDk3LjlDMTEzLjYgOTcuOSAxMDEuNSAxMTAgMTAxLjUgMTI0LjVDMTAxLjUgMTM5IDExMy42IDE1MS4xIDEyOCAxNTEuMVoiIGZpbGw9IiNEQUE1MjAiLz4KPC9zdmc+Cg=='">
                ${!product.disponibile ? '<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"><span class="text-white font-semibold">Non disponibile</span></div>' : ''}
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-semibold text-yellow-600 uppercase tracking-wider">${product.categoria}</span>
                    ${product.in_evidenza ? '<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">In evidenza</span>' : ''}
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2 font-serif">${product.nome}</h3>
                <p class="text-gray-600 text-sm mb-4 leading-relaxed">${product.descrizione}</p>

                <div class="flex items-center justify-between mb-4">
                    <div>
                        <span class="text-2xl font-bold text-yellow-600">€${product.prezzo.toFixed(2)}</span>
                        <span class="text-xs text-gray-500 ml-1">prezzo indicativo</span>
                    </div>
                    <span class="text-sm text-gray-500 font-medium">${product.peso}</span>
                </div>

                <div class="space-y-3">
                    <button onclick="orderOnTelegram('${product.id}', '${product.name}')"
                            class="w-full btn-telegram ${!product.disponibile ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${!product.disponibile ? 'disabled' : ''}>
                        <i class="fab fa-telegram-plane mr-2"></i>
                        ${product.disponibile ? 'Ordina su Telegram' : 'Non disponibile'}
                    </button>

                    <div class="text-center">
                        <div class="qr-container inline-block" id="qr-${product.id}">
                            <!-- QR code will be generated here -->
                        </div>
                        <p class="text-xs text-gray-500 mt-1">Scannerizza per ordinare</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Generate QR codes for products
    setTimeout(() => {
        filteredProducts.forEach(product => {
            const qrText = `${TELEGRAM_BOT_URL}?start=${product.id}&text=${encodeURIComponent(`Ciao! Vorrei ordinare: ${product.nome}`)}`;
            generateQRCode(qrText, `qr-${product.id}`, 100);
        });
    }, 100);
}

// Initialize category filter
function initializeFilters() {
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter && categories.length > 0) {
        categoryFilter.innerHTML = '<option value="all">Tutte le categorie</option>' +
            categories.map(cat => `<option value="${cat.id}">${cat.icona} ${cat.nome}</option>`).join('');
    }

    // Event listeners for filters
    document.addEventListener('change', function(e) {
        if (e.target.id === 'category-filter' || e.target.id === 'available-filter') {
            renderProducts();
        }
    });
}

// Load application data
async function loadAppData() {
    try {
        const [productsRes, settingsRes, contentRes] = await Promise.all([
            fetch('data/products.json'),
            fetch('data/settings.json'),
            fetch('data/content.json')
        ]);

        const productsData = await productsRes.json();
        const settingsData = await settingsRes.json();
        const contentData = await contentRes.json();

        products = productsData.prodotti;
        categories = productsData.categorie;
        settings = settingsData;
        content = contentData;

        updateUI();
        renderProducts();
        initializeFilters();
        generateHeroQR();
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Errore nel caricamento dei dati', 'error');
    }
}

// Update UI elements
function updateUI() {
    // Update company info
    const companyInfo = {
        'azienda-indirizzo': settings.azienda?.indirizzo,
        'azienda-telefono': settings.azienda?.telefono,
        'azienda-email': settings.azienda?.email,
        'footer-descrizione': settings.azienda?.descrizione,
        'footer-piva': settings.azienda?.piva
    };

    Object.entries(companyInfo).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element && value) {
            element.textContent = value;
        }
    });

    // Update story content
    const storyElement = document.getElementById('chi-siamo-testo');
    if (storyElement && content.homepage?.chi_siamo?.testo) {
        storyElement.textContent = content.homepage.chi_siamo.testo;
    }

    // Update certifications
    const certificationsContainer = document.getElementById('certificazioni-list');
    if (certificationsContainer && settings.azienda?.certificazioni) {
        certificationsContainer.innerHTML = settings.azienda.certificazioni.map(cert =>
            `<span class="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">${cert}</span>`
        ).join('');
    }

    // Update social links
    const socialContainer = document.getElementById('social-links');
    if (socialContainer && settings.social) {
        socialContainer.innerHTML = `
            <a href="${settings.social.facebook}" target="_blank" class="text-gray-400 hover:text-yellow-400 transition-colors">
                <i class="fab fa-facebook text-xl"></i>
            </a>
            <a href="${settings.social.instagram}" target="_blank" class="text-gray-400 hover:text-yellow-400 transition-colors">
                <i class="fab fa-instagram text-xl"></i>
            </a>
            <a href="https://wa.me/${settings.social.whatsapp?.replace(/[^\d]/g, '')}" target="_blank" class="text-gray-400 hover:text-yellow-400 transition-colors">
                <i class="fab fa-whatsapp text-xl"></i>
            </a>
            <a href="${TELEGRAM_BOT_URL}" target="_blank" class="text-gray-400 hover:text-yellow-400 transition-colors">
                <i class="fab fa-telegram text-xl"></i>
            </a>
        `;
    }
}

// Generate hero QR code
function generateHeroQR() {
    const heroQrText = `${TELEGRAM_BOT_URL}?text=${encodeURIComponent('Ciao! Vorrei ordinare la vostra mozzarella di bufala DOP')}`;
    generateQRCode(heroQrText, 'hero-qr', 150);
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
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
}

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.addEventListener('load', () => {
                    img.style.transition = 'opacity 0.5s';
                    img.style.opacity = '1';
                });
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Mobile menu close function (global)
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
}

// Touch gestures for mobile
function initializeTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        // Swipe left to right - open mobile menu
        if (diff < -swipeThreshold && touchStartX < 50) {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('active')) {
                mobileMenu.classList.add('active');
            }
        }

        // Swipe right to left - close mobile menu
        if (diff > swipeThreshold && touchStartX > window.innerWidth - 50) {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
        }
    }
}

// Enhanced mobile detection
function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return isMobileDevice || (isSmallScreen && isTouchDevice);
}

// Performance optimized image loading
function optimizeImages() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        // Add loading="lazy" to all images
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }

        // Add error handling
        if (!img.hasAttribute('onerror')) {
            img.setAttribute('onerror', 'this.src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRkFGOEYzIi8+CjxwYXRoIGQ9Ik0xMzYuNCA3Ni4xQzEzNi40IDc2LjEgMTQwLjggNzYuMSAxNDAuOCA4MC41QzE0MC44IDg0LjkgMTM2LjQgODQuOSAxMzYuNCA4NC45Vjg4LjNDMTM2LjQgODguMyAxMzIuOSA5MS44IDEyOC45IDkxLjhDMTI0LjkgOTEuOCAxMjEuNCA4OC4zIDEyMS40IDg4LjNWODQuOUMxMjEuNCA4NC45IDExNyA4NC45IDExNyA4MC41QzExNyA3Ni4xIDEyMS40IDc2LjEgMTIxLjQgNzYuMVY3Mi43QzEyMS40IDY4LjMgMTI0LjkgNjQuOCAxMjguOSA2NC44QzEzMi45IDY0LjggMTM2LjQgNjguMyAxMzYuNCA3Mi43Vjc2LjFaTTE2MC40IDY0LjhDMTY0LjQgNjQuOCAxNjcuOSA2OC4zIDE2Ny45IDcyLjdWNjYuMUMxNjcuOSA3Ni4xIDE3Mi4zIDc2LjEgMTcyLjMgODAuNUMxNzIuMyA4NC45IDE2Ny45IDg0LjkgMTY3LjkgODQuOVY4OC4zQzE2Ny45IDg4LjMgMTY0LjQgOTEuOCAxNjAuNCA5MS44QzE1Ni40IDkxLjggMTUyLjkgODguMyAxNTIuOSA4OC4zVjg0LjlDMTUyLjkgODQuOSAxNDguNSA4NC45IDE0OC41IDgwLjVDMTQ4LjUgNzYuMSAxNTIuOSA3Ni4xIDE1Mi45IDc2LjFWNzIuN0MxNTIuOSA2OC4zIDE1Ni40IDY0LjggMTYwLjQgNjQuOFoiIGZpbGw9IiMyRTNGMUYiLz4KPHBhdGggZD0iTTEyOCA5Ni4yQzE0NS44IDk2LjIgMTYwLjMgMTEwLjcgMTYwLjMgMTI4LjNDMTYwLjMgMTQ1LjkgMTQ1LjggMTYwLjQgMTI4IDE2MC40QzExMC4yIDE2MC40IDk1LjcgMTQ1LjkgOTUuNyAxMjguM0M5NS43IDExMC43IDExMC4yIDk2LjIgMTI4IDk2LjJaTTEyOCAxNTEuMUMxNDIuNCAxNTEuMSAxNTQuNSAxMzkgMTU0LjUgMTI0LjVDMTU0LjUgMTEwIDE0Mi40IDk3LjkgMTI4IDk3LjlDMTEzLjYgOTcuOSAxMDEuNSAxMTAgMTAxLjUgMTI0LjVDMTAxLjUgMTM5IDExMy42IDE1MS4xIDEyOCAxNTEuMVoiIGZpbGw9IiNEQUE1MjAiLz4KPC9zdmc+Cg=="; this.alt="Immagine non disponibile"');
        }

        // Add accessibility attributes
        if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', 'Immagine prodotto');
        }
    });
}

// Add keyboard navigation for products
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Escape key
        if (e.key === 'Escape') {
            closeMobileMenu();
        }

        // Enter key on product cards
        if (e.key === 'Enter' && e.target.closest('.product-card-premium')) {
            const button = e.target.closest('.product-card-premium').querySelector('button[onclick*="orderOnTelegram"]');
            if (button && !button.disabled) {
                button.click();
            }
        }
    });

    // Add focus management
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            // Let browser handle tab navigation
            return;
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Mozzarella d\'Autore Premium...');

    // Initialize core functionality
    loadAppData();
    initializeAnimations();
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeLazyLoading();
    initializeTouchGestures();
    optimizeImages();
    initializeKeyboardNavigation();

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });

    // Show welcome notification
    setTimeout(() => {
        showNotification('Benvenuto nella vetrina premium! 🧀', 'success');
    }, 1000);

    console.log('✅ Premium application initialized successfully!');
    announceToScreenReader('Sito Mozzarella d\'Autore Premium caricato');
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('Si è verificato un errore', 'error');
});

// Track page performance
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`⚡ Page loaded in ${Math.round(perfData.loadEventEnd - perfData.startTime)}ms`);
        }, 0);
    });
}