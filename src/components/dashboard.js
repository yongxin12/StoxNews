import { StockGraph } from './stockGraph.js';
import { StockDataFetcher } from './stockDataFetcher.js';

export class Dashboard {
    constructor(stockSymbol, apiBaseUrl, stockGraphElement, rankingListElement, topGainersButton, topLosersButton) {
        this.stockSymbol = stockSymbol;
        this.apiBaseUrl = apiBaseUrl;
        this.stockGraph = new StockGraph(stockGraphElement);
        this.stockDataFetcher = new StockDataFetcher(apiBaseUrl);
        this.rankingListElement = rankingListElement;
        this.topGainersButton = topGainersButton;
        this.topLosersButton = topLosersButton;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.topGainersButton.addEventListener('click', () => this.fetchAndDisplayNews('gaining'));
        this.topLosersButton.addEventListener('click', () => this.fetchAndDisplayNews('losing'));
        // Add click listener for ranking items to update the graph
        this.rankingListElement.addEventListener('click', (event) => {
            const listItem = event.target.closest('.ranking-item');
            if (listItem) {
                const affectedSymbol = listItem.dataset.symbol; // Symbol to fetch data for
                const newsDate = listItem.dataset.date; // Date for timestamp
                this.updateGraphForNews(affectedSymbol, newsDate);
            }
        });
    
    }

    async fetchAndDisplayNews(type) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/breaking_news?type=${type}`);
            if (!response.ok) throw new Error(`Failed to fetch ${type} news`);
            const newsData = await response.json();

            this.displayNews(newsData);
        } catch (error) {
            console.error(`Error fetching ${type} news:`, error);
        }
    }

    displayNews(newsData) {
        this.rankingListElement.innerHTML = ''; // Clear previous items

        newsData.forEach((news, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('ranking-item');
            listItem.setAttribute('data-rank', index + 1);  // Rank number
            listItem.setAttribute('data-symbol', news.affected_symbol);  // Symbol for fetching stock data
            listItem.setAttribute('data-date', news.date);  // Date for timestamp

            // Determine the class for the percentage based on gain or loss
            const percentageClass = news.affected_stock_value_percentage > 0 ? 'gain' : 'loss';

            listItem.innerHTML = `
                <a href="#" onclick="return false;">
                    <h4>${news.title}</h4>
                    <p>${news.publisher} - ${news.date}</p>
                    <p>${news.summary}</p>
                    <a href="${news.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
                    <span class="${percentageClass}">${news.affected_stock_value_percentage}%</span>
                </a>
            `;

            this.rankingListElement.appendChild(listItem);
        });
    }

    async updateGraphForNews(symbol, newsDate) {
        try {
            // Fetch stock data for the affected symbol
            const stockData = await this.stockDataFetcher.fetchStockData(symbol);
            if (!stockData) throw new Error(`No data found for symbol: ${symbol}`);

            // Update the graph and highlight the news date
            this.stockGraph.generateGraph(stockData, '1M', [newsDate]);
        } catch (error) {
            console.error(`Error updating graph for symbol ${symbol}:`, error);
        }
    }

    async initializeDashboard() {
        // Fetch and display stock data (if relevant)
        const stockData = await this.stockDataFetcher.fetchStockData(this.stockSymbol);
        this.stockGraph.generateGraph(stockData, '1M');

        // Fetch initial news (e.g., gainers as default)
        this.fetchAndDisplayNews('gaining');
    }
}