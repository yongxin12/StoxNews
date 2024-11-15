// utils.js
export function isMobile() {
    return window.innerWidth <= 768;
}

export function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}