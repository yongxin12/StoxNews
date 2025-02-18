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
            'regulatory-impact-btn': 'general',
            'gaining-related-btn': 'gaining',
            'losing-related-btn': 'losing',
        };

        const topCategories = {
            'gaining-summary-btn': 'gaining',
            'losing-summary-btn': 'losing'
        }
        try {

            const categoryPromises = Object.entries(categories).map(async ([btn, type]) => {
                const response = await fetch(`${this.apiBaseUrl}/api/news?type=${type}&symbol=${stockSymbol}`);
                if (!response.ok) throw new Error(`Failed to fetch news for ${type}`);

                const data = await response.json();
                console.log(`Response for ${type}:`, data); // Log the full response
                if (data) {
                    // Populate the newsData with the response for the current category
                    if (btn === 'financial-performance-btn') {

                        this.handleGeneralData(data, btn, type);

                    } else if (btn === 'regulatory-impact-btn') {

                        this.handleGeneralData(data, btn, type);

                    } else if (btn === 'competitive-positioning-btn') {

                        this.handleCompetitorData(data, btn, type);

                    } else if (btn === 'industry-trends-btn') {
                        
                        this.hanldeIndustryData(data, btn, type);
                    } else {

                        data.sort((a, b) => b.time_published - a.time_published);

                        console.log(data);
                        this.newsData[btn] = data;
                    }

                } else {
                    console.warn(`No news or invalid data for category: ${type}`);
                }
            });

            // Wait for all the fetch operations to complete
            await Promise.all(categoryPromises);

        } catch (error) {
            console.error('Error fetching news data:', error);
        }

        

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/top_news_analysis?symbol=${stockSymbol}`);
            if (!response.ok) throw new Error(`Failed to fetch news for ${type}`);
            const data = await response.json();
            if (data) {
                const gaining = data.gaining.sort((a, b) => new Date(b.date) - new Date(a.date));
                const losing = data.losing.sort((a, b) => new Date(b.date) - new Date(a.date));
            }

            Object.entries(topCategories).map(([btn, type]) => {
                console.log(`Response for ${type} Summary:`, data); // Log the full response
                this.newsData[btn] = data[type];
            });

        } catch (error) {
            console.error('Error fetching news data:', error);

        }

    }

    handleGeneralData(data, btn, type) {
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

    }

    handleCompetitorData(data, btn, type) {
        if (!this.newsData[btn]) {
            this.newsData[btn] = {};
        }

        data.forEach(set => {
            if (set.news && set.symbol) {

                if (!this.newsData[btn][set.symbol]) {
                    this.newsData[btn][set.symbol] = [];
                }

                set.news.forEach(element => {
                    if (element.time_published) {
                        try {
                            // Mock dates
                            const randomDate = this.getRandomDateInLastTwoMonths();
                            element.time_published = randomDate;

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
            } else {
                console.warn(`Set news or symbol is empty in ${type}`);
            }
            // MOCK dates Sort the news by time_published in descending order (latest first)
            set.news.sort((a, b) => b.time_published - a.time_published);
            this.newsData[btn][set.symbol] = set.news;
            console.log(this.newsData[btn]);
        });
    }

    hanldeIndustryData(data, btn, type) {
        data.forEach(element => {
            if (element.time_published) {
                try {
                    // Mock dates
                    const randomDate = this.getRandomDateInLastTwoMonths();
                    element.time_published = randomDate;
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
        data.sort((a, b) => b.time_published - a.time_published);

        console.log(data);
        this.newsData[btn] = data;
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

export class BreakingNewsFetcher {
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


}
