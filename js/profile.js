document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "registeredUsers";
  const CURRENT_USER_KEY = "currentUser";

  // تحميل بيانات المستخدمين والمستخدم الحالي
  let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const currentUserName = localStorage.getItem(CURRENT_USER_KEY);
  let currentUser = users.find(u => u.username === currentUserName);

  if (!currentUser) {
    console.warn("No current user found in localStorage.");
    currentUser = {};
  }

  // دوال مساعدة للحصول على العناصر
  const getEl = (selector) => document.querySelector(selector);

  const headerPic = getEl(".header-user-pic img") || getEl("#headerProfileImg");
  const sidebarPic = getEl(".profile-pic img") || getEl("#sidebarProfileImg");
  const sidebarName = getEl(".profile-pic h3") || getEl("#sidebarName");
  const sidebarTitle = getEl(".profile-pic p") || getEl("#sidebarTitle");

  // دالة لملء الحقول أو العناصر بالبيانات مع توحيد الـ IDs مع الـ HTML
  function fillProfileFields() {
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.value = val || "---";
          el.disabled = true; // منع التعديل
        } else {
          el.textContent = val || "---";
        }
      }
    };

    // توحيد الـ IDs حسب الـ HTML (لاحظ الـ "display" في البداية)
    setText("displayFullName", currentUser.fullName || currentUser.username || "---");
    setText("displayTitle", currentUser.title || "---");
    setText("displayAge", currentUser.age || "---");
    setText("displayAbout", currentUser.about || "---");
    setText("displayPhone", currentUser.phone || "---");
    setText("displayEmail", currentUser.email || "---");
    setText("displayCountry", currentUser.country || "---");
    setText("displayPostcode", currentUser.postcode || "---");
    setText("displayCity", currentUser.city || "---");
    setText("displayAddress", currentUser.address || "---");

    // تحديث الصور والاسم واللقب الجانبي والرأسي
    if (currentUser.image) {
      if (headerPic) headerPic.src = currentUser.image;
      if (sidebarPic) sidebarPic.src = currentUser.image;
    }

    if (sidebarName) sidebarName.textContent = currentUser.fullName || currentUser.username || "User Name";
    if (sidebarTitle) sidebarTitle.textContent = currentUser.title || "User Title";
  }

  // تعبئة البيانات عند تحميل الصفحة
  fillProfileFields();
});
