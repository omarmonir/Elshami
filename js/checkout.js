const cart = JSON.parse(localStorage.getItem('cart')) || [];
let subtotal = 0;

const checkoutItems = document.getElementById('checkout-items');
checkoutItems.innerHTML = '';

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

document.getElementById('confirm-order').addEventListener('click', () => {
    const form = document.getElementById('shipping-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const order = {
        date: new Date().toISOString(), 
        items: [...cart],
        subtotal: subtotal,
        total: subtotal,
        shippingInfo: {
          
            name: form.elements['firstName'].value,
            address: form.elements['address'].value,
            
        }
    };
    
   
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    
    localStorage.setItem('orders', JSON.stringify(orders));
    
    alert('Order placed successfully! Thank you for your purchase.');
    
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
});