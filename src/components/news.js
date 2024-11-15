import { StockDataFetcher } from './stockDataFetcher.js';
import { StockGraph } from './stockGraph.js';
import { isMobile, truncateText } from './utils.js';


export class News {
    constructor(stockSymbol, apiBaseUrl) {
        this.stockSymbol = stockSymbol;
        this.apiBaseUrl = apiBaseUrl;
        this.stockGraph = new StockGraph(document.getElementById('stockGraphElement'));
        this.stockDataFetcher = new StockDataFetcher(this.apiBaseUrl);
        this.stockData = [];
        this.newsData = null;
        

        this.dateRangeSlider = document.querySelector('#dateRangeSlider');
        this.dateRanges = ['7d', '1m', '3m', '6m'];

        this.stockSymbolElement = document.getElementById('stock-name');
        this.stockInput = document.getElementById('news-stock-input');
        this.fetchNewsButton = document.getElementById('news-search-btn');
    
        this.newsList = document.getElementById('news-list');
        this.newsDetail = document.getElementById('news-detail');
        this.errorMessage = document.getElementById('error-message');
        this.categoryButtonsContainer = document.querySelector('.category-buttons');
    
        this.currentNewsDetailIndex = null;  // Track which news detail is open
        this.currentNewsDetailElement = null; // Track the current detail element
    
        this.ranges = {
            '7d': 7,
            '1m': 30,
            '3m': 90,
            '6m': 180,
            'all': Infinity
        };
    
        this.currentButtonId = null;
        this.currentSymbol = null;
        this.currentNewsList = null;
    
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.fetchNewsButton.addEventListener('click', async () => {
            let stockSymbol = this.stockInput.value.trim().toUpperCase();
            if (!stockSymbol) stockSymbol = 'TSLA';
            if (!stockSymbol) return;
            this.currentSymbol = stockSymbol;
            try {
                this.errorMessage.textContent = '';
                this.newsList.innerHTML = '<p>Loading...</p>';
                this.newsDetail.innerHTML = '';
                this.stockData = await this.stockDataFetcher.fetchStockData(stockSymbol);
                if (this.stockData) {
                    this.stockSymbolElement.textContent = stockSymbol;
                    await this.stockDataFetcher.fetchNewsData(stockSymbol);
                    this.newsData = this.stockDataFetcher.getNewsData();
                }
    
                this.stockGraph.generateGraph(this.stockData, 'all', stockSymbol=stockSymbol);
    
            } catch (error) {
                this.errorMessage.textContent = `An error occurred: ${error.message}`;
                this.newsList.innerHTML = '';
            }
        });

        this.dateRangeSlider.addEventListener('input', async (event) => {
            const rangeIndex = parseInt(event.target.value) - 1;
            const range = this.dateRanges[rangeIndex];
    
            const filteredStockData = this.filterStockDataByRange(this.stockData, range);
            const filteredNewsData = this.filterNewsDataByRange(this.newsData, range);
    
            console.log(filteredNewsData);
    
            const newsDates = filteredNewsData.map(newsItem => newsItem.date);
            this.stockGraph.generateGraph(filteredStockData, range, newsDates);
            this.renderNewsList(filteredNewsData);
        });

        this.categoryButtonsContainer.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                this.currentButtonId = event.target.id;
                document.querySelectorAll('.category-buttons button').forEach(btn => {
                    btn.classList.remove('active');
                });
                event.target.classList.add('active');
    
                if (this.currentButtonId === 'competitive-positioning-btn') {
                    const competitiveNewsData = Object.entries(this.newsData[this.currentButtonId]).forEach(([symbol, news]) => {
                        this.currentNewsList = news;
                        this.renderNewsList(this.currentNewsList);
                    });
                } else if (this.currentButtonId === 'industry-trends-btn') {
                    this.currentNewsList = this.newsData[this.currentButtonId];
                    this.renderNewsList(this.currentNewsList);
                } else {
                    this.currentNewsList = this.newsData[this.currentButtonId];
                    this.renderNewsList(this.newsData[this.currentButtonId]);
                }
            }
        });

        this.newsList.addEventListener('click', (event) => {
            const newsItemElement = event.target.closest('.news-item');
            console.log("newsList item clicked");
            
            if (!isMobile()) {
                if (newsItemElement) {
                    
                    const index = newsItemElement.dataset.index;
                    const activeCategoryButton = document.querySelector('.category-buttons button.active');
                    const category = activeCategoryButton ? activeCategoryButton.id : null;
    
                    if (category && this.currentNewsList[index]) {
                        
                        const selectedNewsItem = this.currentNewsList[index];
                        this.renderNewsDetail(selectedNewsItem);
                    }
                }
            } else {
                if (newsItemElement) {
                    const index = newsItemElement.dataset.index;
                    const activeCategoryButton = document.querySelector('.category-buttons button.active');
                    const category = activeCategoryButton ? activeCategoryButton.id : null;
                    console.log(this.currentNewsList);
                    if (category && this.currentNewsList[index]) {
                        const selectedNewsItem = this.currentNewsList[index];
    
                        if (this.currentNewsDetailElement) {
                            this.currentNewsDetailElement.remove();
                        }
    
                        if (this.currentNewsDetailIndex === index) {
                            this.currentNewsDetailIndex = null;
                            this.currentNewsDetailElement = null;
                        } else {
                            const detailHTML = this.renderNewsDetail(selectedNewsItem);
                            newsItemElement.insertAdjacentHTML('afterend', detailHTML);
    
                            this.currentNewsDetailIndex = index;
                            this.currentNewsDetailElement = newsItemElement.nextElementSibling;
                        }
                    }
                }
            }
        });
    }

    // async fetchAndDisplayCategoryNews(category) {
    //     try {
    //         const response = await fetch(`${this.apiBaseUrl}/api/news?category=${category}&symbol=${this.stockSymbol}`);
    //         if (!response.ok) throw new Error(`Failed to fetch news for category ${category}`);
    //         this.newsData = await response.json();
    //         this.currentCategory = category;

    //         this.renderNewsList();
    //     } catch (error) {
    //         console.error(`Error fetching news for category ${category}:`, error);
    //     }
    // }

    filterStockDataByRange(stockData, range) {
        const now = new Date();
        const rangeDays = this.ranges[range] || Infinity;
        const startDate = new Date(now.setDate(now.getDate() - rangeDays));

        return stockData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate;
        });
    }

    filterNewsDataByRange(newsData, range) {
        const now = new Date();
        const rangeDays = this.ranges[range] || Infinity;
        const startDate = new Date(now.setDate(now.getDate() - rangeDays));

        if (!this.currentNewsList || !Array.isArray(this.currentNewsList)) {
            console.warn(`No news found for category: ${this.currentButtonId}`);
            return [];
        }

        return this.currentNewsList.filter(newsItem => {
            const newsDate = new Date(newsItem.date);
            console.log(newsItem.date);
            console.log(newsDate);
            return newsDate >= startDate;
        });
    }

    renderNewsList(news) {
        if (!news) {
            this.errorMessage.textContent = 'No valid news data available.';
            this.newsList.innerHTML = '';
            return;
        } else {
            this.errorMessage.textContent = '';
            this.newsList.innerHTML = '';

            this.newsList.innerHTML = news.map((item, index) => {
                const logoURL = this.getLogoURL(this.currentSymbol);
                return `
            <div class="news-item" data-index="${index}">
                <h3>${truncateText(item.title, 160)}</h3>
                <div>
                    <span>${item.publisher}</span>
                    <span> • </span>
                    <time>${new Date(item.time_published).toLocaleString()}</time>
                </div>
                <a href="${item.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
                ${logoURL ? `<img src="${logoURL}" alt="${this.currentSymbol} logo" class="logo-image">` : ''}
            </div>
            `;
            }).join('');
        }
    }

    getLogoURL(symbol) {
        const logoPath = `./src/assets/${symbol}.png`;

        const img = new Image();
        img.src = logoPath;

        return img.complete || img.height !== 0 ? logoPath : null;
    }

    renderNewsDetail(newsItem) {
        const logoURL = this.getLogoURL(this.currentSymbol);
        if (!isMobile()) {
            this.newsDetail.innerHTML = `
            <h2>${newsItem.title}</h2>
            <p>${newsItem.summary}</p>
            <p>Published by: ${newsItem.publisher}</p>
            <p>Published on: ${new Date(newsItem.time_published).toLocaleString()}</p>
            <a href="${newsItem.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
            ${logoURL ? `<img src="${logoURL}" alt="${this.currentSymbol} logo" class="logo-image">` : ''}
        `;
        } else {
            console.log("DETAIL")
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

    // async initializeNews() {
    //     const stockData = await this.stockDataFetcher.fetchStockData(this.stockSymbol);
    //     this.stockGraph.generateGraph(stockData, '1M');
    //     this.fetchAndDisplayCategoryNews('financial-performance');
    // }
}


