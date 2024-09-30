// import { fetchNewsApi, fetchStockDataApi } from './mockApi.js';

// document.addEventListener('DOMContentLoaded', () => {
//     const stockNameElement = document.getElementById('stock-symbol');
//     const stockInput = document.getElementById('stock-input');
//     const fetchNewsButton = document.getElementById('fetch-news');
//     const newsList = document.getElementById('news-list');
//     const newsDetail = document.getElementById('news-detail');
//     const errorMessage = document.getElementById('error-message');

//     let currentNews = [];

//     // async function fetchNews(stockName) {
//     //     try {
//     //         errorMessage.textContent = '';
//     //         newsList.innerHTML = '<p>Loading...</p>';
//     //         newsDetail.innerHTML = '';

//     //         const response = await fetch(`/api/stock/${stockName}/status`);
//     //         if (!response.ok) {
//     //             throw new Error('Failed to fetch news');
//     //         }
//     //         const data = await response.json();
//     //         currentNews = data;
//     //         renderNewsList(data);
//     //         if (data.length > 0) {
//     //             renderNewsDetail(data[0]);
//     //         }
//     //     } catch (error) {
//     //         errorMessage.textContent = 'An error occurred while fetching the news. Please try again.';
//     //         newsList.innerHTML = '';
//     //     }
//     // }
//     async function fetchNews(stockName) {
//         try {
//             errorMessage.textContent = '';
//             newsList.innerHTML = '<p>Loading...</p>';
//             newsDetail.innerHTML = '';

//             const data = await fetchNewsApi(stockName);
//             currentNews = data;
//             renderNewsList(data);
//             if (data.length > 0) {
//                 renderNewsDetail(data[0]);
//             }
//         } catch (error) {
//             errorMessage.textContent = `An error occurred: ${error.message}`;
//             newsList.innerHTML = '';
//         }
//     }

//     function renderNewsList(news) {
//         newsList.innerHTML = news.map((item, index) => `
//             <div class="news-item" data-index="${index}">
//                 <h3>${item.Title}</h3>
//                 <p>${item.Summary}</p>
//                 <div>
//                     <span>${item.Publisher}</span>
//                     <span> • </span>
//                     <time>${new Date(item.Time_published).toLocaleString()}</time>
//                 </div>
//             </div>
//         `).join('');
//     }

//     function renderNewsDetail(newsItem) {
//         newsDetail.innerHTML = `
//             <h2>${newsItem.Title}</h2>
//             <p>${newsItem.Summary}</p>
//             <p>Published by: ${newsItem.Publisher}</p>
//             <p>Published on: ${new Date(newsItem.Time_published).toLocaleString()}</p>
//             <a href="${newsItem.Url}" target="_blank" rel="noopener noreferrer">Read full article</a>
//         `;
//     }

//     fetchNewsButton.addEventListener('click', () => {
//         const stockName = stockInput.value.trim().toUpperCase();
//         if (stockName) {
//             stockNameElement.textContent = stockName;
//             fetchNews(stockName);
//         }
//     });

//     newsList.addEventListener('click', (event) => {
//         const newsItem = event.target.closest('.news-item');
//         if (newsItem) {
//             const index = newsItem.dataset.index;
//             renderNewsDetail(currentNews[index]);
//         }
//     });

//     // Initial fetch
//     fetchNews('TSLA');

// });


import { fetchNewsApi, fetchStockDataApi } from './mockApi.js';

