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
