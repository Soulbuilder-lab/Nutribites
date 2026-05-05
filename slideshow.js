// Hero Slideshow functionality
let slideIndex = 1;
let slideInterval;

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.slideshow-container')) {
    showSlide(slideIndex);
    startAutoSlide();
  }
});

function changeSlide(n) {
  clearInterval(slideInterval);
  showSlide(slideIndex += n);
  startAutoSlide();
}

function currentSlide(n) {
  clearInterval(slideInterval);
  showSlide(slideIndex = n);
  startAutoSlide();
}

function showSlide(n) {
  const slides = document.getElementsByClassName('slide');
  const dots = document.getElementsByClassName('dot');
  
  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }
  
  // Hide all slides
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove('active');
  }
  
  // Remove active class from all dots
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove('active');
  }
  
  // Show current slide
  slides[slideIndex - 1].classList.add('active');
  dots[slideIndex - 1].classList.add('active');
}

function startAutoSlide() {
  slideInterval = setInterval(() => {
    slideIndex++;
    showSlide(slideIndex);
  }, 6000); // Change slide every 6 seconds
}

// Pause on hover for better UX
document.addEventListener('DOMContentLoaded', () => {
  const slideshowContainer = document.querySelector('.slideshow-container');
  if (slideshowContainer) {
    slideshowContainer.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    slideshowContainer.addEventListener('mouseleave', () => {
      startAutoSlide();
    });
  }
});