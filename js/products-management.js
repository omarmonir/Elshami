let products = JSON.parse(localStorage.getItem('products')) || [];
let editIndex = null;

// Render Products
function renderProducts() {
    const tbody = document.getElementById("productsTableBody");
    tbody.innerHTML = "";
    products.forEach((p, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${p.name}</td>
                <td>${p.toppings}</td>
                <td>${p.price}</td>
                <td><img src="${p.image}" width="50" height="50" style="object-fit:cover"></td>
                <td class="actions-cell">
                <div class="action-buttons">
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDelete(${index})">Delete</button>
                     </div>
                </td>
            </tr>
        `;
    });
}
renderProducts();

// Add Product Button
document.getElementById("addProductBtn").addEventListener("click", () => {
    editIndex = null;
    document.getElementById("productForm").reset();
    document.querySelector("#productModal .modal-title").innerText = "Add Product";
    new bootstrap.Modal(document.getElementById("productModal")).show();
});

// Save Product
document.getElementById("productForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const newProduct = {
        name: document.getElementById("productNameInput").value,
        toppings: document.getElementById("productToppingsInput").value,
        price: parseFloat(document.getElementById("productPriceInput").value),
        image: document.getElementById("productImageInput").value
    };

    if (editIndex !== null) {
        products[editIndex] = newProduct;
    } else {
        products.push(newProduct);
    }
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
    bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
});

// Edit Product
function editProduct(index) {
    editIndex = index;
    const p = products[index];
    document.getElementById("productNameInput").value = p.name;
    document.getElementById("productToppingsInput").value = p.toppings;
    document.getElementById("productPriceInput").value = p.price;
    document.getElementById("productImageInput").value = p.image;
    document.querySelector("#productModal .modal-title").innerText = "Edit Product";
    new bootstrap.Modal(document.getElementById("productModal")).show();
}

// Confirm Delete
let deleteIndex = null;
function confirmDelete(index) {
    deleteIndex = index;
    new bootstrap.Modal(document.getElementById("deleteConfirmModal")).show();
}
document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
    products.splice(deleteIndex, 1);
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
    bootstrap.Modal.getInstance(document.getElementById("deleteConfirmModal")).hide();
});

// Search Products
document.getElementById("searchProduct").addEventListener("input", function() {
    const term = this.value.toLowerCase();
    document.querySelectorAll("#productsTableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(term) ? "" : "none";
    });
});
