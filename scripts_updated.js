import { fetchNewsApi, fetchStockDataApi } from './mockApi.js';

document.addEventListener('DOMContentLoaded', () => {
    const stockNameElement = document.getElementById('stock-name');
    const stockInput = document.getElementById('stock-input');
    const fetchNewsButton = document.getElementById('fetch-news');

    
    const newsList = document.getElementById('news-list');
    const newsDetail = document.getElementById('news-detail');
    const errorMessage = document.getElementById('error-message');
    const categoryButtonsContainer = document.querySelector('.category-buttons');
    const stockGraphElement = document.querySelector('.stock-graph');  // Element for the stock graph
    const dateRangeSelector = document.querySelector('.date-range-selector');


    let stockData = [];  // To store all stock data for date range filtering
    let chart = null;    // To store the Chart.js instance
    let currentNews = {
        'financial-performance-btn': [],
        'competitive-positioning-btn': [],
        'industry-trends-btn': [],
        'regulatory-impact-btn': []
    };
    let currentNewsDetailIndex = null;  // Track which news detail is open
    let currentNewsDetailElement = null; // Track the current detail element


    async function fetchStockData(stockName) {
        try {
            const response = await fetch(`http://localhost:5001/api/stock?symbol=${stockName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch stock data');
            }
            const data = await response.json();
            stockData = data.stock_info;  // Save the stock data
            stockData = data.stock_info.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);  // Sort in ascending order (oldest to most recent)
            });

            renderStockGraph(stockData);  // Pass the stock info array to render the graph
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
    }

    // Function to render the stock graph using Chart.js
    function renderStockGraph(filteredData, range) {
        const ctx = document.createElement('canvas');  // Create a canvas for the chart
        stockGraphElement.innerHTML = '';  // Clear any existing content in the stock graph div
        stockGraphElement.appendChild(ctx);  // Append the canvas to the stock graph div

        const dates = filteredData.map(item => item.date);  // Extract the dates
        const prices = filteredData.map(item => item.close);  // Extract the closing prices

        if (chart) {
            chart.destroy();  // Destroy the previous chart instance before creating a new one
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Closing Price',
                    data: prices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(255, 192, 192, 0.2)',
                    pointRadius: 1,  // Smaller data points
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,  // Allow the graph to fit the container
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        },
                        type: 'time',
                        time: {
                            // Luxon format string
                            unit: 'day'
                        },
                        border: {
                            color: 'red'
                        },
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Price (USD)'
                        }
                    }
                }
            }
        });

    }

    //Helper function to filter stock data by date range
    function filterStockData(range) {
        const now = new Date();  // Current date and time
        let filteredData;

        switch (range) {
            case '7d':
                filteredData = stockData.slice(-7);  // Last 7 days
                break;
            case '1m':
                filteredData = stockData.slice(-30);  // Last 30 days
                break;
            case '3m':
                filteredData = stockData.slice(-90);  // Last 90 days
                break;
            // Other cases...
            default:
                filteredData = stockData;
        }

        console.log("Filtered Stock Data for range", range, filteredData);  // Log filtered data to ensure it's current

        renderStockGraph(filteredData, range);  // Render the graph with filtered data
    }


    // Event listener for the date range selector
    dateRangeSelector.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const range = event.target.getAttribute('data-range');
            filterStockData(range);
        }
    });



    categoryButtonsContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const buttonId = event.target.id;
            document.querySelectorAll('.category-buttons button').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            if (currentNews[buttonId].length === 0) {
                fetchNews('TSLA', buttonId);
            } else {
                renderNewsList(currentNews[buttonId]);
            }
        }
    });

    async function fetchNews(stockName, category) {
        try {
            errorMessage.textContent = '';
            newsList.innerHTML = '<p>Loading...</p>';
            newsDetail.innerHTML = '';

            const response = await fetch(`http://localhost:5001/api/news?symbol=${stockName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch news');
            }

            const data = await response.json();
            //console.log(data); // Check the response structure here

            // Ensure we're only passing the news array to renderNewsList
            if (data.news && Array.isArray(data.news)) {
                currentNews[category] = data.news;  // Store the news in the correct category
                renderNewsList(data.news);          // Pass the news array to renderNewsList
                if (data.news.length > 0) {
                    renderNewsDetail(data.news[0]);
                }
            } else {
                throw new Error('News data is not an array or is missing');
            }
        } catch (error) {
            errorMessage.textContent = `An error occurred: ${error.message}`;
            newsList.innerHTML = '';
        }
    }


    fetchNewsButton.addEventListener('click', () => {
        const stockName = stockInput.value.trim().toUpperCase();
        if (stockName) {
            stockNameElement.textContent = stockName;
            fetchNews(stockName);
            fetchStockData(stockName);  // Fetch stock data and render the graph
        }
    });


    function renderNewsList(news) {
        // Validate that 'news' is an array
        if (!Array.isArray(news)) {
            errorMessage.textContent = 'No valid news data available.';
            return;
        }

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
    }

    function renderNewsDetail(newsItem) {
        if (!isMobile()){        
            newsDetail.innerHTML = `
            <h2>${newsItem.title}</h2>
            <p>${newsItem.summary}</p>
            <p>Published by: ${newsItem.publisher}</p>
            <p>Published on: ${new Date(newsItem.time_published).toLocaleString()}</p>
            <a href="${newsItem.Url}" target="_blank" rel="noopener noreferrer">Read full article</a>
        `;
    } else {return `
        <div class="news-detail">
            <h2>${newsItem.title}</h2>
            <p>${newsItem.summary}</p>
            <p>Published by: ${newsItem.publisher}</p>
            <p>Published on: ${new Date(newsItem.time_published).toLocaleString()}</p>
            <a href="${newsItem.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
        </div>
    `;}
        
    }

    newsList.addEventListener('click', (event) => {
        // Only apply this behavior if it's mobile mode
        const newsItemElement = event.target.closest('.news-item'); // Find the clicked news item
        if (!isMobile()) {
            if (newsItemElement) {
                const index = newsItemElement.dataset.index; // Retrieve the index from the data-index attribute
                const activeCategoryButton = document.querySelector('.category-buttons button.active');
                const category = activeCategoryButton ? activeCategoryButton.id : null;

                if (category && currentNews[category][index]) {
                    const selectedNewsItem = currentNews[category][index];
                    renderNewsDetail(selectedNewsItem); // Render the details of the clicked news item
                }
            }
        }else{
            if (newsItemElement) {
                const index = newsItemElement.dataset.index;
                const activeCategoryButton = document.querySelector('.category-buttons button.active');
                const category = activeCategoryButton ? activeCategoryButton.id : null;
    
                if (category && currentNews[category][index]) {
                    const selectedNewsItem = currentNews[category][index];
    
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


    // Initial fetch
    fetchNews('TSLA');
    fetchStockData('TSLA')
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
