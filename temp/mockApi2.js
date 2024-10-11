// Mock data for Financial Performance news items
const financialPerformanceNews = [
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
  
  // Mock data for Competitive Positioning news items
  const competitivePositioningNews = [
    {
      Title: "Tesla vs Rivian: A Comparison of Electric Truck Capabilities",
      Time_published: "2023-09-10T14:30:00Z",
      Summary: "A detailed comparison between Tesla's Cybertruck and Rivian's R1T, focusing on their performance, range, and pricing.",
      Publisher: "Auto Reviews",
      Url: "https://example.com/tesla-vs-rivian"
    },
    {
      Title: "Tesla Maintains Market Leadership in EV Sales",
      Time_published: "2023-09-08T09:15:00Z",
      Summary: "Despite increased competition, Tesla continues to dominate the electric vehicle market with a 70% market share.",
      Publisher: "EV Industry Daily",
      Url: "https://example.com/tesla-market-leadership"
    },
    {
      Title: "Ford Challenges Tesla with New Electric SUV",
      Time_published: "2023-09-07T11:45:00Z",
      Summary: "Ford's latest electric SUV is set to rival Tesla's Model Y, offering advanced features at a competitive price.",
      Publisher: "Car Enthusiast",
      Url: "https://example.com/ford-vs-tesla"
    },
    {
      Title: "Mercedes-Benz Targets Tesla with New Luxury EV Lineup",
      Time_published: "2023-09-05T16:20:00Z",
      Summary: "Mercedes-Benz announces plans to release a range of luxury electric vehicles, aiming to challenge Tesla's dominance.",
      Publisher: "Luxury Auto",
      Url: "https://example.com/mercedes-vs-tesla"
    }
  ];
  
  // Mock data for Industry Trends news items
  const industryTrendsNews = [
    {
      Title: "EV Charging Infrastructure Expanding Rapidly Worldwide",
      Time_published: "2023-09-03T14:30:00Z",
      Summary: "Countries around the world are investing heavily in EV charging infrastructure to support the growing number of electric vehicles.",
      Publisher: "Green Energy Today",
      Url: "https://example.com/ev-charging-infrastructure"
    },
    {
      Title: "Battery Recycling to Become a Billion-Dollar Industry",
      Time_published: "2023-09-01T09:15:00Z",
      Summary: "As EV adoption rises, battery recycling is expected to become a crucial part of the industry's sustainability efforts.",
      Publisher: "Sustainable Tech",
      Url: "https://example.com/battery-recycling-industry"
    },
    {
      Title: "Autonomous Vehicles Expected to Reshape Urban Transportation",
      Time_published: "2023-08-30T11:45:00Z",
      Summary: "Experts predict that autonomous vehicles will significantly change urban transportation, with Tesla leading the innovation.",
      Publisher: "Future Mobility",
      Url: "https://example.com/autonomous-vehicles"
    },
    {
      Title: "Tesla's Influence on Traditional Automakers",
      Time_published: "2023-08-28T16:20:00Z",
      Summary: "Traditional automakers are increasingly shifting towards electric vehicles, influenced by Tesla's success and market dominance.",
      Publisher: "Auto Industry Insights",
      Url: "https://example.com/tesla-influence"
    }
  ];
  
  // Mock data for Regulatory Impact news items
  const regulatoryImpactNews = [
    {
      Title: "New Emission Regulations Could Boost EV Sales",
      Time_published: "2023-08-25T14:30:00Z",
      Summary: "Upcoming emission regulations in several countries are expected to accelerate the adoption of electric vehicles.",
      Publisher: "Environmental News",
      Url: "https://example.com/emission-regulations"
    },
    {
      Title: "Tesla Benefits from New EV Subsidies in Europe",
      Time_published: "2023-08-22T09:15:00Z",
      Summary: "European governments introduce new subsidies for electric vehicles, providing a significant advantage to Tesla and other EV makers.",
      Publisher: "Financial Times",
      Url: "https://example.com/ev-subsidies-europe"
    },
    {
      Title: "U.S. Lawmakers Propose Tax Credits for EV Buyers",
      Time_published: "2023-08-20T11:45:00Z",
      Summary: "A proposed bill in the U.S. Congress aims to provide tax credits for electric vehicle buyers, potentially benefiting Tesla.",
      Publisher: "American Auto News",
      Url: "https://example.com/ev-tax-credits"
    },
    {
      Title: "Tesla Faces Regulatory Challenges in China",
      Time_published: "2023-08-18T16:20:00Z",
      Summary: "China's regulatory scrutiny over Tesla's data collection practices could impact the company's growth in the region.",
      Publisher: "China Business Review",
      Url: "https://example.com/tesla-china-regulation"
    }
  ];
  
  // Mock API call to fetch news based on category
  async function fetchNewsApi(stockSymbol, category) {
    await simulateDelay(1000); // Simulate network delay
  
    if (stockSymbol.toUpperCase() !== 'TSLA') {
      throw new Error('Only TSLA stock symbol is supported in this mock API');
    }
  
    // Return data based on the category
    switch (category) {
      case 'financial-performance-btn':
        return financialPerformanceNews;
      case 'competitive-positioning-btn':
        return competitivePositioningNews;
      case 'industry-trends-btn':
        return industryTrendsNews;
      case 'regulatory-impact-btn':
        return regulatoryImpactNews;
      default:
        return [];
    }
  }
  
  // Export the updated fetch function
  export { fetchNewsApi };