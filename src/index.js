// src/index.js

import { StockDataFetcher } from './components/stockDataFetcher.js';
import { StockGraph } from './components/stockGraph.js';


document.addEventListener('DOMContentLoaded', () => {

    // const stockGraphElement = document.querySelector('.stock-graph');
    const dateRangeSelector = document.querySelector('.date-range-selector');
    const stockGraphElement = document.getElementById('stockGraphElement');

    const stockSymbolElement = document.getElementById('stock-name');
    const stockInput = document.getElementById('stock-input');
    const fetchNewsButton = document.getElementById('fetch-news');

    const newsList = document.getElementById('news-list');
    const newsDetail = document.getElementById('news-detail');
    const errorMessage = document.getElementById('error-message');
    const categoryButtonsContainer = document.querySelector('.category-buttons');


    const stockGraph = new StockGraph(stockGraphElement);
    const stockDataFetcher = new StockDataFetcher('http://localhost:5001');

    let stockData = [];
    let newsData;

    let currentNewsDetailIndex = null;  // Track which news detail is open
    let currentNewsDetailElement = null; // Track the current detail element

    const ranges = {
        '7d': 7,
        '1m': 30,
        '3m': 90,
        '6m': 180,
        'all': Infinity
    };

    let currentButtonId;


    fetchNewsButton.addEventListener('click', async () => {
        let stockSymbol = stockInput.value.trim().toUpperCase();
        if (!stockSymbol) stockSymbol = 'TSLA';
        if (!stockSymbol) return;

        try {

            errorMessage.textContent = '';
            newsList.innerHTML = '<p>Loading...</p>';
            newsDetail.innerHTML = '';
            stockData = await stockDataFetcher.fetchStockData(stockSymbol);
            if (stockData) {
                stockSymbolElement.textContent = stockSymbol;
                await stockDataFetcher.fetchNewsData(stockSymbol);
                newsData = stockDataFetcher.getNewsData();
            }

            //stockGraph.render(stockData, 'all');  // Render all by default
            stockGraph.generateGraph(stockData, 'all');

        } catch (error) {
            errorMessage.textContent = `An error occurred: ${error.message}`;
            newsList.innerHTML = '';
        }
    });

    // Handle date range filtering
    dateRangeSelector.addEventListener('click', async (event) => {
        if (event.target.tagName === 'BUTTON') {
            const range = event.target.getAttribute('data-range');
            const filteredStockData = filterStockDataByRange(stockData, range);
            const filteredNewsData = filterNewsDataByRange(newsData, range);
            console.log(filteredNewsData);
            // stockGraph.generateGraph(filteredStockData, range);

            const newsDates = filteredNewsData.map(newsItem => newsItem.date); // Extract news dates
            stockGraph.generateGraph(filteredStockData, range, newsDates); // Pass news dates to graph
            renderNewsList(filteredNewsData);

        }
    });

    function filterStockDataByRange(stockData, range) {
        const now = new Date();

        const rangeDays = ranges[range] || Infinity;
        const startDate = new Date(now.setDate(now.getDate() - rangeDays));

        return stockData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate;
        });
    }

    // Function to filter news data based on selected date range
    function filterNewsDataByRange(newsData, range) {
        const now = new Date();

        const rangeDays = ranges[range] || Infinity;
        const startDate = new Date(now.setDate(now.getDate() - rangeDays));

        // Ensure the currentButtonId category exists in newsData
        if (!newsData[currentButtonId] || !Array.isArray(newsData[currentButtonId])) {
            console.warn(`No news found for category: ${currentButtonId}`);
            return [];
        }

        // Filter the news for the current category by date range
        return newsData[currentButtonId].filter(newsItem => {

            const newsDate = new Date(newsItem.date);
            console.log(newsItem.date);
            console.log(newsDate);
            return newsDate >= startDate;
        });
    }

    categoryButtonsContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            currentButtonId = event.target.id;
            document.querySelectorAll('.category-buttons button').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            renderNewsList(newsData[currentButtonId]);

        }
    });

    function renderNewsList(news) {
        // Validate that 'news' is an array
        if (!Array.isArray(news)) {
            errorMessage.textContent = 'No valid news data available.';
            newsList.innerHTML = '';
            return;
        } else {
            errorMessage.textContent = '';
            // Clear the current news list (destroy existing news)
            newsList.innerHTML = '';

            newsList.innerHTML = news.map((item, index) => `
            <div class="news-item" data-index="${index}">
                <h3>${item.title}</h3>
                <div>
                    <span>${item.publisher}</span>
                    <span> • </span>
                    <time>${new Date(item.time_published).toLocaleString()}</time>
                </div>
                <a href="${item.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
            </div>
        `).join('');
        };

    }



    function renderNewsDetail(newsItem) {
        if (!isMobile()) {
            newsDetail.innerHTML = `
            <h2>${newsItem.title}</h2>
            <p>${newsItem.summary}</p>
            <p>Published by: ${newsItem.publisher}</p>
            <p>Published on: ${new Date(newsItem.time_published).toLocaleString()}</p>
            <a href="${newsItem.Url}" target="_blank" rel="noopener noreferrer">Read full article</a>
        `;
        } else {
            return `
        <div class="news-detail">
            <h2>${newsItem.title}</h2>
            <p>${newsItem.summary}</p>
            <p>Published by: ${newsItem.publisher}</p>
            <p>Published on: ${new Date(newsItem.time_published).toLocaleString()}</p>
            <a href="${newsItem.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
        </div>
    `;
        }
    }

    newsList.addEventListener('click', (event) => {
        // Only apply this behavior if it's mobile mode
        const newsItemElement = event.target.closest('.news-item'); // Find the clicked news item
        if (!isMobile()) {
            if (newsItemElement) {
                const index = newsItemElement.dataset.index; // Retrieve the index from the data-index attribute
                const activeCategoryButton = document.querySelector('.category-buttons button.active');
                const category = activeCategoryButton ? activeCategoryButton.id : null;

                if (category && newsData[category][index]) {
                    const selectedNewsItem = newsData[category][index];
                    // console.log(selectedNewsItem);
                    renderNewsDetail(selectedNewsItem); // Render the details of the clicked news item
                }
            }
        } else {
            if (newsItemElement) {
                const index = newsItemElement.dataset.index;
                const activeCategoryButton = document.querySelector('.category-buttons button.active');
                const category = activeCategoryButton ? activeCategoryButton.id : null;

                if (category && newsData[category][index]) {
                    const selectedNewsItem = newsData[category][index];

                    // Remove any existing news details
                    if (currentNewsDetailElement) {
                        currentNewsDetailElement.remove();
                    }

                    // If the same news item is clicked again, toggle (hide the details)
                    if (currentNewsDetailIndex === index) {
                        currentNewsDetailIndex = null;
                        currentNewsDetailElement = null;
                    } else {
                        // Insert the new news detail after the clicked news item
                        const detailHTML = renderNewsDetail(selectedNewsItem);
                        newsItemElement.insertAdjacentHTML('afterend', detailHTML);

                        // Update tracking variables
                        currentNewsDetailIndex = index;
                        currentNewsDetailElement = newsItemElement.nextElementSibling; // Reference to the newly inserted detail
                    }
                }
            }
        }
    });

    window.addEventListener('resize', () => {
        if (!isMobile() && currentNewsDetailElement) {
            // If the user resizes out of mobile view, remove the news details if visible
            currentNewsDetailElement.remove();
            currentNewsDetailIndex = null;
            currentNewsDetailElement = null;
        }
    });


    // Helper function to check if the screen is in mobile mode
    function isMobile() {
        return window.innerWidth <= 768;
    }

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

