const cart = JSON.parse(localStorage.getItem('cart')) || [];
let subtotal = 0;

function renderCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    checkoutItems.innerHTML = '';
    subtotal = 0;

    cart.forEach(item => {
        const total = item.price * item.quantity;
        subtotal += total;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="text-start">${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${total.toFixed(2)}</td>
        `;
        checkoutItems.appendChild(row);
    });

    document.getElementById('checkout-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('checkout-total').textContent = subtotal.toFixed(2);
}

renderCheckoutItems();

document.getElementById('confirm-order').addEventListener('click', async () => {
    const form = document.getElementById('shipping-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
        showNotification('warning', 'No Payment Method', 'Please select a payment method.');
        return;
    }

    const paymentMethod = selectedPayment.id;

    if (paymentMethod === "creditCard") {
        try {
            const response = await fetch("http://localhost:4242/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart })
            });

            const data = await response.json();
            
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (error) {
            console.error('Payment error:', error);
            showNotification('error', 'Payment Error', 'Payment service is not available. Please try another method.');
        }
    } 
    else if (paymentMethod === "paypal") {
        showNotification('info', 'PayPal Coming Soon', 'Please use Credit Card or Cash on Delivery for now.');
    }
    else if (paymentMethod === "cashOnDelivery") {
        const shippingInfo = {
            firstName: form.elements['firstName'].value,
            lastName: form.elements['lastName'].value,
            email: form.elements['email'].value,
            address: form.elements['address'].value,
            city: form.elements['city'].value,
            zip: form.elements['zip'].value,
            phone: form.elements['phone'].value
        };

        const order = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            items: [...cart],
            subtotal: subtotal,
            total: subtotal,
            paymentMethod: 'Cash on Delivery',
            shippingInfo: shippingInfo,
            status: 'Pending'
        };

        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        localStorage.removeItem('cart');

        showNotification('success', 'Order Placed', `Order ID: ${order.id}. You will pay cash upon delivery.`);
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }
});

// Check if cart is empty
if (cart.length === 0) {
    document.querySelector('.container').innerHTML = `
        <div class="text-center py-5">
            <h3>Your cart is empty</h3>
            <p>Please add some items to your cart before checkout.</p>
            <a href="index.html" class="btn btn-primary">Continue Shopping</a>
        </div>
    `;
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
