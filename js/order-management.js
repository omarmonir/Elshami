document.addEventListener("DOMContentLoaded", () => {
    const orderTableBody = document.getElementById("orderTableBody");
    const searchOrder = document.getElementById("searchOrder");
    const refreshOrdersBtn = document.getElementById("refreshOrdersBtn");

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let orderToDelete = null;

    // Render Orders
    function renderOrders(data = orders) {
        orderTableBody.innerHTML = "";
        if (data.length === 0) {
            orderTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">No orders found</td>
                </tr>
            `;
            return;
        }

        data.forEach((order, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${order.shippingInfo.firstName} ${order.shippingInfo.lastName}</td>
                <td>${order.items.length} items</td>
                <td>$${order.total.toFixed(2)}</td>
                <td><span class="badge bg-warning">${order.status}</span></td>
                <td>${new Date(order.date).toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-info me-1" onclick="viewOrderDetails('${order.id}')">View</button>
                    <button class="btn btn-sm btn-danger" onclick="confirmDeleteOrder('${order.id}')">Delete</button>
                </td>
            `;
            orderTableBody.appendChild(row);
        });
    }

    // View order details
    window.viewOrderDetails = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const orderDetailsContent = document.getElementById("orderDetailsContent");
        orderDetailsContent.innerHTML = `
            <h6>Customer: ${order.shippingInfo.firstName} ${order.shippingInfo.lastName}</h6>
            <p>Email: ${order.shippingInfo.email}</p>
            <p>Address: ${order.shippingInfo.address}, ${order.shippingInfo.city} - ${order.shippingInfo.zip}</p>
            <p>Phone: ${order.shippingInfo.phone}</p>
            <p>Payment: ${order.paymentMethod}</p>
            <hr>
            <h6>Items:</h6>
            <ul>
                ${order.items.map(item => `<li>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</li>`).join("")}
            </ul>
            <hr>
            <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
        `;
        new bootstrap.Modal(document.getElementById("orderModal")).show();
    };

    // Confirm delete
    window.confirmDeleteOrder = (orderId) => {
        orderToDelete = orderId;
        new bootstrap.Modal(document.getElementById("deleteOrderModal")).show();
    };

    // Delete order
    document.getElementById("confirmDeleteOrderBtn").addEventListener("click", () => {
        orders = orders.filter(o => o.id !== orderToDelete);
        localStorage.setItem("orders", JSON.stringify(orders));
        renderOrders();
        orderToDelete = null;
        bootstrap.Modal.getInstance(document.getElementById("deleteOrderModal")).hide();
    });

    // Search
    searchOrder.addEventListener("input", () => {
        const term = searchOrder.value.toLowerCase();
        const filtered = orders.filter(order =>
            order.shippingInfo.firstName.toLowerCase().includes(term) ||
            order.shippingInfo.lastName.toLowerCase().includes(term) ||
            order.status.toLowerCase().includes(term) ||
            order.id.includes(term)
        );
        renderOrders(filtered);
    });

    // Refresh
    refreshOrdersBtn.addEventListener("click", () => {
        orders = JSON.parse(localStorage.getItem("orders")) || [];
        renderOrders();
    });

    renderOrders();
});
