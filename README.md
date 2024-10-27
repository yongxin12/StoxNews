# StoxNews

## Docker
How to run frontend
```
sudo docker image build -t stock-frontend .
sudo docker run -p 3000:3000 stock-frontend


# StoxNews Frontend
The following demonstrates the sequence diagram for the frontend

```mermaid
sequenceDiagram
    participant User
    participant UI as User Interface
    participant Input as Stock Input
    participant StockFetcher as StockDataFetcher
    participant NewsCategory 
    participant StockGraph as StockGraph
    participant NewsList as News List
    participant RangeSelector
    participant ErrorMsg as Error Message

    User->>Input: Enters stock symbol
    Input-->>UI: Stock symbol entered
    User->>UI: Clicks "Fetch News"
    UI->>StockFetcher: Fetch stock data and news
    StockFetcher->>StockGraph: Update graph with initial stock data
    StockGraph-->>UI:Render stock graph
    User->>UI:Clicks "News Category"
    UI->>NewsCategory:Sort news data
    NewsCategory->>NewsList: Render news list
    NewsList-->>UI: Display news details on selection
    UI->>User: Shows graph and news list
    User->>UI:Clicks "Range Selector"
    UI->>RangeSelector:Filter news date
    RangeSelector->>NewsList: Filter news 
    NewsList-->>UI: Display news details on selection
    RangeSelector->>StockGraph: add news to graph
    StockGraph-->>UI:Render stock graph
    StockFetcher-->>ErrorMsg: Error if fetching fails
    UI->>User: Shows graph and news list
    ErrorMsg->>UI: Display error message if data fetch fails
