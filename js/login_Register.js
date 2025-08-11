// ✅ Function to show notification (Toast) with animation
function showNotification(message, type = "success") {
  let container = document.getElementById("notification-container");

  // إنشاء الكونتينر لو مش موجود
  if (!container) {
    container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);
  }

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  container.appendChild(notification);

  // الإزالة بعد 2.5 ثانية
  setTimeout(() => {
    notification.style.animation = "fadeOut 0.4s forwards";
    setTimeout(() => {
      notification.remove();
    }, 400);
  }, 2500);
}

// ✅ Toggle between Login and Register
const containerEl = document.querySelector(".container");
const loginBtn = document.querySelector(".login-btn");
const registerBtn = document.querySelector(".register-btn");

registerBtn.addEventListener("click", () => {
  containerEl.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  containerEl.classList.remove("active");
});

// ✅ Login Form Validation & Check from users array
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let username = document.getElementById("loginUsername").value.trim();
  let password = document.getElementById("loginPassword").value.trim();
  let isValid = true;

  // Clear errors
  document.getElementById("loginUsernameError").textContent = "";
  document.getElementById("loginPasswordError").textContent = "";

  if (username === "") {
    document.getElementById("loginUsernameError").textContent = "Username is required";
    isValid = false;
  }

  if (password === "") {
    document.getElementById("loginPasswordError").textContent = "Password is required";
    isValid = false;
  }

  if (isValid) {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const matchedUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (matchedUser) {
      localStorage.setItem("currentUser", matchedUser.username);
      showNotification("✅ Login successful! Redirecting...", "success");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } else {
      showNotification("❌ Invalid username or password", "error");
    }
  }
});

// ✅ Register Form Validation & Store in users array
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let username = document.getElementById("registerUsername").value.trim();
  let email = document.getElementById("registerEmail").value.trim();
  let password = document.getElementById("registerPassword").value;
  let confirmPassword = document.getElementById("registerConfirmPassword").value;
  let phone = document.getElementById("registerPhone").value.trim();
  let gender = document.querySelector('input[name="gender"]:checked');

  let isValid = true;

  document.getElementById("registerUsernameError").textContent = "";
  document.getElementById("registerEmailError").textContent = "";
  document.getElementById("registerPasswordError").textContent = "";
  document.getElementById("registerConfirmPasswordError").textContent = "";
  document.getElementById("registerPhoneError").textContent = "";
  document.getElementById("registerGenderError").textContent = "";

  if (username === "") {
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

  if (isValid) {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      showNotification("❌ Username already exists. Please choose another one.", "error");
      return;
    }

    const newUser = {
      id: Date.now(),
      username: username,
      password: password,
      email: email,
      phone: phone,
      gender: gender.value,
      role: "user"
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("currentUser", username);

    showNotification("✅ Registration successful! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  }
});
