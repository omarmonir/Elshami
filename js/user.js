// user.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("editProfileForm");

    // عناصر الهيدر والسايد بار
    const headerPic = document.querySelector(".header-user-pic img");
    const sidebarPic = document.querySelector(".profile-pic img");
    const sidebarName = document.querySelector(".profile-pic h3");
    const sidebarTitle = document.querySelector(".profile-pic p");

    // جلب المستخدم الحالي
    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    let currentUserName = localStorage.getItem("currentUser");

    let currentUser = users.find(user => user.username === currentUserName) || {};

    // تعبئة الحقول
    function fillProfileFields() {
        document.getElementById("fullName").value = currentUser.fullName || currentUser.username || "";
        document.getElementById("title").value = currentUser.title || "";
        document.getElementById("age").value = currentUser.age || "";
        document.getElementById("about").value = currentUser.about || "";
        document.getElementById("phone").value = currentUser.phone || "";
        document.getElementById("email").value = currentUser.email || "";
        document.getElementById("country").value = currentUser.country || "";
        document.getElementById("postcode").value = currentUser.postcode || "";
        document.getElementById("city").value = currentUser.city || "";
        document.getElementById("address").value = currentUser.address || "";

        if (currentUser.image) {
            headerPic.src = currentUser.image;
            sidebarPic.src = currentUser.image;
        }

        sidebarName.textContent = currentUser.fullName || currentUser.username || "User Name";
        sidebarTitle.textContent = currentUser.title || "User Title";
    }

    fillProfileFields();

    // دالة لعرض الخطأ
    function showError(input, message) {
        let errorElem = input.parentElement.querySelector(".error-message");
        if (!errorElem) {
            errorElem = document.createElement("div");
            errorElem.className = "error-message";
            errorElem.style.color = "red";
            errorElem.style.fontSize = "0.85rem";
            input.parentElement.appendChild(errorElem);
        }
        errorElem.textContent = message;
    }

    function clearError(input) {
        const errorElem = input.parentElement.querySelector(".error-message");
        if (errorElem) errorElem.textContent = "";
    }

    // عند حفظ التعديلات
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let isValid = true;
        const requiredFields = ["fullName", "title", "age"];

        requiredFields.forEach((id) => {
            const input = document.getElementById(id);
            if (!input.value.trim()) {
                showError(input, "This field is required");
                isValid = false;
            } else {
                clearError(input);
            }
        });

        if (!isValid) return;

        // تحديث بيانات المستخدم
        currentUser.fullName = document.getElementById("fullName").value.trim();
        currentUser.title = document.getElementById("title").value.trim();
        currentUser.age = document.getElementById("age").value.trim();
        currentUser.about = document.getElementById("about").value.trim();
        currentUser.phone = document.getElementById("phone").value.trim();
        currentUser.email = document.getElementById("email").value.trim();
        currentUser.country = document.getElementById("country").value.trim();
        currentUser.postcode = document.getElementById("postcode").value.trim();
        currentUser.city = document.getElementById("city").value.trim();
        currentUser.address = document.getElementById("address").value.trim();

        // تحديث بيانات الصورة في الهيدر والسايد بار
        sidebarName.textContent = currentUser.fullName;
        sidebarTitle.textContent = currentUser.title;

        // تحديث البيانات في الـ localStorage
        let index = users.findIndex(user => user.username === currentUserName);
        if (index !== -1) {
            users[index] = currentUser;
            localStorage.setItem("registeredUsers", JSON.stringify(users));
        }

        alert("Profile updated successfully!");
    });

    // تغيير الصورة
    sidebarPic.addEventListener("click", () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.click();

        fileInput.addEventListener("change", () => {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    currentUser.image = reader.result;
                    headerPic.src = reader.result;
                    sidebarPic.src = reader.result;

                    // تحديث في localStorage
                    let index = users.findIndex(user => user.username === currentUserName);
                    if (index !== -1) {
                        users[index] = currentUser;
                        localStorage.setItem("registeredUsers", JSON.stringify(users));
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    });
});
