// Mozzarella d'Autore - Telegram Integration Configuration
// Update these values with your actual Telegram bot information

const TELEGRAM_CONFIG = {
    // Your Telegram bot username (without @)
    BOT_USERNAME: 'MozzarellaAutoreBot',

    // Base Telegram URL
    BASE_URL: 'https://t.me',

    // Default message for general orders
    DEFAULT_MESSAGE: 'Ciao! Vorrei ordinare la vostra mozzarella di bufala DOP',

    // Analytics configuration (optional)
    ANALYTICS: {
        ENABLED: false, // Set to true if you have Google Analytics
        TRACKING_ID: 'UA-XXXXXXXXX-X' // Your Google Analytics ID
    },

    // UI Configuration
    UI: {
        // Animation duration in milliseconds
        ANIMATION_DURATION: 800,

        // QR Code size
        QR_SIZE: 120,
        HERO_QR_SIZE: 150,

        // Notification duration in milliseconds
        NOTIFICATION_DURATION: 4000,

        // Mobile swipe threshold
        SWIPE_THRESHOLD: 50
    },

    // Feature flags
    FEATURES: {
        ENABLE_TOUCH_GESTURES: true,
        ENABLE_KEYBOARD_NAVIGATION: true,
        ENABLE_LAZY_LOADING: true,
        ENABLE_ACCESSIBILITY: true,
        ENABLE_PERFORMANCE_TRACKING: true
    }
};

// Export configuration
window.TELEGRAM_CONFIG = TELEGRAM_CONFIG;