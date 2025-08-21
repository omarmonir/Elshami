document.addEventListener("DOMContentLoaded", () => {
  // توحيد مفاتيح التخزين
  const STORAGE_KEY = "users";
  const CURRENT_USER_KEY = "currentUser";

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
    console.error("No logged-in user found");
    window.location.href = "login.html"; // إعادة توجيه إذا لم يكن هناك مستخدم مسجل دخول
    return;
  }

  // البحث عن المستخدم الحالي مع التحقق من وجود الخصائص
  let currentUser = users.find(u => u.username === currentUserName) || {};
  
  // دالة مساعدة محسنة للحصول على العناصر
  const getEl = (selector, isRequired = false) => {
    const el = document.querySelector(selector);
    if (!el && isRequired) {
      console.error(`Element not found: ${selector}`);
    }
    return el;
  };

  // الحصول على العناصر مع التحقق من وجودها
  const headerPic = getEl(".header-user-pic img") || getEl("#headerProfileImg");
  const sidebarPic = getEl(".profile-pic img") || getEl("#sidebarProfileImg");
  const sidebarName = getEl(".profile-pic h3", true) || getEl("#sidebarName", true);
  const sidebarTitle = getEl(".profile-pic p") || getEl("#sidebarTitle");

  // دالة محسنة لملء البيانات مع التحقق
  function fillProfileFields() {
    if (!currentUser) {
      console.error("No user data available");
      return;
    }

    // قائمة بجميع حقول البروفايل
    const profileFields = [
      { id: "displayFullName", value: currentUser.fullName || currentUser.username },
      { id: "displayTitle", value: currentUser.title },
      { id: "displayAge", value: currentUser.age },
      { id: "displayAbout", value: currentUser.about },
      { id: "displayPhone", value: currentUser.phone },
      { id: "displayEmail", value: currentUser.email },
      { id: "displayCountry", value: currentUser.country },
      { id: "displayPostcode", value: currentUser.postcode },
      { id: "displayCity", value: currentUser.city },
      { id: "displayAddress", value: currentUser.address }
    ];

    // تعبئة جميع الحقول
    profileFields.forEach(field => {
      const element = document.getElementById(field.id);
      if (element) {
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.value = field.value || "---";
          element.disabled = true;
        } else {
          element.textContent = field.value || "---";
        }
      } else {
        console.warn(`Element with ID ${field.id} not found`);
      }
    });

    // تحديث الصور
    if (currentUser.image) {
      if (headerPic) headerPic.src = currentUser.image;
      if (sidebarPic) sidebarPic.src = currentUser.image;
    } else {
      // صورة افتراضية إذا لم توجد صورة
      const defaultImage = "../Images/userpro.png";
      if (headerPic) headerPic.src = defaultImage;
      if (sidebarPic) sidebarPic.src = defaultImage;
    }

    // تحديث الاسم واللقب
    if (sidebarName) {
      sidebarName.textContent = currentUser.fullName || currentUser.username || "User Name";
    }
    
    if (sidebarTitle) {
      sidebarTitle.textContent = currentUser.title || "User Title";
    }
  }

  // تعبئة البيانات عند تحميل الصفحة
  fillProfileFields();

  // إضافة وظيفة للتحقق من اكتمال البروفايل
  function isProfileComplete() {
    if (!currentUser) return false;
    
    const requiredFields = ['fullName', 'title', 'email'];
    return requiredFields.every(field => currentUser[field]);
  }

  // إضافة حدث للزر إذا كان موجوداً
  const viewProfileBtn = getEl("#viewProfileBtn");
  if (viewProfileBtn) {
    viewProfileBtn.addEventListener("click", () => {
      if (!isProfileComplete()) {
        alert("Please complete your profile first");
        return;
      }
      window.location.href = "profile.html";
    });
  }
});