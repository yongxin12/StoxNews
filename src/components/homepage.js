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
            { text: 'AAPL', size: 55 },
            { text: 'TSLA', size: 55 },
            { text: 'NVDA', size: 55 },
            { text: 'MSFT', size: 50 },
            { text: 'AMZN', size: 50 },
            { text: 'GOOG', size: 50 },
            { text: 'META', size: 45 },
            { text: 'AMD', size: 40 },
            { text: 'AVGO', size: 35 },
            { text: 'PDD', size: 35 },
            { text: 'ON', size: 30 },
            { text: 'KLAC', size: 30 },
            { text: 'ASML', size: 30 },
            { text: 'INTC', size: 40 },
        ];



        const width = document.getElementById('word-cloud-container').offsetWidth;
        const height = document.getElementById('word-cloud-container').offsetHeight;

        const layout = d3.layout.cloud()
            .size([width, height])
            .words(keywords.map(d => ({ text: d.text, size: d.size })))
            .padding(30)
            .rotate(() => (~~(Math.random() * 2) * 90))
            .fontSize(d => d.size)
            .on('end', words => {
                console.log('Words processed by D3 Cloud:', words);
                this.drawWordCloud("word-cloud-container", words);
            });

        layout.start();
    }

    drawWordCloud(containerId, words) {
        const container = document.getElementById(containerId);
        const width = container.offsetWidth;
        const height = container.offsetHeight;
    
        // Remove existing SVG (for re-rendering on resize)
        d3.select(`#${containerId} svg`).remove();
    
        // Create a responsive SVG
        const svg = d3.select(`#${containerId}`)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`) // Maintain aspect ratio
            .attr('preserveAspectRatio', 'xMidYMid meet'); // Center the word cloud
    
        const colors = ['#ff5500', '#111111'];
    
        svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`) // Center the word cloud
            .selectAll('text')
            .data(words)
            .enter()
            .append('text')
            .style('font-size', d => `${d.size}px`)
            .style('fill', () => {
                const baseColor = colors[Math.floor(Math.random() * colors.length)];
                const lightness = Math.random() < 0.5 ? 30 : 70;
                return this.convertHexToHslWithLightness(baseColor, lightness);
            })
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
            .text(d => d.text)
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