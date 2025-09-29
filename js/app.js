// Application state
let products = [];
let categories = [];
let settings = {};
let content = {};
let cart = [];
let currentFilter = 'all';

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadAppData();
    initializeEventListeners();
});

// Load all data from JSON files
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
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Errore nel caricamento dei dati');
    }
}

// Update UI with loaded data
function updateUI() {
    // Hero section
    document.getElementById('hero-titolo').textContent = content.homepage.hero.titolo;
    document.getElementById('hero-sottotitolo').textContent = content.homepage.hero.sottotitolo;
    document.getElementById('hero-descrizione').textContent = content.homepage.hero.descrizione;
    document.getElementById('hero-cta').textContent = content.homepage.hero.cta;

    // Chi siamo section
    document.getElementById('chi-siamo-titolo').textContent = content.homepage.chi_siamo.titolo;
    document.getElementById('chi-siamo-sottotitolo').textContent = content.homepage.chi_siamo.sottotitolo;
    document.getElementById('chi-siamo-testo').textContent = content.homepage.chi_siamo.testo;

    // Processo section
    document.getElementById('processo-titolo').textContent = content.homepage.processo.titolo;
    renderProcessSteps();

    // Prodotti section
    document.getElementById('prodotti-titolo').textContent = content.prodotti.titolo;
    document.getElementById('prodotti-sottotitolo').textContent = content.prodotti.sottotitolo;
    renderFilters();

    // Ordini section
    document.getElementById('ordini-titolo').textContent = content.ordini.titolo;
    document.getElementById('ordini-sottotitolo').textContent = content.ordini.sottotitolo;

    // Contatti section
    document.getElementById('contatti-titolo').textContent = content.contatti.titolo;
    document.getElementById('azienda-indirizzo').textContent = settings.azienda.indirizzo;
    document.getElementById('azienda-telefono').textContent = settings.azienda.telefono;
    document.getElementById('azienda-email').textContent = settings.azienda.email;
    document.getElementById('contatti-orari').textContent = content.contatti.orari;
    document.getElementById('contatti-note').textContent = content.contatti.note;

    // Footer
    document.getElementById('footer-descrizione').textContent = settings.azienda.descrizione;
    document.getElementById('footer-piva').textContent = settings.azienda.piva;
    renderCertifications();
    renderSocialLinks();
}

// Render process steps
function renderProcessSteps() {
    const container = document.getElementById('processo-passi');
    container.innerHTML = content.homepage.processo.passi.map(passo => `
        <div class="text-center">
            <div class="bg-yellow-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-${getProcessIcon(passo.titolo)} text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-green-800 mb-2">${passo.titolo}</h3>
            <p class="text-gray-700">${passo.descrizione}</p>
        </div>
    `).join('');
}

// Get icon for process step
function getProcessIcon(titolo) {
    const icons = {
        'Mungitura': 'cow',
        'Trasformazione': 'flask',
        'Formatura': 'hand-holding-water',
        'Confezionamento': 'box'
    };
    return icons[titolo] || 'cheese';
}

// Render filters
function renderFilters() {
    const container = document.getElementById('filtri-container');
    container.innerHTML = `
        <select id="category-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
            <option value="all">Tutte le categorie</option>
            ${categories.map(cat => `<option value="${cat.id}">${cat.icona} ${cat.nome}</option>`).join('')}
        </select>
        <label class="flex items-center">
            <input type="checkbox" id="available-filter" class="mr-2">
            <span>Solo prodotti disponibili</span>
        </label>
        <button onclick="sortProductsByPrice()" class="btn-primary px-4 py-2 rounded-lg">
            Ordina per prezzo
        </button>
    `;
}

// Render products
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
        <div class="product-card bg-white rounded-lg shadow-lg overflow-hidden ${!product.disponibile ? 'opacity-75' : ''}">
            <img src="${product.immagine}" alt="${product.nome}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold text-green-800 mb-2">${product.nome}</h3>
                <p class="text-gray-600 text-sm mb-2">${product.peso}</p>
                <p class="text-gray-700 mb-3">${product.descrizione}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-yellow-600">€${product.prezzo.toFixed(2)}*</span>
                    <button onclick="addToCart('${product.id}')"
                            class="btn-primary px-4 py-2 rounded-lg text-sm font-semibold ${!product.disponibile ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${!product.disponibile ? 'disabled' : ''}>
                        ${product.disponibile ? 'Ordina' : 'Non disponibile'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render certifications
function renderCertifications() {
    const container = document.getElementById('certificazioni-list');
    container.innerHTML = settings.azienda.certificazioni.map(cert => `
        <div class="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">${cert}</div>
    `).join('');
}

// Render social links
function renderSocialLinks() {
    const container = document.getElementById('social-links');
    container.innerHTML = `
        <a href="${settings.social.facebook}" target="_blank" class="text-gray-300 hover:text-white">
            <i class="fab fa-facebook text-2xl"></i>
        </a>
        <a href="${settings.social.instagram}" target="_blank" class="text-gray-300 hover:text-white">
            <i class="fab fa-instagram text-2xl"></i>
        </a>
        <a href="https://wa.me/${settings.social.whatsapp.replace(/[^\d]/g, '')}" target="_blank" class="text-gray-300 hover:text-white">
            <i class="fab fa-whatsapp text-2xl"></i>
        </a>
    `;
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product && product.disponibile) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        showNotification('Prodotto aggiunto al carrello!');
        updateCartDisplay();
    }
}

