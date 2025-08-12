document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("editProfileForm");

    const headerPic = document.querySelector(".header-user-pic img");
    const sidebarPic = document.querySelector(".profile-pic img");
    const sidebarName = document.querySelector(".profile-pic h3");
    const sidebarTitle = document.querySelector(".profile-pic p");

    const headerProfileImg = document.getElementById("headerProfileImg");
    const viewProfileBtn = document.getElementById("viewProfileBtn"); // زر View Profile لو موجود

    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    let currentUserName = localStorage.getItem("currentUser");
    let currentUser = users.find(user => user.username === currentUserName) || {};

    // عنصر لعرض رسالة الخطأ العامة (يمكن تضعه تحت الفورم في HTML)
    let generalErrorMsg = document.getElementById("generalErrorMsg");
    if (!generalErrorMsg) {
        generalErrorMsg = document.createElement("div");
        generalErrorMsg.id = "generalErrorMsg";
        generalErrorMsg.style.color = "red";
        generalErrorMsg.style.marginTop = "15px";
        generalErrorMsg.style.fontSize = "0.9rem";
        form.appendChild(generalErrorMsg);
    }
    generalErrorMsg.textContent = ""; // نظف الرسالة في البداية

    // عنصر الإشعار العام (notification)
    let notification = document.getElementById("notification");
    if (!notification) {
        notification = document.createElement("div");
        notification.id = "notification";
        notification.className = "notification"; // تأكد من وجود هذه الكلاس في CSS
        // وضع عنصر الإشعار قبل الفورم
        form.parentElement.insertBefore(notification, form);
    }
    notification.style.display = "none";

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

    function isProfileComplete() {
        const requiredFields = ["fullName", "title", "age"];
        for (let id of requiredFields) {
            const val = document.getElementById(id).value.trim();
            if (!val) return false;
        }
        return true;
    }

    // دالة إظهار الإشعار مع النوع (نجاح أو خطأ) مع اختفاء تلقائي بعد 3 ثواني
    function showNotification(message, type = "success") {
        notification.textContent = message;
        notification.className = "notification " + (type === "success" ? "success" : "error");
        notification.style.display = "block";

        setTimeout(() => {
            notification.style.display = "none";
            notification.textContent = "";
            notification.className = "notification";
        }, 3000);
    }

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

        sidebarName.textContent = currentUser.fullName;
        sidebarTitle.textContent = currentUser.title;

        let index = users.findIndex(user => user.username === currentUserName);
        if (index !== -1) {
            users[index] = currentUser;
            localStorage.setItem("registeredUsers", JSON.stringify(users));
        }

        generalErrorMsg.textContent = ""; // نظف رسالة الخطأ العامة
        showNotification("Profile updated successfully!", "success");
    });

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

    function goToProfile() {
        if (!isProfileComplete()) {
            generalErrorMsg.textContent = "Please complete your profile before viewing it.";
            showNotification("Please complete your profile before viewing it.", "error");
            return;
        }
        generalErrorMsg.textContent = "";
        window.location.href = "profile.html";
    }

    headerProfileImg.style.cursor = "pointer";
    headerProfileImg.addEventListener("click", goToProfile);

    if (viewProfileBtn) {
        viewProfileBtn.style.cursor = "pointer";
        viewProfileBtn.addEventListener("click", goToProfile);
    }
});
