// src/utils/dateHelper.js

export function formatXAxisLabels(value, index, range) {
    const date = new Date(value);
    console.log(date);
    return;
    const yearMonthDay = date.toISOString().split('T')[0];
    const monthDay = `${date.getMonth() + 1}-${date.getDate()}`;

    if (index === 0) return yearMonthDay;  // Always show full date for the first label

    switch (range) {
        case '7d':
        case '1m':
        case '3m':
            return monthDay;  // Month-Day for short ranges
        case '6m':
        case '1y':
            return date.getMonth() + 1;  // Just the month for longer ranges
        case '5y':
        case '10y':
        case 'all':
            return date.getFullYear();  // Only the year for long ranges
        default:
            return yearMonthDay;
    }
}
