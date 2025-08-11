// --- Array of products ---
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

// --- Load cart from localStorage ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// --- Display products dynamically ---
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
                    <button class="btn btn-primary mt-3" onclick="addToCart(${product.id})">Add to cart</button>
                </div>
            </div>
        `;
        menuContainer.appendChild(card);
    });
}

// --- Add to cart ---
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification('success', 'Item Added', `${product.name} has been added to your cart.`);
}

// --- Simple notification function ---
function showNotification(type, title, message) {
    alert(`${title}: ${message}`); // ممكن تستبدلها بالـbootstrap alert اللي عندك
}

// --- Init ---
window.onload = displayMenu;





    document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');


        // Function to handle search
        function performSearch() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                alert(`Searching for: ${searchTerm}`); // Replace with actual search functionality
                // Here you would typically:
                // 1. Filter displayed items
                // 2. Or make an API call to search backend
                // 3. Or redirect to search results page with query parameter
            } else {
                alert('Please enter a search term');
            }
        }


        // Click event for button
        searchButton.addEventListener('click', performSearch);


        // Enter key press in input field
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    })