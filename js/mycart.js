// Initialize cart from localStorage or with sample data
let cart = JSON.parse(localStorage.getItem('cart')) || [
    { 
        id: 1, 
        name: "Belgium waffles with strawberries", 
        price: 150, 
        quantity: 1, 
        image: "./Images/waffles.jpg.png"  
    },
    { 
        id: 2, 
        name: "Chicken skewers", 
        price: 150, 
        quantity: 2, 
        image: "./Images/Chicken Dum Biryani - Coolinarco_com.jpeg" 
    }
];

let couponValue = 0;

function renderCart() {
    const tbody = document.getElementById("cart-items");
    tbody.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <h5>Your cart is empty</h5>
                    <p>Add some delicious items to get started!</p>
                </td>
            </tr>
        `;
        document.getElementById("order-subtotal").textContent = "0.00";
        document.getElementById("total-amount").textContent = "0.00";
        return;
    }

    cart.forEach((item, index) => {
        const total = item.price * item.quantity;
        subtotal += total;
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;" 
                     onerror="this.src='./Images/placeholder.jpg'" />
            </td>
            <td class="text-start">${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div class="d-flex align-items-center justify-content-center gap-1 flex-nowrap" style="min-width: 120px;">
                    <button class="btn btn-sm btn-outline-danger" onclick="updateQuantity(${index}, -1)" title="Decrease quantity">-</button>
                    <span class="mx-2 fw-bold">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-success" onclick="updateQuantity(${index}, 1)" title="Increase quantity">+</button>
                </div>
            </td>
            <td class="fw-bold">$${total.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="removeItem(${index})" title="Remove item">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById("order-subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("total-amount").textContent = (subtotal - couponValue).toFixed(2);

    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
        }
        renderCart();
    }
}

function removeItem(index) {
   cart.splice(index, 1);
renderCart();
showNotification('success', 'Item Removed', 'The item has been removed from your cart.');
}

// Add item to cart function (for other pages)
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...item, quantity: 1});
    }
    
    renderCart();
}

// Initialize cart display
renderCart();

// Checkout button functionality
const checkoutButton = document.querySelector('.btn-checkout');
if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
           showNotification('warning', 'Cart is Empty', 'Please add items before checkout.');
            return;
        }
        
        // Save cart to localStorage before redirecting
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'checkout.html';
    });
}

function showNotification(type, title, message, duration = 5000) {
    const icons = {
        success: { icon: "fas fa-check-circle text-success", color: "alert-success" },
        warning: { icon: "fas fa-exclamation-circle text-warning", color: "alert-warning" },
        error: { icon: "fas fa-times-circle text-danger", color: "alert-danger" },
        info: { icon: "fas fa-info-circle text-primary", color: "alert-info" }
    };

    const notification = document.createElement('div');
    notification.className = `alert ${icons[type]?.color || 'alert-info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 350px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="${icons[type]?.icon || icons.info.icon} me-3" style="font-size: 1.5rem;"></i>
            <div>
                <strong>${title}</strong><br>
                <small>${message}</small>
            </div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);
}
