

export class BreakingNewsItem {
    constructor(newsData) {
        this.newsData = newsData;
        this.newsList = document.getElementById('ranking-list');
        this.rankingListElement = document.getElementById('ranking-list');
    }

    createItem() {
        // Step 1: Group news data by `affected_stock_value_percentage` and `affected_symbol`
        const groupedNewsData = this.newsData.reduce((acc, news) => {
            const key = `${news.affected_stock_value_percentage}-${news.affected_symbol}`;
            if (!acc[key]) {
                acc[key] = { ...news, aggregated: [] }; // Create a new group
            }
            acc[key].aggregated.push(news); // Add news to the group
            return acc;
        }, {});
    
        // Step 2: Create list items from grouped data
        Object.values(groupedNewsData).forEach((group, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('ranking-item');
            listItem.setAttribute('data-rank', index + 1); // Rank number
            listItem.setAttribute('data-symbol', group.affected_symbol); // Symbol
            listItem.setAttribute('data-date', group.date); // Date
    
            const percentageClass = group.affected_stock_value_percentage > 0 ? 'gain' : 'loss';
    
            // Step 3: Generate aggregated summary
            const aggregatedTitles = group.aggregated.map(item => `<li>${item.title}</li>`).join('');
    
            listItem.innerHTML = `
                <a href="#" onclick="return false;">
                    <h4>${group.title}</h4>
                    <p>${group.publisher} - ${group.date}</p>
                    <p>${group.summary}</p>
                    <ul>${aggregatedTitles}</ul>
                    <a href="${group.url}" target="_blank" rel="noopener noreferrer">Read full article</a>
                    <span class="${percentageClass}">${group.affected_stock_value_percentage}%</span>
                </a>
            `;
    
            this.rankingListElement.appendChild(listItem);
        });
    }

}