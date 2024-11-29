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
            const style = document.createElement('style');
            style.textContent = `
                text {
                    transition: transform 0.2s ease, fill-opacity 0.2s ease;
                }
            `;
            document.head.appendChild(style);
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
            { text: 'AAPL', size: 50 },
            { text: 'TSLA', size: 45 },
            { text: 'NVDA', size: 40 },
            { text: 'MSFT', size: 35 },
            { text: 'AMZN', size: 50 },
            { text: 'GOOG', size: 35 },
            { text: 'META', size: 35 },
            { text: 'AMD', size: 30 },
            { text: 'AVGO', size: 20 },
            { text: 'PDD', size: 25 },
            { text: 'ON', size: 25 },
            { text: 'KLAC', size: 25 },
            { text: 'ASML', size: 20 },
            { text: 'INTC', size: 30 },
        ];



        const width = document.getElementById('word-cloud-container').offsetWidth;
        const height = document.getElementById('word-cloud-container').offsetHeight;

        const svg = d3.select('#word-cloud-container')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const layout = d3.layout.cloud()
            .size([width, height])
            .words(keywords.map(d => ({ text: d.text, size: d.size })))
            .padding(5)
            .rotate(() => (~~(Math.random() * 2) * 90))
            .fontSize(d => d.size)
            .on('end', words => {
                console.log('Words processed by D3 Cloud:', words);
                this.drawWordCloud(svg, words, width, height);
            });

        layout.start();
    }

    drawWordCloud(svg, words, width, height) {
        const colors = ['#ff5500', '#111111'];
        svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`)
            .selectAll('text')
            .data(words)
            .enter()
            .append('text')
            .style('font-size', d => `${d.size}px`)
            .style('fill', () => {
                // Randomly select a base color
                const baseColor = colors[Math.floor(Math.random() * colors.length)];
                // Adjust lightness for two shades (30% for dark, 70% for light)
                const lightness = Math.random() < 0.5 ? 30 : 70;
                return this.convertHexToHslWithLightness(baseColor, lightness);
            })
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
            .text(d => d.text) // Ensure the text content is set
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .transition() // Start a D3 transition
                    .ease(d3.easeCubicOut) // Apply easing for smooth effect
                    .duration(300) // Animation duration
                    .style('font-size', `${d.size * 1.5}px`) // Scale font size
                    .style('fill-opacity', 0.8) // Reduce opacity slightly
                    .attr('transform', `translate(${d.x}, ${d.y})scale(1.2)rotate(${d.rotate})`) // Scale and reposition
                    .style('cursor', 'pointer'); // Change cursor
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .transition() // Start a transition to reset
                    .ease(d3.easeCubicInOut) // Smoothly ease back
                    .duration(300) // Animation duration
                    .style('font-size', `${d.size}px`) // Reset font size
                    .style('fill-opacity', 1) // Restore opacity
                    .attr('transform', `translate(${d.x}, ${d.y})rotate(${d.rotate})`); // Reset transform
            })
            .on('click', function (event, d) { // D3 click event with `event` and `d`
                console.log('Clicked word:', d);
                if (d && d.text) {
                    const homeInstance = Home.getInstance(); // Access the singleton
                    homeInstance.stockInput.value = d.text; // Update the input
                    homeInstance.searchButton.click(); // Trigger the search
                } else {
                    console.error('Clicked word is missing text:', d);
                }
            });

    }
    convertHexToHslWithLightness(hex, lightness) {
        // Convert hex to RGB
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        // Find max and min values for RGB
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        // Calculate lightness
        let h, s;
        const l = (max + min) / 2;

        // Calculate hue and saturation
        if (max === min) {
            h = s = 0; // Achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        // Convert to HSL with custom lightness
        h = Math.round(h * 360);
        s = Math.round(s * 100);
        return `hsl(${h}, ${s}%, ${lightness}%)`;
    }





}