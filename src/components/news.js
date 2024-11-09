import { StockDataFetcher } from './stockDataFetcher.js';
import { StockGraph } from './stockGraph.js';
import { isMobile, truncateText } from './utils.js';


export class News {
    constructor(stockSymbol, apiBaseUrl) {
        this.stockSymbol = stockSymbol;
        this.apiBaseUrl = apiBaseUrl;
        this.stockGraph = new StockGraph(document.getElementById('stockGraphElement'));
        this.stockDataFetcher = new StockDataFetcher(apiBaseUrl);
        this.newsListElement = document.getElementById('news-list');;
        this.categoryButtonsContainer = document.querySelector('.category-buttons');;
        this.stockNameElement = document.getElementById('stock-name');;

        this.newsData = null;
        this.currentCategory = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.categoryButtonsContainer.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                const category = event.target.id;
                this.fetchAndDisplayCategoryNews(category);
            }
        });

        this.newsListElement.addEventListener('click', (event) => {
            const newsItemElement = event.target.closest('.news-item');
            if (newsItemElement) {
                const newsIndex = newsItemElement.dataset.index;
                this.displayNewsDetail(newsIndex);
            }
        });
    }

    async fetchAndDisplayCategoryNews(category) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/news?category=${category}&symbol=${this.stockSymbol}`);
            if (!response.ok) throw new Error(`Failed to fetch news for category ${category}`);
            this.newsData = await response.json();
            this.currentCategory = category;

            this.renderNewsList();
        } catch (error) {
            console.error(`Error fetching news for category ${category}:`, error);
        }
    }

    renderNewsList() {
        this.newsListElement.innerHTML = '';
        if (this.newsData && this.newsData.length > 0) {
            this.newsData.forEach((item, index) => {
                const listItem = document.createElement('div');
                listItem.classList.add('news-item');
                listItem.setAttribute('data-index', index);
                
                listItem.innerHTML = `
                    <h3>${truncateText(item.title, 160)}</h3>
                    <div>
                        <span>${item.publisher}</span>
                        <span> • </span>
                        <time>${new Date(item.time_published).toLocaleString()}</time>
                    </div>
                    <a href="${item.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
                `;
                
                this.newsListElement.appendChild(listItem);
            });
        } else {
            this.newsListElement.innerHTML = '<p>No news available for this category.</p>';
        }
    }

    displayNewsDetail(index) {
        const newsItem = this.newsData[index];
        if (newsItem) {
            const newsDetailElement = document.getElementById('news-detail');
            newsDetailElement.innerHTML = `
                <h2>${newsItem.title}</h2>
                <p>${newsItem.summary}</p>
                <p>Published by: ${newsItem.publisher}</p>
                <p>Published on: ${new Date(newsItem.time_published).toLocaleString()}</p>
                <a href="${newsItem.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
            `;
        }
    }

    async initializeNews() {
        const stockData = await this.stockDataFetcher.fetchStockData(this.stockSymbol);
        this.stockGraph.generateGraph(stockData, '1M');
        this.fetchAndDisplayCategoryNews('financial-performance'); // Default category
    }
}

export function setupNews() {
    const title = document.getElementById('title');
    const dateRangeSlider = document.querySelector('#dateRangeSlider');
    const dateRanges = ['7d', '1m', '3m', '6m'];
    const stockGraphElement = document.getElementById('stockGraphElement');

    const stockSymbolElement = document.getElementById('stock-name');
    const stockInput = document.getElementById('stock-input');
    const fetchNewsButton = document.getElementById('search-btn');

    const newsList = document.getElementById('news-list');
    const newsDetail = document.getElementById('news-detail');
    const errorMessage = document.getElementById('error-message');
    const categoryButtonsContainer = document.querySelector('.category-buttons');

    const stockGraph = new StockGraph(stockGraphElement);
    //18.206.45.106
    const stockDataFetcher = new StockDataFetcher('http://localhost:5001');
    const dynamicPlaceholder = new DynamicPlaceholder('stock-input');

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
    let currentSymbol;
    let currentNewsList;

    const mainContent = document.getElementById('news-section');

    // Get all the elements you want to reveal after clicking Fetch News
    // const elementsToShow = mainContent.querySelectorAll(':not(.title):not(.stock-input)');



    fetchNewsButton.addEventListener('click', async () => {
        let stockSymbol = stockInput.value.trim().toUpperCase();
        if (!stockSymbol) stockSymbol = 'TSLA';
        if (!stockSymbol) return;
        currentSymbol = stockSymbol;
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

            // Show hidden elements with animation
            elementsToShow.forEach(element => {
                element.classList.add('show-element');
            });
            if (!isMobile()) {
                if (title.classList.contains('centered-title')) {
                    title.classList.remove('centered-title');
                }
            }




        } catch (error) {
            errorMessage.textContent = `An error occurred: ${error.message}`;
            newsList.innerHTML = '';
        }
    });


    dateRangeSlider.addEventListener('input', async (event) => {
        const rangeIndex = parseInt(event.target.value) - 1;  // Get the slider value (1-4) and adjust for 0-based index
        const range = dateRanges[rangeIndex];  // Map slider value to the date range

        const filteredStockData = filterStockDataByRange(stockData, range);
        const filteredNewsData = filterNewsDataByRange(newsData, range);

        console.log(filteredNewsData);

        const newsDates = filteredNewsData.map(newsItem => newsItem.date);  // Extract news dates
        stockGraph.generateGraph(filteredStockData, range, newsDates);  // Pass news dates to graph
        renderNewsList(filteredNewsData);
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
        if (!currentNewsList || !Array.isArray(currentNewsList)) {
            console.warn(`No news found for category: ${currentButtonId}`);
            return [];
        }

        // Filter the news for the current category by date range
        return currentNewsList.filter(newsItem => {

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

            if (currentButtonId === 'competitive-positioning-btn') {
                const competitiveNewsData = Object.entries(newsData[currentButtonId]).forEach(([symbol, news]) => {
                    //currentSymbol = symbol;
                    currentNewsList = news;
                    renderNewsList(currentNewsList);
                })
            } else if (currentButtonId === 'industry-trends-btn') {
                currentNewsList = newsData[currentButtonId];
                renderNewsList(currentNewsList);

            } else {
                currentNewsList = newsData[currentButtonId];
                renderNewsList(newsData[currentButtonId]);
            }


        }
    });

    function renderNewsList(news) {
        // Validate that 'news' is an array

        if (!news) {
            errorMessage.textContent = 'No valid news data available.';
            newsList.innerHTML = '';
            return;
        } else {
            errorMessage.textContent = '';
            // Clear the current news list (destroy existing news)
            newsList.innerHTML = '';

            newsList.innerHTML = news.map((item, index) => {
                const logoURL = getLogoURL(currentSymbol);
                return `
            <div class="news-item" data-index="${index}">
                <h3>${truncateText(item.title, 160)}</h3>
                <div>
                    <span>${item.publisher}</span>
                    <span> • </span>
                    <time>${new Date(item.time_published).toLocaleString()}</time>
                </div>
                <a href="${item.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
                ${logoURL ? `<img src="${logoURL}" alt="${currentSymbol} logo" class="logo-image">` : ''}
            </div>
            `;
            }).join('');
        }

    }


    // Helper function to get the logo URL based on currentSymbol
    function getLogoURL(symbol) {
        // Assuming logos are stored in 'assets/logos/' with the symbol name as the filename
        const logoPath = `./src/assets/${symbol}.png`;

        // Create an image element to check if the image exists
        const img = new Image();
        img.src = logoPath;

        // Return the logo path if the image exists, otherwise null
        return img.complete || img.height !== 0 ? logoPath : null;
    }


    function renderNewsDetail(newsItem) {
        const logoURL = getLogoURL(currentSymbol);
        if (!isMobile()) {
            newsDetail.innerHTML = `
            <h2>${newsItem.title}</h2>
            <p>${newsItem.summary}</p>
            <p>Published by: ${newsItem.publisher}</p>
            <p>Published on: ${new Date(newsItem.time_published).toLocaleString()}</p>
            <a href="${newsItem.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
            ${logoURL ? `<img src="${logoURL}" alt="${currentSymbol} logo" class="logo-image">` : ''}
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

                if (category && currentNewsList[index]) {
                    const selectedNewsItem = currentNewsList[index];
                    // console.log(selectedNewsItem);
                    renderNewsDetail(selectedNewsItem); // Render the details of the clicked news item
                }
            }
        } else {
            if (newsItemElement) {
                const index = newsItemElement.dataset.index;
                const activeCategoryButton = document.querySelector('.category-buttons button.active');
                const category = activeCategoryButton ? activeCategoryButton.id : null;

                if (category && currentNewsList[index]) {
                    const selectedNewsItem = currentNewsList[index];

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

}

