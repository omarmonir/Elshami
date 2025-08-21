let users = JSON.parse(localStorage.getItem("users")) || [];
let deleteUserId = null;

// تنبيه مخصص
function showNotification(type, title, message, duration = 3000) {
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

// عرض المستخدمين
function loadUsers(filter = "") {
    users = JSON.parse(localStorage.getItem("users")) || [];
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";

    let filteredUsers = users;

    if (filter) {
        filter = String(filter).toLowerCase();
        filteredUsers = users.filter(user =>
            user.username.toLowerCase().includes(filter) ||
            user.email.toLowerCase().includes(filter) ||
            (user.role && user.role.toLowerCase().includes(filter)) ||
            (user.status && user.status.toLowerCase().includes(filter))
        );
    }

    filteredUsers.forEach((user, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role || ''}</td>
            <td>${user.status || ''}</td>
            <td class="actions-cell">
                 <div class="action-buttons">
                    <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDelete(${user.id})">Delete</button>
                 </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// إضافة أو تعديل
document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("userId").value;
    const username = document.getElementById("userNameInput").value.trim();
    const email = document.getElementById("userEmailInput").value.trim();
    const password = document.getElementById("userPasswordInput").value;
    const confirmPassword = document.getElementById("userConfirmPasswordInput").value;
    const role = document.getElementById("userRoleInput").value.trim();
    const status = document.getElementById("userStatusInput").value.trim();
    const phone = document.getElementById("userPhoneInput").value.trim();
    const gender = document.querySelector('input[name="userGender"]:checked')?.value || "";

    if (password !== confirmPassword) {
        showNotification('error', 'Password Error', 'Passwords do not match!');
        return;
    }

    users = JSON.parse(localStorage.getItem("users")) || [];

    if (id) {
        const index = users.findIndex(u => u.id == id);
        if (index !== -1) {
            users[index] = { 
                id: parseInt(id), 
                username, 
                email, 
                password, 
                role, 
                status,
                phone,
                gender
            };
            showNotification('success', 'User Updated', 'User details have been updated successfully.');
        }
    } else {
        if (users.find(u => u.username === username)) {
            showNotification('error', 'Duplicate Username', 'Username already exists!');
            return;
        }
        const newUser = {
            id: Date.now(),
            username,
            email,
            password,
            role,
            status,
            phone,
            gender
        };
        users.push(newUser);
        showNotification('success', 'User Added', 'New user has been added successfully.');
    }

    localStorage.setItem("users", JSON.stringify(users));
    loadUsers();
    document.getElementById("userForm").reset();
    bootstrap.Modal.getInstance(document.getElementById("userModal")).hide();
});

// فتح المودال للإضافة
document.getElementById("addUserBtn").addEventListener("click", () => {
    document.getElementById("userForm").reset();
    document.getElementById("userId").value = "";
    new bootstrap.Modal(document.getElementById("userModal")).show();
});

// تعديل
function editUser(id) {
    users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.id == id);
    if (!user) return;
    document.getElementById("userId").value = user.id;
    document.getElementById("userNameInput").value = user.username;
    document.getElementById("userEmailInput").value = user.email;
    document.getElementById("userPasswordInput").value = user.password;
    document.getElementById("userConfirmPasswordInput").value = user.password;

    // تعيين role مع مراعاة حالة الحروف (تحويل النص للـ lowercase للمقارنة)
    const roleSelect = document.getElementById("userRoleInput");
    if(roleSelect) {
        if(user.role?.toLowerCase() === "admin") roleSelect.value = "Admin";
        else roleSelect.value = "User";
    }

    // تعيين status مع مراعاة حالة الحروف
    const statusSelect = document.getElementById("userStatusInput");
    if(statusSelect) {
        if(user.status?.toLowerCase() === "active") statusSelect.value = "Active";
        else statusSelect.value = "Inactive";
    }

    // تعيين phone
    document.getElementById("userPhoneInput").value = user.phone || '';

    // تعيين gender في راديو بوتون مع مراعاة حالة الحروف
    if(user.gender) {
        const genderRadios = document.querySelectorAll('input[name="gender"]');
        genderRadios.forEach(radio => {
            radio.checked = radio.value.toLowerCase() === user.gender.toLowerCase();
        });
    } else {
        const genderRadios = document.querySelectorAll('input[name="gender"]');
        genderRadios.forEach(radio => radio.checked = false);
    }

    new bootstrap.Modal(document.getElementById("userModal")).show();
}


// تأكيد الحذف
function confirmDelete(id) {
    deleteUserId = id;
    new bootstrap.Modal(document.getElementById("deleteConfirmModal")).show();
}

// تنفيذ الحذف
document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
    users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.filter(u => u.id != deleteUserId);
    localStorage.setItem("users", JSON.stringify(users));
    loadUsers();
    bootstrap.Modal.getInstance(document.getElementById("deleteConfirmModal")).hide();
    showNotification('success', 'User Deleted', 'The user has been deleted successfully.');
});

// بحث
document.getElementById("searchUser").addEventListener("input", function () {
    loadUsers(this.value);
});

// تحميل البيانات عند فتح الصفحة
document.addEventListener("DOMContentLoaded", () => loadUsers());
