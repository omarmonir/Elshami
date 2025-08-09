documewindow.onload = function() {}
  nt.addEventListener('DOMContentLoaded', function() {

    const sliderImages = document.querySelectorAll('.hero-slider .hero-img');
  const dots = document.querySelectorAll('.slider-dots .dot');
  let currentIndex = 0;
  const slideInterval = 3000; // 3 ثواني بين كل صورة
  
  function showSlide(index) {
      // إخفاء جميع الصور
      sliderImages.forEach(img => img.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
     sliderImages[index].classList.add('active');
      dots[index].classList.add('active');
      currentIndex = index;
  }
  
  // التلقائي للسلايدر
  let slideTimer = setInterval(() => {
      let nextIndex = (currentIndex + 1) % sliderImages.length;
      showSlide(nextIndex);
  }, slideInterval);
  
  dots.forEach(dot => {
      dot.addEventListener('click', function() {
          clearInterval(slideTimer);
          const index = parseInt(this.getAttribute('data-index'));
          showSlide(index);
          
          slideTimer = setInterval(() => {
              let nextIndex = (currentIndex + 1) % sliderImages.length;
              showSlide(nextIndex);
          }, slideInterval);
      });
  });
  
  showSlide(0);
});