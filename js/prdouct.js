// ----------------------------
// Products Data
// ----------------------------
let products = [
    {
        id: 1,
        name: "Mutton or lamb biriyani",
        toppings: "Topped with chicken, onion, capsicum, black olive & Green chilli",
        price: 30,
        image: "./Images/image_itemsList_7.jpg"
    },
    {
        id: 2,
        name: "Chicken Supreme Pizza",
        toppings: "Topped with chicken, onion, capsicum, black olive & Green chilli",
        price: 40,
        image: "./Images/image_itemsList_1.jpg"
    },
    {
        id: 3,
        name: "Hamburger Burger with Beef",
        toppings: "Topped with chicken, onion, capsicum, black olive & Green chilli",
        price: 50,
        image: "./Images/image_itemsList_2.jpg"
    },
    {
        id: 4,
        name: "Belgium waffles with strawberries",
        toppings: "Topped with chicken, onion, capsicum, black olive & Green chilli",
        price: 70,
        image: "./Images/image_itemsList_3.jpg"
    },
    {
        id: 5,
        name: "Chicken skewers",
        toppings: "Topped with chicken, onion, capsicum, black olive & Green chilli",
        price: 90,
        image: "./Images/image_itemsList_4.jpg"
    },
    {
        id: 6,
        name: "Spicy fried tubtim fish salad",
        toppings: "Topped with chicken, onion, capsicum, black olive & Green chilli",
        price: 90,
        image: "./Images/image_itemsList_6.jpg"
    }
];

// ----------------------------
// Cart
// ----------------------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ----------------------------
// Pagination
// ----------------------------
let currentPage = 1;
let itemsPerPage = 6;

// ----------------------------
// Display Products
// ----------------------------
function displayProducts(items, page = 1) {
    let container = document.getElementById("menu-container");
    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = `<p class="text-center text-danger">No products found.</p>`;
        document.getElementById("pagination").innerHTML = "";
        return;
    }

    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let paginated = items.slice(startIndex, endIndex);

    paginated.forEach(product => {
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
        </div>`;
        container.innerHTML += card;
    });

    displayPagination(items.length, page);
}

// ----------------------------
// Pagination Buttons
// ----------------------------
function displayPagination(totalItems, currentPage) {
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    let pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        let btn = document.createElement("button");
        btn.className = `btn btn-sm ${i === currentPage ? "btn-primary" : "btn-outline-primary"} m-1`;
        btn.textContent = i;

        btn.addEventListener("click", () => {
            currentPage = i;
            displayProducts(filteredProducts(), currentPage);
        });

        pagination.appendChild(btn);
    }
}

// ----------------------------
// Filter Function
// ----------------------------
function filteredProducts() {
    let searchValue = document.getElementById("searchInput").value.toLowerCase();
    let minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
    let maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;

    return products.filter(p =>
        (p.name.toLowerCase().includes(searchValue) ||
         p.toppings.toLowerCase().includes(searchValue)) &&
        p.price >= minPrice &&
        p.price <= maxPrice
    );
}

// ----------------------------
// Search Event
// ----------------------------
function searchProducts() {
    displayProducts(filteredProducts(), 1);
}

// Auto filter while typing
document.getElementById("searchInput").addEventListener("input", searchProducts);
document.getElementById("minPrice").addEventListener("input", searchProducts);
document.getElementById("maxPrice").addEventListener("input", searchProducts);

// ----------------------------
// Add to Cart
// ----------------------------
function addToCart(id) {
    let product = products.find(p => p.id === id);

    if (product) {
        let exists = cart.find(item => item.id === id);

        if (exists) {
            exists.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        showNotification("success", "Added to Cart", `${product.name} added to your cart.`);
    }
}

// ----------------------------
// Notification
// ----------------------------
function showNotification(type, title, message, duration = 2000) {
    const colors = {
        success: "alert-success",
        warning: "alert-warning",
        error: "alert-danger",
        info: "alert-info"
    };

    let note = document.createElement("div");
    note.className = `alert ${colors[type]} position-fixed top-0 end-0 m-3`;
    note.style.zIndex = "99999";
    note.innerHTML = `<strong>${title}</strong><br>${message}`;

    document.body.appendChild(note);

    setTimeout(() => note.remove(), duration);
}

// ----------------------------
// Initial Display
// ----------------------------
displayProducts(products, currentPage);
