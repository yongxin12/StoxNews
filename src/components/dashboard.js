import { StockGraph } from './stockGraph.js';
import { StockDataFetcher } from './stockDataFetcher.js';

export class Dashboard {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
        this.stockGraph = new StockGraph(document.getElementById('stockDashboardGraph'), document.getElementById('dashboard-stock-name'));
        this.stockDataFetcher = new StockDataFetcher(apiBaseUrl);
        this.rankingListElement = document.getElementById('ranking-list');
        this.topGainersButton = document.getElementById('top-gainers');
        this.topLosersButton = document.getElementById('top-losers');

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
                this.stockSymbol = affectedSymbol
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

        const groupedNewsData = newsData.reduce((acc, news) => {
            const key = `${news.affected_stock_value_percentage}-${news.affected_symbol}`;
            if (!acc[key]) {
                acc[key] = { ...news, aggregated: [] }; // Create a new group
            }
            acc[key].aggregated.push(news); // Add news to the group
            return acc;
        }, {});
    
       
        Object.values(groupedNewsData).forEach((group, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('ranking-item');
            listItem.setAttribute('data-rank', index + 1); // Rank number
            listItem.setAttribute('data-symbol', group.affected_symbol); // Symbol
            listItem.setAttribute('data-date', group.date); // Date
    
            const percentageClass = group.affected_stock_value_percentage > 0 ? 'gain' : 'loss';
    
            
            const aggregatedTitles = group.aggregated.map(item => `<li><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a></li>`).join('');
    
            listItem.innerHTML = `
                <div>
                    <h4>${group.affected_symbol}</h4>
                    <span class="${percentageClass}">${group.affected_stock_value_percentage}%</span>
                    <ul>${aggregatedTitles}</ul>
                    
                </div>
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

    async initializeDashboard() {
        // Fetch initial news (e.g., gainers as default)
        this.fetchAndDisplayNews('gaining');
    }
}