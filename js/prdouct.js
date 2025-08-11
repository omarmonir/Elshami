// add to cart

// Array of products
let products = [
    {
        id: 1,
        name: "Mutton or Lamb Biriyani",
        toppings: "Topped with chicken, onion, capsicum, black olive & Green chilli",
        price: 30,
        image: "./Images/Carbonara Photos - Download Free High-Quality Pictures _ Freepik.jpeg"
    },
    {
        id: 2,
        name: "Chicken Supreme Pizza",
        toppings: "Topped with chicken, onion, capsicum, black olive & Green chilli",
        price: 40,
        image: "./Images/Creamy Harissa Pasta.jpeg"
    },
    {
        id: 3,
        name: "Hamburger Burger with Beef",
        toppings: "Topped with chicken, onion, capsicum, black olive & Green chilli",
        price: 50,
        image: "./Images/Chicken Dum Biryani - Coolinarco_com.jpeg"
    }
];

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    displayMenu();
    updateCartBadge();
});

// Display products
function displayMenu() {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4 d-flex';
        card.innerHTML = `
            <div class="card flex-fill">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.toppings}</p>
                        <p class="card-text"><strong>Price:</strong> $${product.price}</p>
                    </div>
                    <button class="btn btn-primary mt-3" onclick="addToCart(${product.id})">
                        <i class="bi bi-cart-plus"></i> Add to cart
                    </button>
                </div>
            </div>
        `;
        menuContainer.appendChild(card);
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
        showNotification('success', 'Quantity Updated', `${product.name} quantity increased to ${existingItem.quantity}`);
    } else {
        cart.push({ ...product, quantity: 1 });
        showNotification('success', 'Item Added', `${product.name} has been added to your cart.`);
    }

    // Update localStorage and cart badge
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

// Update cart badge
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartBadge').textContent = totalItems;
}

// Notification system (simplified without action buttons)
function showNotification(type, title, message) {
    const types = {
        'info': { icon: 'info-circle', color: 'primary' },
        'success': { icon: 'check-circle', color: 'success' },
        'warning': { icon: 'exclamation-triangle', color: 'warning' },
        'error': { icon: 'x-circle', color: 'danger' }
    };

    const toastId = 'toast-' + Date.now();
    const toastEl = document.createElement('div');
    toastEl.className = `toast show mb-3 fade`;
    toastEl.setAttribute('role', 'alert');
    toastEl.id = toastId;

    // Progress bar
    const progressBar = `
        <div class="progress" style="height: 3px;">
            <div id="${toastId}-progress" class="progress-bar bg-${types[type].color}" 
                style="width: 100%; transition: width 5s linear;"></div>
        </div>
    `;

    toastEl.innerHTML = `
        <div class="toast-header bg-${types[type].color} text-white">
            <i class="bi bi-${types[type].icon} me-2"></i>
            <strong class="me-auto">${title}</strong>
            <small>${new Date().toLocaleTimeString()}</small>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
        ${progressBar}
    `;

    document.getElementById('toastContainer').prepend(toastEl);

    // Start progress bar animation
    setTimeout(() => {
        document.getElementById(`${toastId}-progress`).style.width = '0%';
    }, 50);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const toastInstance = bootstrap.Toast.getOrCreateInstance(toastEl);
        toastInstance.hide();
    }, 5000);
    
    // Remove toast after it hides
    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}






              // search
