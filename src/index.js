// src/index.js
import { setupNavigation } from './components/navigation.js';
import { News } from './components/news.js';
import { Dashboard } from './components/dashboard.js';
import { Home } from './components/homepage.js';

document.addEventListener('DOMContentLoaded', () => {



    const stockSymbol = 'TSLA';  // Default or dynamic stock symbol
    const apiBaseUrl = 'http://18.206.45.106:5001';  // API base URL
    const dashboard = new Dashboard(
        apiBaseUrl,
    );
    dashboard.initializeDashboard();

    const news = new News(stockSymbol, apiBaseUrl);

    const home = Home.getInstance(); 

    // news.initializeNews();

    setupNavigation();

    

});

// Adding functionality for mobile sidebar toggle
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '☰ Menu';
    toggleButton.classList.add('toggle-menu');

    // Insert the toggle button at the top of the body
    document.body.insertBefore(toggleButton, document.body.firstChild);

    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('visible');
    });
});