// Update cart display
function updateCartDisplay() {
    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartButton.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            Carrello (${totalItems})
        `;
    }
}

// Sort products by price
function sortProductsByPrice() {
    products.sort((a, b) => a.prezzo - b.prezzo);
    renderProducts();
}

// Initialize event listeners
function initializeEventListeners() {
    // Mobile menu
    document.getElementById('mobile-menu-btn').addEventListener('click', function() {
        toggleMobileMenu();
    });

    document.getElementById('close-mobile-menu').addEventListener('click', function() {
        toggleMobileMenu();
    });

    // Cart functionality
    document.getElementById('cart-button').addEventListener('click', function() {
        toggleCart();
    });

    document.getElementById('close-cart').addEventListener('click', function() {
        toggleCart();
    });

    // Category filter
    document.addEventListener('change', function(e) {
        if (e.target.id === 'category-filter' || e.target.id === 'available-filter') {
            renderProducts();
        }
    });

    // Order form
    document.getElementById('ordine-form').addEventListener('submit', handleOrderSubmission);

    // Smooth scrolling
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

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('translate-x-full');
    updateCartSidebar();
}

// Update cart sidebar
function updateCartSidebar() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cart.length === 0) {
        cartItems.style.display = 'none';
        cartEmpty.style.display = 'block';
        checkoutBtn.disabled = true;
        cartTotal.textContent = '€0.00*';
    } else {
        cartItems.style.display = 'block';
        cartEmpty.style.display = 'none';
        checkoutBtn.disabled = false;

        cartItems.innerHTML = cart.map(item => `
            <div class="flex items-center justify-between p-4 border rounded-lg">
                <div class="flex-1">
                    <h4 class="font-semibold text-green-800">${item.nome}</h4>
                    <p class="text-sm text-gray-600">${item.peso}</p>
                    <p class="text-sm text-gray-600">€${item.prezzo.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="updateQuantity('${item.id}', -1)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
                        <i class="fas fa-minus text-xs"></i>
                    </button>
                    <span class="w-8 text-center">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)" class="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center">
                        <i class="fas fa-plus text-xs"></i>
                    </button>
                    <button onclick="removeFromCart('${item.id}')" class="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center ml-2">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                </div>
            </div>
        `).join('');

        cartTotal.textContent = `€${calculateTotal().toFixed(2)}*`;
    }
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            updateCartSidebar();
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    updateCartSidebar();
    showNotification('Prodotto rimosso dal carrello');
}

// Proceed to order
function proceedToOrder() {
    toggleCart();
    document.getElementById('ordini').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
}

// Close mobile menu
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.add('hidden');
}

// Handle order submission
async function handleOrderSubmission(e) {
    e.preventDefault();

    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        citta: document.getElementById('citta').value,
        indirizzo: document.getElementById('indirizzo').value,
        cap: document.getElementById('cap').value,
        provincia: document.getElementById('provincia').value,
        note: document.getElementById('note').value,
        prodotti: cart,
        totale: calculateTotal()
    };

    try {
        // Here you would normally send the data to a server
        console.log('Order data:', formData);

        // Generate order confirmation
        generateOrderConfirmation(formData);

        // Clear form and cart
        document.getElementById('ordine-form').reset();
        cart = [];
        updateCartDisplay();

        showNotification('Ordine inviato con successo! Ti contatteremo presto.');
    } catch (error) {
        console.error('Error submitting order:', error);
        showError('Errore nell\'invio dell\'ordine. Riprova più tardi.');
    }
}

// Calculate order total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.prezzo * item.quantity), 0);
}

// Generate order confirmation
function generateOrderConfirmation(orderData) {
    const orderNumber = 'ORD-' + Date.now();
    const orderDate = new Date().toLocaleDateString('it-IT');

    // Here you would generate a PDF or display a confirmation page
    const confirmationHTML = `
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 class="text-2xl font-bold text-green-800 mb-4">Ordine Confermato!</h2>
            <p class="text-gray-700 mb-4">Grazie per il tuo ordine. Ti contatteremo presto per confermare i dettagli.</p>
            <div class="border-t border-gray-200 pt-4">
                <p><strong>Numero Ordine:</strong> ${orderNumber}</p>
                <p><strong>Data:</strong> ${orderDate}</p>
                <p><strong>Totale:</strong> €${orderData.totale.toFixed(2)}*</p>
            </div>
            <p class="text-sm text-gray-500 mt-4">* Prezzo indicativo, soggetto a conferma</p>
        </div>
    `;

    // Display confirmation (you might want to use a modal instead)
    document.getElementById('ordini').innerHTML += confirmationHTML;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Show error
function showError(message) {
    const error = document.createElement('div');
    error.className = 'fixed top-20 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    error.textContent = message;
    document.body.appendChild(error);

    setTimeout(() => {
        error.remove();
    }, 5000);
}