document.addEventListener('DOMContentLoaded', () => {
    const stockNameElement = document.getElementById('stock-name');
    const stockInput = document.getElementById('stock-input');
    const fetchNewsButton = document.getElementById('fetch-news');
    const newsList = document.getElementById('news-list');
    const newsDetail = document.getElementById('news-detail');
    const errorMessage = document.getElementById('error-message');
    const categoryButtonsContainer = document.querySelector('.category-buttons');


    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '☰ Menu';
    toggleButton.classList.add('toggle-menu');
    document.body.insertBefore(toggleButton, sidebar);

    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('visible');
    });

    let currentNews = {    
        'financial-performance-btn': [],
        'competitive-positioning-btn': [],
        'industry-trends-btn': [],
        'regulatory-impact-btn': []
    };
    

    // categoryButtonsContainer.addEventListener('click', (event) => {
    //     if (event.target.tagName === 'BUTTON') {
    //         const buttonId = event.target.id;
        
    //         // Remove 'active' class from all buttons
    //         document.querySelectorAll('.category-buttons button').forEach(btn => {
    //             btn.classList.remove('active');
    //         });
            
    //         // Add 'active' class to the clicked button
    //         event.target.classList.add('active');
    
    //         // Check if data for this category has already been fetched
    //         if (newsData[buttonId].length === 0) {
    //             // If not, fetch the data (you would replace this with your actual data fetching logic)
    //             const fetchedData = fetchNews(stockName)//await fetchNews(buttonId); // Assume this fetches news data
    //             newsData[buttonId] = fetchedData;
    //         }
            
    //         // Render the news list for the selected category
    //         renderNewsList(newsData[buttonId]);
    //     }
    // });
    categoryButtonsContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const buttonId = event.target.id;
            document.querySelectorAll('.category-buttons button').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
    
            if (currentNews[buttonId].length === 0) {
                fetchNews('TSLA', buttonId);
            } else {
                renderNewsList(currentNews[buttonId]);
            }
        }
    });


    // async function fetchNews(stockName) {
    //     try {
    //         errorMessage.textContent = '';
    //         newsList.innerHTML = '<p>Loading...</p>';
    //         newsDetail.innerHTML = '';
    //         // const response = await fetch(`/api/stock/${stockName}/status`);
    //         // if (!response.ok) {
    //         //     throw new Error('Failed to fetch news');
    //         // }
    //         // const data = await response.json();
    //         const data = await fetchNewsApi(stockName);
    //         currentNews = data;
    //         renderNewsList(data);
    //         if (data.length > 0) {
    //             renderNewsDetail(data[0]);
    //         }
    //     } catch (error) {
    //         errorMessage.textContent = `An error occurred: ${error.message}`;
    //         newsList.innerHTML = '';
    //     }
    // }
    async function fetchNews(stockName, category) {
        try {
            errorMessage.textContent = '';
            newsList.innerHTML = '<p>Loading...</p>';
            newsDetail.innerHTML = '';
            const data = await fetchNewsApi(stockName, category);
            currentNews[category] = data;
            renderNewsList(data);
            if (data.length > 0) {
                renderNewsDetail(data[0]);
            }
        } catch (error) {
            errorMessage.textContent = `An error occurred: ${error.message}`;
            newsList.innerHTML = '';
        }
    }
    

    fetchNewsButton.addEventListener('click', () => {
        const stockName = stockInput.value.trim().toUpperCase();
        if (stockName) {
            stockNameElement.textContent = stockName;
            fetchNews(stockName);
        }
    });

    function renderNewsList(news) {
        newsList.innerHTML = news.map((item, index) => `
                    <div class="news-item" data-index="${index}">
                        <h3>${item.Title}</h3>
                        <p>${item.Summary}</p>
                        <div>
                            <span>${item.Publisher}</span>
                            <span> • </span>
                            <time>${new Date(item.Time_published).toLocaleString()}</time>
                        </div>
                    </div>
                `).join('');
    }

    function renderNewsDetail(newsItem) {
        newsDetail.innerHTML = `
            <h2>${newsItem.Title}</h2>
            <p>${newsItem.Summary}</p>
            <p>Published by: ${newsItem.Publisher}</p>
            <p>Published on: ${new Date(newsItem.Time_published).toLocaleString()}</p>
            <a href="${newsItem.Url}" target="_blank" rel="noopener noreferrer">Read full article</a>
        `;
    }

    newsList.addEventListener('click', (event) => {
        const newsItemElement = event.target.closest('.news-item'); // Find the clicked news item
        if (newsItemElement) {
            const index = newsItemElement.dataset.index; // Retrieve the index from the data-index attribute
            const activeCategoryButton = document.querySelector('.category-buttons button.active');
            const category = activeCategoryButton ? activeCategoryButton.id : null;
            
            if (category && currentNews[category][index]) {
                const selectedNewsItem = currentNews[category][index];
                renderNewsDetail(selectedNewsItem); // Render the details of the clicked news item
            }
        }
    });

    
    // // Initial fetch
    fetchNews('TSLA');
});