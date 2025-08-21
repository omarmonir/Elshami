document.addEventListener("DOMContentLoaded", () => {
    // توحيد مفاتيح التخزين
    const STORAGE_KEY = "users";
    const CURRENT_USER_KEY = "currentUser";
    const DEFAULT_PROFILE_IMAGE = "../Images/userpro.png";

    const form = document.getElementById("editProfileForm");
    const headerPic = document.querySelector(".header-user-pic img");
    const sidebarPic = document.querySelector(".profile-pic img");
    const sidebarName = document.querySelector(".profile-pic h3");
    const sidebarTitle = document.querySelector(".profile-pic p");
    const headerProfileImg = document.getElementById("headerProfileImg");
    const viewProfileBtn = document.getElementById("viewProfileBtn");

    // تحميل البيانات مع التحقق من الصحة
    let users = [];
    try {
        users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        console.error("Error loading users data:", error);
        users = [];
    }

    const currentUserName = localStorage.getItem(CURRENT_USER_KEY);
    
    if (!currentUserName) {
        console.error("No user logged in - redirecting to login");
        window.location.href = "login.html";
        return;
    }

    let currentUser = users.find(user => user.username === currentUserName);
    
    if (!currentUser) {
        console.error("User not found in database");
        currentUser = {
            username: currentUserName,
            fullName: "",
            title: "",
            age: "",
            about: "",
            phone: "",
            email: "",
            country: "",
            postcode: "",
            city: "",
            address: "",
            image: DEFAULT_PROFILE_IMAGE // استخدام الصورة الافتراضية
        };
        users.push(currentUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }

    // إنشاء عناصر الرسائل إذا لم تكن موجودة
    let generalErrorMsg = document.getElementById("generalErrorMsg");
    if (!generalErrorMsg) {
        generalErrorMsg = document.createElement("div");
        generalErrorMsg.id = "generalErrorMsg";
        generalErrorMsg.style.color = "red";
        generalErrorMsg.style.marginTop = "15px";
        generalErrorMsg.style.fontSize = "0.9rem";
        form.appendChild(generalErrorMsg);
    }
    generalErrorMsg.textContent = "";

    let notification = document.getElementById("notification");
    if (!notification) {
        notification = document.createElement("div");
        notification.id = "notification";
        notification.className = "notification";
        form.parentElement.insertBefore(notification, form);
    }
    notification.style.display = "none";

    // دالة لتحديث الصور في الواجهة
    function updateProfileImages(imageUrl) {
        if (headerPic) headerPic.src = imageUrl;
        if (sidebarPic) sidebarPic.src = imageUrl;
    }

    // دالة لحفظ بيانات المستخدم
    function saveUserData() {
        const userIndex = users.findIndex(user => user.username === currentUserName);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        }
    }

    // دالة لملء البيانات
    function fillProfileFields() {
        const fields = [
            {id: "fullName", value: currentUser.fullName || currentUser.username || ""},
            {id: "title", value: currentUser.title || ""},
            {id: "age", value: currentUser.age || ""},
            {id: "about", value: currentUser.about || ""},
            {id: "phone", value: currentUser.phone || ""},
            {id: "email", value: currentUser.email || ""},
            {id: "country", value: currentUser.country || ""},
            {id: "postcode", value: currentUser.postcode || ""},
            {id: "city", value: currentUser.city || ""},
            {id: "address", value: currentUser.address || ""}
        ];

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) element.value = field.value;
        });

        // استخدام الصورة الافتراضية إذا لم تكن هناك صورة
        if (!currentUser.image) {
            currentUser.image = DEFAULT_PROFILE_IMAGE;
        }
        updateProfileImages(currentUser.image);

        if (sidebarName) {
            sidebarName.textContent = currentUser.fullName || currentUser.username || "User Name";
        }
        if (sidebarTitle) {
            sidebarTitle.textContent = currentUser.title || "User Title";
        }
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

        // تحديث بيانات المستخدم
        const updatedFields = [
            "fullName", "title", "age", "about", "phone", "email", 
            "country", "postcode", "city", "address"
        ];

        updatedFields.forEach(field => {
            currentUser[field] = document.getElementById(field).value.trim();
        });

        // تأكد من وجود صورة (استخدم الافتراضية إذا لم تكن موجودة)
        if (!currentUser.image) {
            currentUser.image = DEFAULT_PROFILE_IMAGE;
            updateProfileImages(DEFAULT_PROFILE_IMAGE);
        }

        // تحديث واجهة المستخدم
        if (sidebarName) sidebarName.textContent = currentUser.fullName;
        if (sidebarTitle) sidebarTitle.textContent = currentUser.title;

        // حفظ البيانات المحدثة
        saveUserData();

        generalErrorMsg.textContent = "";
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
                    updateProfileImages(reader.result);
                    saveUserData();
                };
                reader.readAsDataURL(file);
            } else {
                // إذا لم يتم اختيار صورة، استخدم الصورة الافتراضية
                currentUser.image = DEFAULT_PROFILE_IMAGE;
                updateProfileImages(DEFAULT_PROFILE_IMAGE);
                saveUserData();
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