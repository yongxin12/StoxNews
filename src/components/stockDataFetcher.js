// src/components/stockDataFetcher.js

export class StockDataFetcher {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
        this.stockData = [];
        this.newsData = {};
    }

    async fetchStockData(stockSymbol) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/stock?symbol=${stockSymbol}`);
            if (!response.ok) throw new Error('Failed to fetch stock data');
            const data = await response.json();
            this.stockData = data.stock_info;
            return this.stockData;
        } catch (error) {
            console.error('Error fetching stock data:', error);
            return [];
        }
    }

    async fetchNewsData(stockSymbol) {
        const categories = {
            'financial-performance-btn': 'general',
            'competitive-positioning-btn': 'competitor',
            'industry-trends-btn': 'industry',
            'regulatory-impact-btn': 'general'
        };
        try {

            const categoryPromises = Object.entries(categories).map(async ([btn, type]) => {
                const response = await fetch(`${this.apiBaseUrl}/api/news?type=${type}&symbol=${stockSymbol}`);
                if (!response.ok) throw new Error(`Failed to fetch news for ${type}`);

                const data = await response.json();
                console.log(`Response for ${type}:`, data); // Log the full response
                if (data.news && Array.isArray(data.news)) {
                    // Populate the newsData with the response for the current category
                    this.newsData[btn] = data.news;
                } else {
                    console.warn(`No news or invalid data for category: ${type}`);
                }
            });

            // Wait for all the fetch operations to complete
            await Promise.all(categoryPromises);

        } catch (error) {
            console.error('Error fetching news data:', error);

        }
    }

    // Add the getNewsData method
    getNewsData() {
        if (this.newsData) {
            return this.newsData;
        } else {
            return {};
        }
    }


}
