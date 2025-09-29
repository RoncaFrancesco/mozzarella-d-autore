// Admin panel functionality
let products = [];
let settings = {};
let content = {};
let currentEditingProduct = null;

// Simple password for demo (in production, use proper authentication)
const ADMIN_PASSWORD = 'admin123';

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminEventListeners();
});

// Initialize event listeners
function initializeAdminEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Product form
    document.getElementById('add-product-form').addEventListener('submit', handleProductSubmit);

    // Settings form
    document.getElementById('settings-form').addEventListener('submit', handleSettingsSubmit);
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;

    if (password === ADMIN_PASSWORD) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        loadAdminData();
    } else {
        alert('Password non corretta!');
    }
}

// Load admin data
async function loadAdminData() {
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
        settings = settingsData;
        content = contentData;

        updateDashboard();
        updateProductsTable();
        updateSettingsForm();
    } catch (error) {
        console.error('Error loading admin data:', error);
        alert('Errore nel caricamento dei dati');
    }
}

// Update dashboard statistics
function updateDashboard() {
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('available-products').textContent = products.filter(p => p.disponibile).length;
    document.getElementById('featured-products').textContent = products.filter(p => p.in_evidenza).length;
}

// Update products table
function updateProductsTable() {
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = products.map(product => `
        <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-3">${product.id}</td>
            <td class="px-4 py-3">${product.nome}</td>
            <td class="px-4 py-3">${product.categoria}</td>
            <td class="px-4 py-3">${product.peso}</td>
            <td class="px-4 py-3">€${product.prezzo.toFixed(2)}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs rounded-full ${product.disponibile ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}">
                    ${product.disponibile ? 'Disponibile' : 'Non disponibile'}
                </span>
            </td>
            <td class="px-4 py-3">
                <button onclick="editProduct('${product.id}')" class="text-blue-600 hover:text-blue-800 mr-2">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteProduct('${product.id}')" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Update settings form
function updateSettingsForm() {
    document.getElementById('company-name').value = settings.azienda.nome;
    document.getElementById('company-slogan').value = settings.azienda.slogan;
    document.getElementById('company-address').value = settings.azienda.indirizzo;
    document.getElementById('company-phone').value = settings.azienda.telefono;
    document.getElementById('company-email').value = settings.azienda.email;
    document.getElementById('company-piva').value = settings.azienda.piva;
}

// Show/hide sections
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));

    // Show selected section
    document.getElementById(section + '-section').classList.remove('hidden');
}

// Show add product form
function showAddProductForm() {
    document.getElementById('product-form').classList.remove('hidden');
    document.getElementById('add-product-form').reset();
    currentEditingProduct = null;
}

// Hide product form
function hideProductForm() {
    document.getElementById('product-form').classList.add('hidden');
    currentEditingProduct = null;
}

// Handle product submission
async function handleProductSubmit(e) {
    e.preventDefault();

    const productData = {
        id: document.getElementById('product-id').value,
        nome: document.getElementById('product-name').value,
        categoria: document.getElementById('product-category').value,
        peso: document.getElementById('product-weight').value,
        prezzo: parseFloat(document.getElementById('product-price').value),
        descrizione: document.getElementById('product-description').value,
        ingredienti: document.getElementById('product-ingredients').value,
        immagine: document.getElementById('product-image').value,
        disponibile: document.getElementById('product-available').checked,
        in_evidenza: document.getElementById('product-featured').checked,
        stagionale: document.getElementById('product-seasonal').checked
    };

    try {
        if (currentEditingProduct) {
            // Update existing product
            const index = products.findIndex(p => p.id === currentEditingProduct);
            products[index] = productData;
        } else {
            // Add new product
            products.push(productData);
        }

        await saveProducts();
        updateProductsTable();
        updateDashboard();
        hideProductForm();
        alert('Prodotto salvato con successo!');
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Errore nel salvataggio del prodotto');
    }
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        currentEditingProduct = productId;

        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.nome;
        document.getElementById('product-category').value = product.categoria;
        document.getElementById('product-weight').value = product.peso;
        document.getElementById('product-price').value = product.prezzo;
        document.getElementById('product-description').value = product.descrizione;
        document.getElementById('product-ingredients').value = product.ingredienti;
        document.getElementById('product-image').value = product.immagine;
        document.getElementById('product-available').checked = product.disponibile;
        document.getElementById('product-featured').checked = product.in_evidenza;
        document.getElementById('product-seasonal').checked = product.stagionale;

        document.getElementById('product-form').classList.remove('hidden');
    }
}

// Delete product
async function deleteProduct(productId) {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
        try {
            products = products.filter(p => p.id !== productId);
            await saveProducts();
            updateProductsTable();
            updateDashboard();
            alert('Prodotto eliminato con successo!');
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Errore nell\'eliminazione del prodotto');
        }
    }
}

// Save products to file
async function saveProducts() {
    const data = {
        prodotti: products,
        categorie: [
            {"id": "mozzarelle", "nome": "Mozzarelle", "icona": "🧀"},
            {"id": "bocconcini", "nome": "Bocconcini", "icona": "⚪"},
            {"id": "trecce", "nome": "Trecce", "icona": "🥨"},
            {"id": "nodini", "nome": "Nodini", "icona": "🔗"},
            {"id": "burrata", "nome": "Burrata", "icona": "🥛"},
            {"id": "ricotta", "nome": "Ricotta", "icona": "🧄"}
        ]
    };

    // In a real application, this would be a server-side operation
    // For demo purposes, we'll just log it
    console.log('Products to save:', JSON.stringify(data, null, 2));

    // You would typically send this to a server endpoint
    // await fetch('/api/save-products', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // });
}

// Handle settings submission
async function handleSettingsSubmit(e) {
    e.preventDefault();

    const newSettings = {
        azienda: {
            nome: document.getElementById('company-name').value,
            slogan: document.getElementById('company-slogan').value,
            descrizione: settings.azienda.descrizione,
            indirizzo: document.getElementById('company-address').value,
            telefono: document.getElementById('company-phone').value,
            email: document.getElementById('company-email').value,
            piva: document.getElementById('company-piva').value,
            certificazioni: settings.azienda.certificazioni
        },
        consegna: settings.consegna,
        pagamento: settings.pagamento,
        social: settings.social
    };

    try {
        settings = newSettings;
        await saveSettings();
        alert('Impostazioni salvate con successo!');
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Errore nel salvataggio delle impostazioni');
    }
}

// Save settings to file
async function saveSettings() {
    // In a real application, this would be a server-side operation
    console.log('Settings to save:', JSON.stringify(settings, null, 2));

    // You would typically send this to a server endpoint
    // await fetch('/api/save-settings', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(settings)
    // });
}

// Logout
function logout() {
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('admin-password').value = '';
}