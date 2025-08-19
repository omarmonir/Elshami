// جلب البيانات من localStorage أو وضع البيانات الافتراضية
let reviews = JSON.parse(localStorage.getItem("reviews")) || [
  { name: "Robert M. Dixon", job: "", image: "./Images/image_guests_1.png", text: "Also very good and so was the service. I had the mushroom risotto with scallops which was awesome. My wife had a burger over greens...", stars: "★★★★★" },
  { name: "Bernadette R. Martin", job: "", image: "./Images/image_guests_1.png", text: "Amazing service, great ambiance. Highly recommended!", stars: "★★★★★" },
  { name: "John Doe", job: "", image: "./Images/image_guests_1.png", text: "Excellent food and the staff were wonderful.", stars: "★★★★" },
  { name: "Jane Smith", job: "", image: "./Images/image_guests_1.png", text: "Everything was perfect from start to finish.", stars: "★★★★★" },
  { name: "Mark Johnson", job: "", image: "./Images/image_guests_1.png", text: "Delicious and fresh! Will come again.", stars: "★★★★" },
  { name: "Emily Davis", job: "", image: "./Images/image_guests_1.png", text: "One of the best dining experiences I’ve had.", stars: "★★★★★" }
];

// حفظ البيانات في localStorage أول مرة
if (!localStorage.getItem("reviews")) {
  localStorage.setItem("reviews", JSON.stringify(reviews));
}

let currentPage = 0;
const itemsPerPage = 3;

function renderSlider() {
  const slider = document.getElementById("slider");
  slider.innerHTML = "";

  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = reviews.slice(start, end);

  pageItems.forEach(review => {
    const card = document.createElement("div");
    card.classList.add("review-card");
    card.innerHTML = `
      <div class="profile-pic">
        <img src="${review.image}" alt="${review.name}">
      </div>
      <h4>${review.name}</h4>
      <p>${review.text}</p>
      <div class="stars">${review.stars}</div>
    `;
    slider.appendChild(card);
  });

  renderDots();
}

function renderDots() {
  const dotsContainer = document.getElementById("dots");
  dotsContainer.innerHTML = "";

  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === currentPage) dot.classList.add("active");

    dot.addEventListener("click", () => {
      currentPage = i;
      renderSlider();
    });

    dotsContainer.appendChild(dot);
  }
}

// تشغيل عند الفتح
renderSlider();
window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
        // استرجاع الطلب المؤقت اللي اتحفظ قبل التحويل لسترايب
        const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));
        if (pendingOrder) {
            const orders = JSON.parse(localStorage.getItem("orders")) || [];
            orders.push(pendingOrder);
            localStorage.setItem("orders", JSON.stringify(orders));
            localStorage.removeItem("pendingOrder");
        }

        localStorage.removeItem('cart');
        showPaymentSuccessNotification();
        window.history.replaceState({}, document.title, window.location.pathname);

    } else if (paymentStatus === 'cancelled') {
        showPaymentCancelledNotification();
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

function showPaymentSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'alert alert-success alert-dismissible fade show position-fixed';
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 350px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-check-circle text-success me-3" style="font-size: 1.5rem;"></i>
            <div>
                <strong>Payment Successful! 🎉</strong><br>
                <small>Thank you for your order. Your payment has been processed successfully.</small>
            </div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 7000);
}

function showPaymentCancelledNotification() {
    const notification = document.createElement('div');
    notification.className = 'alert alert-warning alert-dismissible fade show position-fixed';
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 350px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-exclamation-circle text-warning me-3" style="font-size: 1.5rem;"></i>
            <div>
                <strong>Payment Cancelled</strong><br>
                <small>Your order is still in the cart. You can complete it anytime.</small>
            </div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}
