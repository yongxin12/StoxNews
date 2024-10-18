// src/components/stockGraph.js


import { formatXAxisLabels } from '../utils/dateHelper.js';

export class StockGraph1 {
    constructor(element) {
        this.chartElement = element;
        this.chartInstance = null;
    }

    render(stockData, range) {
        const ctx = document.createElement('canvas');
        this.chartElement.innerHTML = '';  // Clear existing content
        this.chartElement.appendChild(ctx);

        const dates = stockData.map(item => new Date(item.date));
        const prices = stockData.map(item => item.close);

        if (this.chartInstance) {
            this.chartInstance.destroy();  // Destroy old chart instance
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            fill: true,
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Date',
                        font: { size: 14 }
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        autoSkip: true,
                        maxTicksLimit: 10,
                        font: { size: 12 }
                    }
                },
                y: {
                    display: true,  // Ensure y-axis is displayed
                    position: 'left',  // Position y-axis on the left
                    title: {
                        display: true,
                        text: 'Price (USD)',
                        font: { size: 14 }
                    },
                    ticks: {
                        beginAtZero: true,
                        font: { size: 12 },
                        // Ensure a reasonable number of ticks
                        count: 10
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)',
                        borderDash: [5, 5]
                    }
                }
            }
        };

        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Closing Price',
                    data: prices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                }]
            },
            options: options,
        });
    }
}

export class StockGraph {
    constructor(stockGraphElement) {
        this.stockGraphElement = stockGraphElement; // The canvas element or container where the graph will be rendered
        this.chart = null; // Will store the chart instance
    }

    // Method to initialize and generate the graph
    generateGraph(stockData, range) {
        const parsedData = this.parseStockData(stockData); // Parse the stock data

        // Data for the chart
        const data = {
            labels: parsedData.dates,  // The dates (X-axis)
            datasets: [{
                label: `Closing Prices`, // Stock symbol
                data: parsedData.closingPrices, // Closing prices (Y-axis)
                borderColor: 'rgba(75, 192, 192, 1)',  // Custom line color
                borderWidth: 2,  // Slightly thicker line
                pointRadius: 1,  // Larger points for better visibility
                tension: 0.4     // Smoothing the line
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            fill: true,
            animation: {
                duration: 1000,  // Animation duration in milliseconds
                easing: 'easeInOutBounce'  // Easing type for animation
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    enabled: true
                }
            },
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Date',
                        font: {
                            size: 12
                        }
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10,
                        font: {
                            size: 12
                        },
    
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)',
                        font: {
                            size: 12
                        }
                    },
                    ticks: {
                        beginAtZero: false,  // Avoid starting Y-axis at 0
                        suggestedMin: Math.min(...parsedData.closingPrices) * 0.95,  // Slightly below the lowest value
                        suggestedMax: Math.max(...parsedData.closingPrices) * 1.05,  // Slightly above the highest value
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)',  // Light gridlines
                        borderDash: [5, 5]
                    }
                }
            },
            onResize: function(chart, size) {
                // Trigger the re-animation after resizing (e.g., full screen)
                chart.update({
                    duration: 2000,  // Re-apply animation duration
                    easing: 'easeInOutBounce'  // Re-apply easing function
                });
            }
        };

        // Destroy previous chart instance if it exists
        if (this.chart) {
            this.chart.destroy();
        }

        // Create new chart instance
        this.chart = new Chart(this.stockGraphElement, {
            type: 'line',
            data: data,
            options: options,
        });
    }

    // Method to parse the stock data and return dates and closing prices
    parseStockData(stockData) {
        const stockInfo = stockData;
        const dates = [];
        const closingPrices = [];
        stockData.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Loop through the stock data and extract dates and closing prices
        stockInfo.forEach(item => {
            dates.push(item.date); // Collect the date
            closingPrices.push(item.close); // Collect the closing price
        });


        return { dates, closingPrices };
    }
}

// Export the StockGraph class for use in other modules if needed (for ES6 modules)
//export default StockGraph;