document.addEventListener('DOMContentLoaded', function () {

    // مسح البيانات القديمة علشان نتأكد إنها محدثة
    localStorage.removeItem('products');

    // Sample data in localStorage
    if (!localStorage.getItem('products')) {
        const sampleData = [
            {
                id: 1,
                name: "Mutton or Lamb Biriyani",
                category: "Biryani",
                toppings: "Topped with chicken, onion, capsicum, black olive & Green chilli",
                price: 30,
                image: "./Images/Carbonara Photos - Download Free High-Quality Pictures _ Freepik.jpeg"
            },
            {
                id: 2,
                name: "Chicken Supreme Pizza",
                category: "Pizza",
                toppings: "Topped with chicken, onion, capsicum, black olive & Green chilli",
                price: 40,
                image: "./Images/Creamy Harissa Pasta.jpeg"
            },
            {
                id: 3,
                name: "Hamburger Burger with Beef",
                category: "Burger",
                toppings: "Topped with chicken, onion, capsicum, black olive & Green chilli",
                price: 50,
                image: "./Images/Chicken Dum Biryani - Coolinarco_com.jpeg"
            }
        ];

        localStorage.setItem('products', JSON.stringify(sampleData));
    }

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('resultsContainer');

    // Search function
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (!searchTerm) {
            showNotification('error', 'Search Error', 'Please enter a search term');
            resultsContainer.innerHTML = '';
            return;
        }

        // Get items from localStorage
        const foodItems = JSON.parse(localStorage.getItem('products')) || [];

        // Filter items (يدور في name و category و toppings)
        const results = foodItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.toppings.toLowerCase().includes(searchTerm)
        );

        // Display results
        displayResults(results);

        // Show notification
        if (results.length > 0) {
            showNotification('success', 'Search Results', `Found ${results.length} matching items`);
        } else {
            showNotification('warning', 'No Results', 'No items found matching your search');
        }
    }

    // Display search results
    function displayResults(results) {
        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="alert alert-warning text-center">
                    No items found matching your search
                </div>
            `;
            return;
        }

        const resultsHTML = `
            <div class="row">
                ${results.map(item => `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <img src="${item.image}" class="card-img-top" alt="${item.name}">
                            <div class="card-body">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-text text-muted">${item.category}</p>
                                <p class="card-text">${item.toppings}</p>
                                <p class="card-text text-success fw-bold">$${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        resultsContainer.innerHTML = resultsHTML;
    }

    // Notification function
    function showNotification(type, title, message) {
        const types = {
            'info': { icon: 'info-circle', color: 'primary' },
            'success': { icon: 'check-circle', color: 'success' },
            'warning': { icon: 'exclamation-triangle', color: 'warning' },
            'error': { icon: 'x-circle', color: 'danger' }
        };

        const toastEl = document.createElement('div');
        toastEl.className = `toast show mb-3`;
        toastEl.innerHTML = `
            <div class="toast-header bg-${types[type].color} text-white">
                <i class="bi bi-${types[type].icon} me-2"></i>
                <strong class="me-auto">${title}</strong>
                <small>Just now</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        `;

        document.getElementById('toastContainer').prepend(toastEl);

        setTimeout(() => toastEl.remove(), 5000);
    }

    // Event listeners
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') performSearch();
    });
});







        // filter


document.addEventListener('DOMContentLoaded', function () {

    // مسح البيانات القديمة علشان نتأكد إنها محدثة
    localStorage.removeItem('products');

    // Sample data in localStorage
    if (!localStorage.getItem('products')) {
        const sampleData = [
            {
                id: 1,
                name: "Mutton or Lamb Biriyani",
                category: "Biryani",
                toppings: "Topped with chicken, onion, capsicum, black olive & Green chilli",
                price: 30,
                image: "./Images/Carbonara Photos - Download Free High-Quality Pictures _ Freepik.jpeg"
            },
            {
                id: 2,
                name: "Chicken Supreme Pizza",
                category: "Pizza",
                toppings: "Topped with chicken, onion, capsicum, black olive & Green chilli",
                price: 40,
                image: "./Images/Creamy Harissa Pasta.jpeg"
            },
            {
                id: 3,
                name: "Hamburger Burger with Beef",
                category: "Burger",
                toppings: "Topped with chicken, onion, capsicum, black olive & Green chilli",
                price: 50,
                image: "./Images/Chicken Dum Biryani - Coolinarco_com.jpeg"
            }
        ];

        localStorage.setItem('products', JSON.stringify(sampleData));
    }

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('resultsContainer');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');

    // تحديث قيمة الـ range في النص
    priceRange.addEventListener('input', function () {
        priceValue.textContent = `$${priceRange.value}`;
    });

    // Search + filter function
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const maxPrice = parseFloat(priceRange.value);

        // Get items from localStorage
        const foodItems = JSON.parse(localStorage.getItem('products')) || [];

        // Filter items
        const results = foodItems.filter(item =>
            (item.name.toLowerCase().includes(searchTerm) ||
             item.category.toLowerCase().includes(searchTerm) ||
             item.toppings.toLowerCase().includes(searchTerm)) &&
            item.price <= maxPrice
        );

        // Display results
        displayResults(results);

        // Show notification
        if (results.length > 0) {
            showNotification('success', 'Search Results', `Found ${results.length} matching items`);
        } else {
            showNotification('warning', 'No Results', 'No items found matching your search');
        }
    }

    // Display search results
    function displayResults(results) {
        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="alert alert-warning text-center">
                    No items found matching your search
                </div>
            `;
            return;
        }

        const resultsHTML = `
            <div class="row">
                ${results.map(item => `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <img src="${item.image}" class="card-img-top" alt="${item.name}">
                            <div class="card-body">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-text text-muted">${item.category}</p>
                                <p class="card-text">${item.toppings}</p>
                                <p class="card-text text-success fw-bold">$${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        resultsContainer.innerHTML = resultsHTML;
    }

    // Notification function
    function showNotification(type, title, message) {
        const types = {
            'info': { icon: 'info-circle', color: 'primary' },
            'success': { icon: 'check-circle', color: 'success' },
            'warning': { icon: 'exclamation-triangle', color: 'warning' },
            'error': { icon: 'x-circle', color: 'danger' }
        };

        const toastEl = document.createElement('div');
        toastEl.className = `toast show mb-3`;
        toastEl.innerHTML = `
            <div class="toast-header bg-${types[type].color} text-white">
                <i class="bi bi-${types[type].icon} me-2"></i>
                <strong class="me-auto">${title}</strong>
                <small>Just now</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        `;

        document.getElementById('toastContainer').prepend(toastEl);

        setTimeout(() => toastEl.remove(), 5000);
    }

    // Event listeners
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') performSearch();
    });
    priceRange.addEventListener('change', performSearch); // تحديث النتائج عند تغيير الـ range
});

