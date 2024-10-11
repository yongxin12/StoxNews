// Mock data for news items
const mockNewsData = [
  {
    Title: "Tesla Unveils New Battery Technology",
    Time_published: "2023-09-15T14:30:00Z",
    Summary: "Tesla announces breakthrough in battery technology, promising longer range and faster charging times for electric vehicles.",
    Publisher: "Tech Insider",
    Url: "https://example.com/tesla-battery-tech"
  },
  {
    Title: "Tesla Stock Surges After Earnings Report",
    Time_published: "2023-09-14T09:15:00Z",
    Summary: "Tesla's stock price jumps 10% following better-than-expected quarterly earnings report.",
    Publisher: "Financial Times",
    Url: "https://example.com/tesla-stock-surge"
  },
  {
    Title: "Tesla Expands Supercharger Network in Europe",
    Time_published: "2023-09-13T11:45:00Z",
    Summary: "Tesla announces plans to double its Supercharger network in Europe by the end of the year.",
    Publisher: "EV News",
    Url: "https://example.com/tesla-supercharger-expansion"
  },
  {
    Title: "Elon Musk Hints at New Tesla Model",
    Time_published: "2023-09-12T16:20:00Z",
    Summary: "In a cryptic tweet, Elon Musk suggests Tesla may be working on a new vehicle model.",
    Publisher: "Auto World",
    Url: "https://example.com/tesla-new-model-hint"
  }
];

// Function to simulate API call delay
function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock API call to fetch news
async function fetchNewsApi(stockSymbol) {
  await simulateDelay(1000); // Simulate network delay

  if (stockSymbol.toUpperCase() !== 'TSLA') {
    throw new Error('Only TSLA stock symbol is supported in this mock API');
  }

  // Simulate occasional errors
  if (Math.random() < 0.1) {
    throw new Error('Simulated API error');
  }

  return mockNewsData;
}

// Mock API call to fetch stock data
async function fetchStockDataApi(stockSymbol) {
  await simulateDelay(800); // Simulate network delay

  if (stockSymbol.toUpperCase() !== 'TSLA') {
    throw new Error('Only TSLA stock symbol is supported in this mock API');
  }

  // Generate mock stock data
  const currentPrice = 250 + Math.random() * 50;
  const openPrice = currentPrice - 10 + Math.random() * 20;

  return {
    symbol: 'TSLA',
    companyName: 'Tesla, Inc.',
    currentPrice: currentPrice.toFixed(2),
    change: (currentPrice - openPrice).toFixed(2),
    changePercent: ((currentPrice - openPrice) / openPrice * 100).toFixed(2),
    open: openPrice.toFixed(2),
    high: (Math.max(currentPrice, openPrice) + Math.random() * 10).toFixed(2),
    low: (Math.min(currentPrice, openPrice) - Math.random() * 10).toFixed(2),
    volume: Math.floor(1000000 + Math.random() * 5000000)
  };
}

// Example usage
async function testMockApi() {
  try {
    console.log('Fetching news...');
    const news = await fetchNewsApi('TSLA');
    console.log('News data:', news);

    console.log('Fetching stock data...');
    const stockData = await fetchStockDataApi('TSLA');
    console.log('Stock data:', stockData);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Uncomment the line below to run the test
// testMockApi();

// Export the functions for use in other files
export { fetchNewsApi, fetchStockDataApi };