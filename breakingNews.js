// breakingNews.js
import { initializeChart } from './stockChart.js'; // Import any existing stock chart modules

document.addEventListener('DOMContentLoaded', () => {
    // Carousel functionality
    let currentSlide = 0;
    const carouselSlide = document.querySelector('.carousel-slide');
    const totalSlides = document.querySelectorAll('.carousel-item').length;

    function showNextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        carouselSlide.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    setInterval(showNextSlide, 3000);

    // Stock trend graph initialization
    const ctx = document.getElementById('stockTrendChart').getContext('2d');
    initializeChart(ctx); // Assumes you have an existing chart setup

    // Change animation button
    const animations = ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'];
    let currentAnimationIndex = 0;
    document.getElementById('change-animation-btn').addEventListener('click', () => {
        currentAnimationIndex = (currentAnimationIndex + 1) % animations.length;
        carouselSlide.style.transitionTimingFunction = animations[currentAnimationIndex];
        alert(`Animation set to: ${animations[currentAnimationIndex]}`);
    });
});
