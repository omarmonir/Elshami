let products = [
    {
        id: 1,
        name: "Mutton or Lamb Biriyani",
        toppings: "Topped with chicken, onion, capsicum, black olive & green chilli",
        price: 30,
        image: "../Images/Chicken Dum Biryani - Coolinarco_com.jpeg"
    },
    {
        id: 2,
        name: "Chicken Supreme Pizza",
        toppings: "Cheese, tomato, onion, olives, green pepper",
        price: 50,
        image: "../Images/Delicious Pizza.jpeg"
    },
    {
        id: 3,
        name: "Veggie Burger",
        toppings: "Lettuce, tomato, onion, cheese",
        price: 25,
        image: "../Images/Classic Grilled Cheeseburger • Olive & Mango.jpeg"
    }
];

let cart = [];

function displayProducts(items) {
    let container = document.getElementById("menu-container");
    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = `<p class="text-center text-danger">No items found matching your search.</p>`;
        return;
    }

    items.forEach(product => {
        let card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.toppings}</p>
                        <p class="price">$${product.price}</p>
                        <button class="btn btn-success" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

function searchProducts() {
    let searchValue = document.getElementById("searchInput").value.toLowerCase();
    let minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
    let maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;

    let filtered = products.filter(p =>
        (p.name.toLowerCase().includes(searchValue) || p.toppings.toLowerCase().includes(searchValue)) &&
        p.price >= minPrice && p.price <= maxPrice
    );

    displayProducts(filtered);
}

function addToCart(id) {
    let product = products.find(p => p.id === id);
    if (product) {
        cart.push(product);
        showNotification(`${product.name} added to cart!`);
    }
}

function showNotification(message) {
    let notification = document.createElement("div");
    notification.className = "alert alert-success position-fixed top-0 end-0 m-3";
    notification.style.zIndex = "9999";
    notification.innerText = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Live search
document.getElementById("searchInput").addEventListener("input", searchProducts);
document.getElementById("minPrice").addEventListener("input", searchProducts);
document.getElementById("maxPrice").addEventListener("input", searchProducts);

// عرض أولي لكل المنتجات
displayProducts(products);
