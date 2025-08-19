// جلب الكارت من localStorage أو مصفوفة فاضية
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let couponValue = 0;

// عرض محتويات الكارت
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
                 />
            </td>
            <td class="text-start">${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div class="d-flex align-items-center justify-content-center gap-1">
                    <button class="btn btn-sm btn-outline-danger" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="mx-2 fw-bold">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-success" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </td>
            <td class="fw-bold">$${total.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">
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

// تعديل الكمية
function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
        }
        renderCart();
    }
}

// حذف عنصر
function removeItem(index) {
    cart.splice(index, 1);

    if (cart.length === 0) {
        localStorage.removeItem('cart'); // مسح الكارت من اللوكال ستوريج
    } else {
        localStorage.setItem('cart', JSON.stringify(cart)); // تحديث الكارت في اللوكال ستوريج
    }

    renderCart();
    showNotification('success', 'Item Removed', 'The item has been removed from your cart.');
}


// دالة لإضافة منتج جديد وتصفير الكارت
function addToCartSingle(product) {
    // نبدأ بكارت جديد
    cart = [{ ...product, quantity: 1 }];

    // حفظ في localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // تحديث العرض
    renderCart();

    // إشعار
    showNotification('success', 'Added to Cart', `${product.name} is now the only item in your cart.`);
}

// إشعار
function showNotification(type, title, message, duration = 3000) {
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

// بدء العرض
renderCart();

// زر الشيك آوت
const checkoutButton = document.querySelector('.btn-checkout');
if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('warning', 'Cart is Empty', 'Please add items before checkout.');
            return;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'checkout.html';
    });
}
