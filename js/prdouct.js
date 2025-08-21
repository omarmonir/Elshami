// جلب المنتجات من localStorage
let products = JSON.parse(localStorage.getItem('products')) || [];

// الكارت
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// إعدادات الباجينيشن
let currentPage = 1;
let itemsPerPage = 6;

// عرض المنتجات بصفحات
function displayProducts(items, page = 1) {
    let container = document.getElementById("menu-container");
    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = `<p class="text-center text-danger">No products found.</p>`;
        document.getElementById("pagination").innerHTML = "";
        return;
    }

    // حساب بداية ونهاية الصفحة
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let paginatedItems = items.slice(startIndex, endIndex);

    // عرض المنتجات
    paginatedItems.forEach(product => {
        let card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.toppings}</p>
                        <p class="price">$${product.price}</p>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });

    // عرض أزرار الباجينيشن
    displayPagination(items.length, page);
}

// عرض أزرار الباجينيشن
function displayPagination(totalItems, currentPage) {
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        let btn = document.createElement("button");
        btn.className = `btn btn-sm ${i === currentPage ? "btn-primary" : "btn-outline-primary"} m-1`;
        btn.textContent = i;
        btn.addEventListener("click", () => {
            displayProducts(products, i);
        });
        paginationContainer.appendChild(btn);
    }
}

// البحث
function searchProducts() {
    let searchValue = document.getElementById("searchInput").value.toLowerCase();
    let minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
    let maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;

    let filtered = products.filter(p =>
        (p.name.toLowerCase().includes(searchValue) || p.toppings.toLowerCase().includes(searchValue)) &&
        p.price >= minPrice && p.price <= maxPrice
    );

    displayProducts(filtered, 1);
}

products = products.map((p, index) => ({
    id: index + 1,
    ...p
}));
localStorage.setItem('products', JSON.stringify(products));

// إضافة للكارت
function addToCart(id) {
    let product = products.find(p => p.id === id);
    if (product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification('success', 'Added to Cart', `${product.name} has been added to your cart.`);
    }
}

// إشعار
function showNotification(type, title, message, duration = 2000) {
    const colors = {
        success: "alert-success",
        warning: "alert-warning",
        error: "alert-danger",
        info: "alert-info"
    };

    const notification = document.createElement("div");
    notification.className = `alert ${colors[type]} position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = "9999";
    notification.innerHTML = `<strong>${title}</strong><br>${message}`;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), duration);
}

// الأحداث
document.getElementById("searchInput").addEventListener("input", searchProducts);
document.getElementById("minPrice").addEventListener("input", searchProducts);
document.getElementById("maxPrice").addEventListener("input", searchProducts);

// عرض أولي
displayProducts(products, currentPage);
