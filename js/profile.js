// profile.js

document.addEventListener("DOMContentLoaded", () => {
  // الحصول على الحقول والعناصر في صفحة البروفايل
  const form = document.getElementById("editProfileForm");

  // عناصر صورة الهيدر إذا موجودة في صفحة البروفايل (اختياري)
  const headerProfileImg = document.getElementById("headerProfileImg");

  // إضافة عناصر السايدبار (الصورة، الاسم، الوظيفة)
  const sidebarProfileImg = document.getElementById("sidebarProfileImg");
  const sidebarName = document.getElementById("sidebarName");
  const sidebarTitle = document.getElementById("sidebarTitle");

  // جلب بيانات المستخدم من localStorage
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

    if (currentUser.image && headerProfileImg) {
      headerProfileImg.src = currentUser.image;
    }
  }

  fillProfileFields();

  // دالة عرض الخطأ
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

  // حدث عند الضغط على زر الحفظ
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;
    const requiredFields = ["fullName", "title", "age"];

    requiredFields.forEach(id => {
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

    // تحديث localStorage
    let index = users.findIndex(user => user.username === currentUserName);
    if (index !== -1) {
      users[index] = currentUser;
      localStorage.setItem("registeredUsers", JSON.stringify(users));
      alert("Profile updated successfully!");

      // بعد التحديث نعيد تعبئة بيانات السايدبار (الاسم والوظيفة والصورة)
      fillSidebarProfile();
    }
  });

  // إضافة عرض الاسم والوظيفة في السايدبار
  function fillSidebarProfile() {
    if (sidebarProfileImg && currentUser.image) {
      sidebarProfileImg.src = currentUser.image;
    }
    if (sidebarName) {
      sidebarName.textContent = currentUser.fullName || currentUser.username || "User Name";
    }
    if (sidebarTitle) {
      sidebarTitle.textContent = currentUser.title || "User Title";
    }
  }

  // نعرض الاسم والوظيفة في السايدبار عند تحميل الصفحة
  fillSidebarProfile();

  // إذا في زر "View Profile" وتريد تفعيله (مثال)
  const viewProfileBtn = document.getElementById("viewProfileBtn");
  if (viewProfileBtn) {
    viewProfileBtn.addEventListener("click", () => {
      alert("View Profile button clicked!");
    });
  }

});
