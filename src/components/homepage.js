import { DynamicPlaceholder } from './animation.js';

export class Home {
    static instance = null;  // Static property to hold the singleton instance

    constructor() {
        // If an instance already exists, return it
        if (Home.instance) {
            return Home.instance;
        }

        // Otherwise, set up the instance
        this.stockInput = document.getElementById('home-stock-input');
        this.searchButton = document.getElementById('home-search-btn');
        this.dynamicPlaceholder = new DynamicPlaceholder('home-stock-input');
        this.dynamicPlaceholder.init();
        this.initializeEventListeners();
        this.initializeWordCloud();

        // Assign this instance to the static property
        Home.instance = this;
    }

    static getInstance() {
        // Return the existing instance, or create a new one if it doesn't exist
        if (!Home.instance) {
            Home.instance = new Home();
        }
        return Home.instance;
    }

    initializeEventListeners() {
        this.searchButton.addEventListener('click', () => {
            const stockSymbol = this.stockInput.value.trim().toUpperCase();
            if (stockSymbol) {
                this.stockInput.value = "";
                document.getElementById('home-section').style.display = 'none'; // Hide home
                document.getElementById('news-section').style.display = 'block'; // Show news
                document.getElementById('news-stock-input').value = stockSymbol;
                document.getElementById('news-search-btn').click();
            }
        });
    }

    initializeWordCloud() {
        const keywords = [
            { text: 'TSLA', size: 40 },
            { text: 'MSFT', size: 30 },
            { text: 'GOOGL', size: 35 },
            { text: 'NVDA', size: 50 },
            { text: 'AMZN', size: 25 },
            { text: 'NFLX', size: 20 },
            { text: 'META', size: 30 }
        ];

        const width = document.getElementById('word-cloud-container').offsetWidth;
        const height = 300;

        const svg = d3.select('#word-cloud-container')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const layout = d3.layout.cloud()
            .size([width, height])
            .words(keywords.map(d => Object.create(d)))
            .padding(5)
            .rotate(() => (~~(Math.random() * 2) * 90)) // Randomly rotate
            .fontSize(d => d.size)
            .on('end', draw.bind(this));

        console.log('Home instance initialized');
        layout.start();

        function draw(words) {
            svg.append('g')
                .attr('transform', `translate(${width / 2}, ${height / 2})`)
                .selectAll('text')
                .data(words)
                .enter()
                .append('text')
                .style('font-size', d => `${d.size}px`)
                .style('fill', () => `hsl(${Math.random() * 360}, 100%, 50%)`) // Random color
                .attr('text-anchor', 'middle')
                .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
                .text(d => d.text)
                .on('click', d => {
                    this.stockInput.value = d.text; // Fill input with the selected keyword
                    console.log(d.text)
                    this.searchButton.click(); // Trigger search
                });
        }
        
    }
    
}