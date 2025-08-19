if (typeof window.showNotification !== "function") {
    window.showNotification = function (message, type = "success") {
        let container = document.getElementById("notification-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "notification-container";
            document.body.appendChild(container);
        }

        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.minWidth = "250px";
        notification.style.padding = "12px 16px";
        notification.style.borderRadius = "8px";
        notification.style.color = "#fff";
        notification.style.fontWeight = "500";
        notification.style.boxShadow = "0 6px 18px rgba(0,0,0,0.12)";
        notification.style.animation = "slideIn 0.35s ease";

        if (type === "success") notification.style.background = "#28a745";
        else if (type === "error") notification.style.background = "#dc3545";
        else notification.style.background = "#2196f3";

        container.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = "fadeOut 0.35s ease forwards";
            setTimeout(() => notification.remove(), 400);
        }, 2500);
    };
}

const containerEl = document.querySelector(".container");
const loginBtn = document.querySelector(".login-btn");
const registerBtn = document.querySelector(".register-btn");

if (registerBtn) {
    registerBtn.addEventListener("click", () => containerEl?.classList.add("active"));
}
if (loginBtn) {
    loginBtn.addEventListener("click", () => containerEl?.classList.remove("active"));
}

const STORAGE_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = (document.getElementById("loginEmail")?.value || "").trim().toLowerCase();
        const password = (document.getElementById("loginPassword")?.value || "").trim();
        let isValid = true;

        const loginEmailError = document.getElementById("loginEmailError");
        const loginPasswordError = document.getElementById("loginPasswordError");
        if (loginEmailError) loginEmailError.textContent = "";
        if (loginPasswordError) loginPasswordError.textContent = "";

        if (!email) {
            if (loginEmailError) loginEmailError.textContent = "Email is required";
            isValid = false;
        } else {
            const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
            if (!emailPattern.test(email)) {
                if (loginEmailError) loginEmailError.textContent = "Invalid email format";
                isValid = false;
            }
        }

        if (!password) {
            if (loginPasswordError) loginPasswordError.textContent = "Password is required";
            isValid = false;
        }

        if (!isValid) return;

        const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const matchedUser = users.find(u => u.email.toLowerCase() === email && u.password === password);

        if (matchedUser) {
            localStorage.setItem(CURRENT_USER_KEY, matchedUser.username);
            showNotification("✅ Login successful! Redirecting...", "success");
            setTimeout(() => {
                if (matchedUser.role && matchedUser.role.toLowerCase() === "admin") {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "index.html";
                }
            }, 1200);
        } else {
            showNotification("❌ Invalid email or password", "error");
        }
    });
}

// REGISTER
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = (document.getElementById("registerUsername")?.value || "").trim();
        const email = (document.getElementById("registerEmail")?.value || "").trim().toLowerCase();
        const password = document.getElementById("registerPassword")?.value || "";
        const confirmPassword = document.getElementById("registerConfirmPassword")?.value || "";
        const phone = (document.getElementById("registerPhone")?.value || "").trim();
        const genderInput = document.querySelector('input[name="gender"]:checked');
        const gender = genderInput ? genderInput.value : "";

        let isValid = true;

        ["registerUsernameError","registerEmailError","registerPasswordError","registerConfirmPasswordError","registerPhoneError","registerGenderError"].forEach(id=>{
            const el = document.getElementById(id);
            if(el) el.textContent = "";
        });

        if (!username) {
            document.getElementById("registerUsernameError").textContent = "Username is required";
            isValid = false;
        }
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!emailPattern.test(email)) {
            document.getElementById("registerEmailError").textContent = "Invalid email format";
            isValid = false;
        }
        if (password.length < 6) {
            document.getElementById("registerPasswordError").textContent = "Password must be at least 6 characters";
            isValid = false;
        }
        if (confirmPassword !== password) {
            document.getElementById("registerConfirmPasswordError").textContent = "Passwords do not match";
            isValid = false;
        }
        const phonePattern = /^(010|011|012|015)\d{8}$/;
        if (!phonePattern.test(phone)) {
            document.getElementById("registerPhoneError").textContent = "Invalid phone number";
            isValid = false;
        }
        if (!gender) {
            document.getElementById("registerGenderError").textContent = "Please select your gender";
            isValid = false;
        }
        if (!isValid) return;

        const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        if (users.find(u => u.username === username)) {
            showNotification("❌ Username already exists. Please choose another one.", "error");
            return;
        }
        if (users.find(u => u.email.toLowerCase() === email)) {
            showNotification("❌ Email already registered. Please use another email.", "error");
            return;
        }

        const newUser = {
    id: Date.now(),
    username,
    password,
    email,
    phone,    // حفظ رقم الهاتف
    gender,   // حفظ النوع
    role: "user", // كل المستخدمين الجدد يكونوا يوزر
    fullName: "",
    title: "",
    age: "",
    about: "",
    country: "",
    postcode: "",
    city: "",
    address: "",
    image: "",
    status: "Active"
};
registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const genderInput = document.querySelector('input[name="gender"]:checked');
    const gender = genderInput ? genderInput.value : "";
    console.log("Selected gender:", gender);  // << راقب هذه القيمة في الكونسول

    // ... باقي الكود
});


        users.push(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        localStorage.setItem(CURRENT_USER_KEY, username);

        showNotification("✅ Registration successful! Redirecting...", "success");
        setTimeout(() => {
            if (newUser.role === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "index.html";
            }
        }, 1200);
    });
}
