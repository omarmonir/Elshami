// ✅ Toggle between Login and Register
const container = document.querySelector(".container");
const loginBtn = document.querySelector(".login-btn");
const registerBtn = document.querySelector(".register-btn");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
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
      // ✅ تخزين اسم المستخدم الحالي في LocalStorage
      localStorage.setItem("currentUser", matchedUser.username);

      alert(`Login successful! ✅\nWelcome ${matchedUser.username} (${matchedUser.role})`);

      // مثال للتحويل بعد تسجيل الدخول
      // if (matchedUser.role === "admin") {
      //   window.location.href = "admin.html";
      // } else {
      //   window.location.href = "home.html";
      // }
    } else {
      alert("❌ Invalid username or password");
    }
  }
});

// ✅ Register Form Validation & Store in users array with role = "user"
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let username = document.getElementById("registerUsername").value.trim();
  let email = document.getElementById("registerEmail").value.trim();
  let password = document.getElementById("registerPassword").value;
  let confirmPassword = document.getElementById("registerConfirmPassword").value;
  let phone = document.getElementById("registerPhone").value.trim();
  let gender = document.querySelector('input[name="gender"]:checked');

  let isValid = true;

  // Clear previous error messages
  document.getElementById("registerUsernameError").textContent = "";
  document.getElementById("registerEmailError").textContent = "";
  document.getElementById("registerPasswordError").textContent = "";
  document.getElementById("registerConfirmPasswordError").textContent = "";
  document.getElementById("registerPhoneError").textContent = "";
  document.getElementById("registerGenderError").textContent = "";

  // Username check
  if (username === "") {
    document.getElementById("registerUsernameError").textContent = "Username is required";
    isValid = false;
  }

  // Email check
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!emailPattern.test(email)) {
    document.getElementById("registerEmailError").textContent = "Invalid email format";
    isValid = false;
  }

  // Password check
  if (password.length < 6) {
    document.getElementById("registerPasswordError").textContent = "Password must be at least 6 characters";
    isValid = false;
  }

  if (confirmPassword !== password) {
    document.getElementById("registerConfirmPasswordError").textContent = "Passwords do not match";
    isValid = false;
  }

  // Phone number check
  const phonePattern = /^(010|011|012|015)\d{8}$/;
  if (!phonePattern.test(phone)) {
    document.getElementById("registerPhoneError").textContent = "Invalid phone number";
    isValid = false;
  }

  // Gender check
  if (!gender) {
    document.getElementById("registerGenderError").textContent = "Please select your gender";
    isValid = false;
  }

  if (isValid) {
<<<<<<< HEAD
    let users = JSON.parse(localStorage.getItem("users")) || [];
=======
    const newUser = {
      username: username,
      password: password,
      email: email,
      phone: phone,
      gender: gender.value,
      role: "user", // ✅ Assign role here
      fullName: "", // هيتملوا من صفحة البروفايل
      title: "",
      age: "",
      about: "",
      country: "",
      postcode: "",
      city: "",
      address: "",
      image: "" // صورة البروفايل
    };

    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
>>>>>>> 6c3047f7b633a3cb12543f1003841e32d96471b8

    // Check for duplicate username
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      alert("❌ Username already exists. Please choose another one.");
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

    alert("Registration successful! ✅");
    document.getElementById("registerForm").reset();
    container.classList.remove("active");
  }
});
