// Global variables
let cart = [];
let products = [
    {
        id: 1,
        name: "Maglietta L457 Classic",
        price: 25.99,
        category: "magliette",
        image: "assets/maglietta-classic.svg",
        description: "Maglietta in cotone 100% con logo L457"
    },
    {
        id: 2,
        name: "Maglietta L457 Street",
        price: 29.99,
        category: "magliette",
        image: "assets/maglietta-street.svg",
        description: "Design streetwear con stampa esclusiva"
    },
    {
        id: 3,
        name: "Felpa L457 Hoodie",
        price: 49.99,
        category: "felpe",
        image: "assets/felpa-hoodie.svg",
        description: "Felpa con cappuccio, comfort e stile"
    },
    {
        id: 4,
        name: "Felpa L457 Crew",
        price: 44.99,
        category: "felpe",
        image: "assets/felpa-crew.svg",
        description: "Felpa girocollo in cotone premium"
    },
    {
        id: 5,
        name: "Maglietta L457 Limited",
        price: 34.99,
        category: "magliette",
        image: "assets/maglietta-limited.svg",
        description: "Edizione limitata con design esclusivo"
    },
    {
        id: 6,
        name: "Felpa L457 Zip",
        price: 54.99,
        category: "felpe",
        image: "assets/felpa-zip.svg",
        description: "Felpa con zip e tasche laterali"
    }
];

let mediaItems = {
    images: [
        "assets/gallery-1.svg",
        "assets/gallery-2.svg",
        "assets/gallery-3.svg",
        "assets/gallery-4.svg"
    ],
    videos: [
        // Video di esempio - sostituisci con i tuoi video
    ]
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadProducts();
    loadGallery();
    updateCartUI();
}

// Event Listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('menu-toggle').addEventListener('click', toggleMobileMenu);
    document.getElementById('cart-btn').addEventListener('click', toggleCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    document.getElementById('search-btn').addEventListener('click', toggleSearch);
    
    // CTA Button
    document.querySelector('.cta-button').addEventListener('click', scrollToProducts);
    
    // Product categories
    document.querySelectorAll('.category').forEach(category => {
        category.addEventListener('click', function() {
            const categoryType = this.dataset.category;
            filterProducts(categoryType);
        });
    });
    
    // Gallery tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabType = this.dataset.tab;
            switchGalleryTab(tabType);
        });
    });
    
    // File upload
    document.getElementById('upload-btn').addEventListener('click', handleFileUpload);
    
    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

// Navigation Functions
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('open');
}

function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.remove('open');
}

function toggleSearch() {
    // Implement search functionality
    const searchTerm = prompt('Cerca prodotti:');
    if (searchTerm) {
        searchProducts(searchTerm);
    }
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

// Product Functions
function loadProducts(category = 'all') {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    
    const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
    
    // Add animation
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in-up');
            }, index * 100);
        });
    }, 100);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">€${product.price}</div>
            <button class="add-to-cart" data-product-id="${product.id}">
                🛒 Aggiungi al Carrello
            </button>
        </div>
    `;
    
    // Add event listener for the add to cart button
    const addButton = card.querySelector('.add-to-cart');
    addButton.addEventListener('click', () => addToCart(product.id));
    
    return card;
}

function filterProducts(category) {
    loadProducts(category);
    
    // Update active category
    document.querySelectorAll('.category').forEach(cat => {
        cat.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
}

function searchProducts(searchTerm) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Nessun prodotto trovato.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showNotification(`${product.name} aggiunto al carrello!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
            removeFromCart(productId);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Il carrello è vuoto</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">€${item.price} x ${item.quantity}</div>
                    <div class="cart-item-controls">
                        <button class="decrease-btn" data-item-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-btn" data-item-id="${item.id}">+</button>
                        <button class="remove-btn" data-item-id="${item.id}">🗑️</button>
                    </div>
                </div>
            `;
            
            // Add event listeners for cart controls
            const decreaseBtn = cartItem.querySelector('.decrease-btn');
            const increaseBtn = cartItem.querySelector('.increase-btn');
            const removeBtn = cartItem.querySelector('.remove-btn');
            
            decreaseBtn.addEventListener('click', () => updateCartQuantity(item.id, item.quantity - 1));
            increaseBtn.addEventListener('click', () => updateCartQuantity(item.id, item.quantity + 1));
            removeBtn.addEventListener('click', () => removeFromCart(item.id));
            
            cartItems.appendChild(cartItem);
        });
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Il carrello è vuoto!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderSummary = cart.map(item => `${item.name} x${item.quantity}`).join('\n');
    
    if (confirm(`Confermi l'ordine?\n\n${orderSummary}\n\nTotale: €${total.toFixed(2)}`)) {
        // Simulate order processing
        showNotification('Ordine confermato! Riceverai una email di conferma.');
        cart = [];
        updateCartUI();
        closeCart();
    }
}

// Gallery Functions
function loadGallery() {
    loadImages();
    loadVideos();
}

function loadImages() {
    const imageGrid = document.getElementById('image-grid');
    imageGrid.innerHTML = '';
    
    mediaItems.images.forEach((imageSrc, index) => {
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.innerHTML = `<img src="${imageSrc}" alt="Immagine ${index + 1}" loading="lazy">`;
        mediaItem.addEventListener('click', () => openLightbox(imageSrc, 'image'));
        imageGrid.appendChild(mediaItem);
    });
}

function loadVideos() {
    const videoGrid = document.getElementById('video-grid');
    videoGrid.innerHTML = '';
    
    mediaItems.videos.forEach((videoSrc, index) => {
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.innerHTML = `
            <video controls>
                <source src="${videoSrc}" type="video/mp4">
                Il tuo browser non supporta i video HTML5.
            </video>
        `;
        videoGrid.appendChild(mediaItem);
    });
}

function switchGalleryTab(tabType) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabType}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabType).classList.add('active');
}

function openLightbox(src, type) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    const media = type === 'image' ? 
        `<img src="${src}">` :
        `<video src="${src}" controls></video>`;
    
    lightbox.innerHTML = media;
    lightbox.addEventListener('click', () => document.body.removeChild(lightbox));
    
    document.body.appendChild(lightbox);
}

// File Upload Functions
function handleFileUpload() {
    const fileInput = document.getElementById('file-input');
    const files = fileInput.files;
    
    if (files.length === 0) {
        showNotification('Seleziona almeno un file!');
        return;
    }
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const fileUrl = e.target.result;
            
            if (file.type.startsWith('image/')) {
                mediaItems.images.push(fileUrl);
                loadImages();
            } else if (file.type.startsWith('video/')) {
                mediaItems.videos.push(fileUrl);
                loadVideos();
            }
        };
        
        reader.readAsDataURL(file);
    });
    
    showNotification(`${files.length} file caricati con successo!`);
    fileInput.value = '';
}

// Utility Functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 2000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Styles moved to styles.css to comply with CSP

// Scroll animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.product-card, .category, .media-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(el => observer.observe(el));
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', handleScrollAnimations);

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});