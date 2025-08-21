let currentProduct = null;
let products = JSON.parse(localStorage.getItem('products')) || [];

document.addEventListener("DOMContentLoaded", () => {
    // Get product from localStorage or URL parameter
    const productId = getProductIdFromUrl();
    currentProduct = products.find(p => p.id == productId);
    
    if (!currentProduct) {
        document.querySelector("main").innerHTML = `
            <div class="container py-5 text-center">
                <h3 class="text-danger">Product not found</h3>
                <a href="prdouct.html" class="btn btn-primary mt-3">Back to Products</a>
            </div>
        `;
        return;
    }
    
    // Display product details
    displayProductDetails(currentProduct);
    
    // Display related products (excluding current product)
    displayRelatedProducts(currentProduct);
});

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function displayProductDetails(product) {
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productToppings").textContent = product.toppings;
    document.getElementById("productPrice").textContent = `$${product.price}`;
    document.getElementById("productDescription").textContent = product.description || "Lorem ipsum dolor sit amet...";
    
    // Set images
    const mainImg = document.getElementById("mainProductImage");
    const thumbnails = document.querySelectorAll(".thumbnail");
    
    mainImg.src = product.image;
    thumbnails[0].src = product.image;
    // You can add more thumbnails if available in your product data
    thumbnails[1].src = product.image; // Just using same image for demo
}

function displayRelatedProducts(currentProduct) {
    const relatedContainer = document.getElementById("relatedProducts");
    const relatedProducts = products.filter(p => p.id !== currentProduct.id).slice(0, 6);
    
    if (relatedProducts.length === 0) {
        relatedContainer.innerHTML = `<p class="text-center">No related products found.</p>`;
        return;
    }
    
    relatedContainer.innerHTML = relatedProducts.map(product => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.toppings}</p>
                    <p class="price">$${product.price}</p>
                    <button class="btn btn-primary" onclick="window.location.href='menu.html?id=${product.id}'">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

function changeMainImage(src) {
    document.getElementById("mainProductImage").src = src;
}

// Add to cart function (same as in products page)
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
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

// Notification function (same as in products page)
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