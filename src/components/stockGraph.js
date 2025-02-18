// src/components/stockGraph.js


export class StockGraph {
    constructor(stockGraphElement, stockSymbolDisplayElement) {
        this.stockGraphElement = stockGraphElement; // The canvas element or container where the graph will be rendered
        this.chart = null; // Will store the chart instance
        this.stockSymbolDisplayElement = stockSymbolDisplayElement;
    }

    // Method to initialize and generate the graph
    generateGraph(stockData, range, newsDates = [], stockSymbol) {
        const parsedData = this.parseStockData(stockData); // Parse the stock data
        console.log(stockData);
        this.stockSymbolDisplayElement.textContent = stockSymbol;
        // Data for the chart
        const data = {
            labels: parsedData.dates,  // The dates (X-axis)
            datasets: [{
                label: `Closing Prices`, // Stock symbol
                data: parsedData.closingPrices, // Closing prices (Y-axis)
                borderColor: 'rgb(52, 168, 83)',  // Custom line color
                borderWidth: 2,  // Slightly thicker line
                pointRadius: 1,  // Larger points for better visibility
                tension: 0.4     // Smoothing the line
            }]
        };
        // Add vertical line annotations for news dates
        const annotations = newsDates.map(date => ({
            type: 'line',
            scaleID: 'x',
            value: date,
            borderColor: 'red',
            borderWidth: 2,
            label: {
                content: 'News',
                enabled: true,
                position: 'start',
                yAdjust: -30,
            },
            drawTime: 'afterDatasetsDraw',
        }));

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            fill: false,
            animation: {
                duration: 1000,  // Animation duration in milliseconds
                easing: 'easeOutCirc'  // Easing type for animation
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10
                },
                backgroundColor: 'transparent'  // Makes chart area transparent
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
                },
                annotation: {
                    annotations: annotations // Highlight news dates
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',  // Set the time unit to 'day'
                        // displayFormats: {
                            
                        // }
                    },
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
    
                    },
                    grid: {
                        display: false // Disable vertical grid lines
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
                        borderDash: [6, 6]
                    }
                }
            },
            onResize: function(chart, size) {
                // Trigger the re-animation after resizing (e.g., full screen)
                chart.update({
                    duration: 1000,  // Re-apply animation duration
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

        console.log(dates);
        return { dates, closingPrices };
    }
}

// Export the StockGraph class for use in other modules if needed (for ES6 modules)
//export default StockGraph;






