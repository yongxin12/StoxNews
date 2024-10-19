// src/components/animation.js

export class DynamicPlaceholder {
    constructor(searchInputId, typingDelay = 150, deletingDelay = 40) {
        this.searchInput = document.getElementById(searchInputId);
        this.placeholderTexts = [
            "Search for stock trends...",
            "Looking for the latest news?...",
            "Find stock updates here...",
            "Enter stock symbols..."
        
        ];
        this.typingDelay = typingDelay;
        this.deletingDelay = deletingDelay;

        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isTypingStopped = false;
    }

    // Typing effect function
    typePlaceholder() {
        if (this.isTypingStopped) return;

        const currentText = this.placeholderTexts[this.currentTextIndex];

        if (this.isDeleting) {
            this.searchInput.placeholder = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;

            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.placeholderTexts.length;
            }
        } else {
            this.searchInput.placeholder = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;

            if (this.currentCharIndex === currentText.length) {
                this.isDeleting = true;
            }
        }

        setTimeout(() => this.typePlaceholder(), this.isDeleting ? this.deletingDelay : this.typingDelay);
    }

    // Clear placeholder when user focuses
    clearPlaceholder() {
        this.searchInput.placeholder = "";
        this.isTypingStopped = true;
    }

    // Resume typing animation when user loses focus
    resumeTypingAnimation() {
        if (this.searchInput.value === "") {
            this.isTypingStopped = false;
            this.typePlaceholder();
        }
    }

    // Initialize event listeners and start animation
    init() {
        this.searchInput.addEventListener("focus", () => this.clearPlaceholder());
        this.searchInput.addEventListener("blur", () => this.resumeTypingAnimation());

        setTimeout(() => this.typePlaceholder(), 1000);
    }
}

// Usage Example:
window.onload = function() {
    const placeholderTexts = [
        "Search for stock trends...",
        "Looking for the latest news?...",
        "Find stock updates here...",
        "Enter stock symbols..."
    ];

    const dynamicPlaceholder = new DynamicPlaceholder("search", placeholderTexts);
    dynamicPlaceholder.init();
};
