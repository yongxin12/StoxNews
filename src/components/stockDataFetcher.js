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
    // Mock data
    // Function to generate a random date within the last 2 months
    getRandomDateInLastTwoMonths() {
        const now = new Date();
        const pastDate = new Date();
        pastDate.setMonth(now.getMonth() - 2);  // Set the date to 2 months ago

        // Get a random timestamp between the past date and now
        const randomTimestamp = Math.random() * (now.getTime() - pastDate.getTime()) + pastDate.getTime();
        return new Date(randomTimestamp);
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
                    data.news.forEach(element => {
                        if (element.time_published) {
                            try {
                                // Mock dates
                                const randomDate = this.getRandomDateInLastTwoMonths();
                                element.time_published = randomDate;

                                // element.time_published = new Date(
                                //     element.time_published.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6')
                                // );
                                //element.date = element.time_published.toLocaleString().slice(2, 10);
                                //element.time_published = element.time_published.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3');
                                element.date = element.time_published.getFullYear() + '-' +
                                String(element.time_published.getMonth() + 1).padStart(2, '0') + '-' + 
                                String(element.time_published.getDate()).padStart(2, '0');
                            } catch (formatError) {
                                console.warn(`Error formatting timePublished for ${type}:`, formatError);
                            }
                        } else {
                            console.warn(`Missing timePublished for news item in ${type}`);
                        }
                    });
                    // MOCK dates Sort the news by time_published in descending order (latest first)
                    data.news.sort((a, b) => b.time_published - a.time_published);

                    console.log(data.news);
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
