// Function to open the navigation bar
function openNav() {
    document.getElementById("navbar").style.width = "250px";
}

// Function to close the navigation bar
function closeNav() {
    document.getElementById("navbar").style.width = "0";
}

// Dynamic typing effect for placeholder
const placeholderTexts = [
    "Search for stock trends...",
    "Looking for the latest news?...",
    "Find stock updates here..."
];
let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

let isTypingStopped = false;

function typePlaceholder() {
    if (isTypingStopped) return; // Stop the animation when user is typing

    const searchInput = document.getElementById("search");
    const currentText = placeholderTexts[currentTextIndex];
    
    if (isDeleting) {
        searchInput.placeholder = currentText.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        if (currentCharIndex === 0) {
            isDeleting = false;
            currentTextIndex = (currentTextIndex + 1) % placeholderTexts.length;
        }
    } else {
        searchInput.placeholder = currentText.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        if (currentCharIndex === currentText.length) {
            isDeleting = true;
        }
    }
    
    setTimeout(typePlaceholder, isDeleting ? 40 : 150);
}

// Function to clear the placeholder text
function clearPlaceholder() {
    const searchInput = document.getElementById("search");
    searchInput.placeholder = ""; // Set placeholder to blank
    isTypingStopped = true; // Stop typing animation
}

// Function to resume typing animation
function resumeTypingAnimation() {
    const searchInput = document.getElementById("search");
    if (searchInput.value === "") {
        isTypingStopped = false;
        typePlaceholder();
    }
}

// Start typing effect after the page loads
window.onload = function() {
    setTimeout(typePlaceholder, 1000);
    const navbar = document.getElementById("navbar");
    navbar.classList.add("active");

    const searchInput = document.getElementById("search");

    // Clear placeholder when user focuses (starts typing)
    searchInput.addEventListener("focus", clearPlaceholder);

        // Resume placeholder animation when input loses focus (only if there's no input)
    searchInput.addEventListener("blur", resumeTypingAnimation);
    
};
