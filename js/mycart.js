let cart = [
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
        image: "./Images/image_itemsList_4.png" 
    }
];

let couponValue = 0;

function renderCart() {
    const tbody = document.getElementById("cart-items");
    tbody.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, index) => {
        const total = item.price * item.quantity;
        subtotal += total;
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img src="${item.image}" 
                     alt="${item.name}"     
                     style="width: 60px; height: 60px; object-fit: cover;" />
            </td>
            <td>${item.name}</td>
            <td>$${item.price}</td>
           <td>
                <div class="d-flex align-items-center justify-content-center gap-1 flex-nowrap" style="min-width: 100px;">
                    <button class="btn btn-sm btn-outline-danger" onclick="updateQuantity(${index}, -1)" style="min-width: 30px; padding: 2px 8px;">-</button>
                    <span class="mx-1" style="min-width: 25px; text-align: center;">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-success" onclick="updateQuantity(${index}, 1)" style="min-width: 30px; padding: 2px 8px;">+</button>
                </div>
            </td>
            <td>$${total}</td>
            <td><button class="btn btn-sm btn-danger" onclick="removeItem(${index})">X</button></td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById("order-subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("total-amount").textContent = (subtotal - couponValue).toFixed(2);
    
    console.log("Cart saved:", cart);
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

renderCart();


const checkoutButton = document.querySelector('.btn-checkout');

checkoutButton.addEventListener('click', proceedToCheckout);

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        return;
    }
    
  
    localStorage.setItem('cart', JSON.stringify(cart));
    
    window.location.href = 'checkout.html';
    
}
