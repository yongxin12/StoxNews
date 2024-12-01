# StoxNews

## Docker
How to run frontend
```
sudo docker image build -t stock-frontend .
sudo docker run -p 3000:3000 stock-frontend
```

## StoxNews Frontend
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
```
## Project Structure
```markdown
.
├── Dockerfile
├── index.html
├── LICENSE
├── mockApi.js
├── nginx.conf
├── README.md
└── src
    ├── assets
    │   ├── GOOG.png
    │   ├── INTC.png
    │   ├── META.png
    │   ├── NVDA.png
    │   ├── PACCAR.png
    │   └── TSLA.png
    ├── components
    │   ├── animation.js
    │   ├── breakingNews.js
    │   ├── dashboard.js
    │   ├── homepage.js
    │   ├── navigation.js
    │   ├── news.js
    │   ├── stockDataFetcher.js
    │   ├── stockGraph.js
    │   └── utils.js
    ├── css
    │   ├── animations.css
    │   ├── dashboard-section.css
    │   ├── homepage.css
    │   ├── navbar.css
    │   ├── news.css
    │   ├── responsive.css
    │   └── visibility.css
    ├── index.js
    └── styles.css
```
## Tasks done
2024/11/30 fixed incorrect display issue
2024/11/29 responsive design and finalize UI
2024/11/28 applied top news analysis api
2024/11/28 wordcloud added on homepage
2024/11/15 dashboard section added
2024/10/25 improved GUI
2024/10/25 News Integrated
2024/10/20 improved GUI
2024/10/18 graph added, files modularized 
2024/10/14 Backend data integration
2024/10/05 Docker image built
2024/10/04 Nginx set up
2024/09/27 draft web UI(html/js/css) with mockdata
2024/09/20 UI figma design
2024/09/14 Information research
