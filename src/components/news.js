import { StockDataFetcher } from './stockDataFetcher.js';
import { StockGraph } from './stockGraph.js';
import { isMobile, truncateText } from './utils.js';


export class News {
    constructor(stockSymbol, apiBaseUrl) {
        this.stockSymbol = stockSymbol;
        this.apiBaseUrl = apiBaseUrl;
        this.stockGraph = new StockGraph(document.getElementById('stockGraphElement'), document.getElementById('stock-name'));
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
        this.currentRangeIndex = 3;


        // Select the news-stock-graph element
        this.newsStockGraph = document.getElementById('news-stock-graph');
        this.newsStockGraphParent = this.newsStockGraph.parentNode;
        // Create the magnifier toggle button
        this.magnifierButton = document.createElement('button');
        this.magnifierButton.textContent = '📈';
        this.magnifierButton.classList.add('toggle-magnifier');

        // Insert the toggle button at the top of the body
        this.newsStockGraphParent.insertBefore(this.magnifierButton, this.newsStockGraph);

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

                this.stockGraph.generateGraph(this.stockData, 'all', [], stockSymbol = stockSymbol);

            } catch (error) {
                this.errorMessage.textContent = `An error occurred: ${error.message}`;
                this.newsList.innerHTML = '';
            }
        });

        this.dateRangeSlider.addEventListener('input', async (event) => {
            this.currentRangeIndex = parseInt(event.target.value) - 1;
            const range = this.dateRanges[this.currentRangeIndex];

            const filteredStockData = this.filterStockDataByRange(this.stockData, range);
            const filteredNewsData = this.filterNewsDataByRange(range);

            console.log(filteredNewsData);

            const newsDates = filteredNewsData.map(newsItem => newsItem.date);
            this.stockGraph.generateGraph(filteredStockData, range, newsDates, this.currentSymbol);
            if (this.currentButtonId === 'gaining-summary-btn' || this.currentButtonId === 'losing-summary-btn') {
                this.renderNewsAnalysisList(filteredNewsData);
            } else {
                this.renderNewsList(filteredNewsData);
            }

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
                } else if (this.currentButtonId === 'gaining-summary-btn' || this.currentButtonId === 'losing-summary-btn') {
                    this.currentNewsList = this.newsData[this.currentButtonId];
                    this.renderNewsAnalysisList(this.currentNewsList);
                } else {
                    this.currentNewsList = this.newsData[this.currentButtonId];
                    this.renderNewsList(this.newsData[this.currentButtonId]);
                }

                // update displayed news tag on the graph
                const range = this.dateRanges[this.currentRangeIndex];
                const filteredStockData = this.filterStockDataByRange(this.stockData, range);
                const filteredNewsData = this.filterNewsDataByRange(range);

                const newsDates = filteredNewsData.map(newsItem => newsItem.date);
                this.stockGraph.generateGraph(filteredStockData, range, newsDates, this.currentSymbol);

            }
        });

        this.newsList.addEventListener('click', (event) => {
            const newsItemElement = event.target.closest('.news-item');
            console.log("newsList item clicked");
            if (newsItemElement) {
                const index = newsItemElement.dataset.index;
                const activeCategoryButton = document.querySelector('.category-buttons button.active');
                const category = activeCategoryButton ? activeCategoryButton.id : null;
                const selectedNewsItem = this.currentNewsList[index];
                if (!isMobile()) {
                    if (this.currentButtonId === 'gaining-summary-btn') {
                        this.renderNewsAnalysisDetail(selectedNewsItem, 'gaining');
                    } else if (this.currentButtonId === 'losing-summary-btn') {
                        this.renderNewsAnalysisDetail(selectedNewsItem, 'losing');
                    } else if (category && this.currentNewsList[index]) {
                        this.renderNewsDetail(selectedNewsItem);
                    }
                } else {
                    let detailHTML = null;
                    console.log(this.currentNewsList);
                    if (category && this.currentNewsList[index]) {
                        if (this.currentNewsDetailElement) {
                            this.currentNewsDetailElement.remove();
                        }
                        if (this.currentNewsDetailIndex === index) {
                            this.currentNewsDetailIndex = null;
                            this.currentNewsDetailElement = null;
                        } else {
                            if (this.currentButtonId === 'gaining-summary-btn') {
                                detailHTML = this.renderNewsAnalysisDetail(selectedNewsItem, 'gaining');
                            } else if (this.currentButtonId === 'losing-summary-btn') {
                                detailHTML = this.renderNewsAnalysisDetail(selectedNewsItem, 'losing');
                            } else {
                                detailHTML = this.renderNewsDetail(selectedNewsItem);
                            }
                            newsItemElement.insertAdjacentHTML('afterend', detailHTML);
                            this.currentNewsDetailIndex = index;
                            this.currentNewsDetailElement = newsItemElement.nextElementSibling;
                        }
                    }

                }
                this.updateGraphForNews(this.currentSymbol, selectedNewsItem.date)
                console.log(selectedNewsItem.date);
            }

        });

        // Add click event to toggle the graph visibility
        this.magnifierButton.addEventListener('click', () => {
            this.newsStockGraph.classList.toggle('visible');
        });
    }

    filterStockDataByRange(stockData, range) {
        const now = new Date();
        const rangeDays = this.ranges[range] || Infinity;
        const startDate = new Date(now.setDate(now.getDate() - rangeDays));

        return stockData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate;
        });
    }

    filterNewsDataByRange(range) {
        const now = new Date();
        const rangeDays = this.ranges[range] || Infinity;
        const startDate = new Date(now.setDate(now.getDate() - rangeDays));

        if (!this.currentNewsList || !Array.isArray(this.currentNewsList)) {
            console.warn(`No news found for category: ${this.currentButtonId}`);
            return [];
        }

        return this.currentNewsList.filter(newsItem => {
            const newsDate = new Date(newsItem.date);
            // console.log(newsItem.date);
            // console.log(newsDate);
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
                    <time>${item.date}</time>
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
            <p>Published by: ${newsItem.publisher}</p>
            <p>Published on: ${newsItem.date}</p>
            <a href="${newsItem.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
            ${logoURL ? `<img src="${logoURL}" alt="${this.currentSymbol} logo" class="logo-image">` : ''}
        `;
        } else {
            return `
        <div id="news-detail-responsive">
            <h2>${newsItem.title}</h2>
            <p>Published by: ${newsItem.publisher}</p>
            <p>Published on: ${newsItem.date}</p>
            <a href="${newsItem.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
        </div>
    `;
        }
    }

    renderNewsAnalysisList(news) {
        if (!news) {
            this.errorMessage.textContent = 'No valid news data available.';
            this.newsList.innerHTML = '';
            return;
        } else {
            this.errorMessage.textContent = '';
            this.newsList.innerHTML = '';

            this.newsList.innerHTML = news.map((item, index) => {
                return `
            <div class="news-item" data-index="${index}">
                <div>
                    <span> • </span>
                    <time>${item.date}</time>
                    <span>Summary: ${item.summary}</span>
                    
                </div>
            </div>
            `;
            }).join('');
        }
    }

    renderNewsAnalysisDetail(analysisItem, type) {
        if (!isMobile()) {
            const reasonsHTML = analysisItem.news.map(newsItem => `
                <li>
                    <strong>News: ${newsItem.title}</strong>
                    <p>Reason: ${newsItem.correlated_reason}</p>
                    <a href="${newsItem.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
                </li>
            `).join('');

            this.newsDetail.innerHTML = `
            <h2> Correlated Reason for ${analysisItem.date} ${type} </h2>
            <ul class="correlated-reasons">${reasonsHTML}</ul>
        `;
        } else {
            const reasonsHTML = analysisItem.news.map(newsItem => `
                <li>
                    <strong>News: ${newsItem.title}</strong>
                    <p>Reason: ${newsItem.correlated_reason}</p>
                    <a href="${newsItem.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
                </li>
            `).join('');
            return `
        <div id="news-detail-responsive">
            <h2> Correlated Reason for ${analysisItem.date} ${type} </h2>
            <ul class="correlated-reasons">${reasonsHTML}</ul>
        </div>
    `;
        }
    }

    async updateGraphForNews(symbol, newsDate) {
        try {
            // Fetch stock data for the affected symbol
            const stockData = await this.stockDataFetcher.fetchStockData(symbol);
            if (!stockData) throw new Error(`No data found for symbol: ${symbol}`);

            // Update the graph and highlight the news date
            const now = new Date(newsDate)
            const startDate = new Date(now); // Clone the original date
            startDate.setDate(now.getDate() - 7);

            const endDate = new Date(now); // Clone the original date
            endDate.setDate(now.getDate() + 7);
            console.log("startDate:", startDate);
            console.log("endDate:", endDate);
            const filteredStockData = stockData.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= startDate && itemDate <= endDate;
            });

            this.stockGraph.generateGraph(filteredStockData, '1M', [newsDate], symbol);
        } catch (error) {
            console.error(`Error updating graph for symbol ${symbol}:`, error);
        }
    }

}


