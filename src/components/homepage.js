import { DynamicPlaceholder } from './animation.js';

export class Home {
    static instance = null;  // Static property to hold the singleton instance

    constructor() {
        // If an instance already exists, return it
        if (Home.instance) {
            return Home.instance;
        }

        // Otherwise, set up the instance
        this.stockInput = document.getElementById('home-stock-input');
        this.searchButton = document.getElementById('home-search-btn');
        this.dynamicPlaceholder = new DynamicPlaceholder('home-stock-input');
        this.dynamicPlaceholder.init();
        this.initializeEventListeners();

        // Assign this instance to the static property
        Home.instance = this;
    }

    static getInstance() {
        // Return the existing instance, or create a new one if it doesn't exist
        if (!Home.instance) {
            Home.instance = new Home();
        }
        return Home.instance;
    }

    initializeEventListeners() {
        this.searchButton.addEventListener('click', () => {
            const stockSymbol = this.stockInput.value.trim().toUpperCase();
            if (stockSymbol) {
                this.stockInput.value = "";
                document.getElementById('home-section').style.display = 'none'; // Hide home
                document.getElementById('news-section').style.display = 'block'; // Show news
                document.getElementById('news-stock-input').value = stockSymbol;
                document.getElementById('news-search-btn').click();
            }
        });
    }
}