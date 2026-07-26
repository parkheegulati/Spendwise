import moment from "moment";

export const CURRENCY_SYMBOLS = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥"
};

export const getCurrencySymbol = (code = "INR") => {
    return CURRENCY_SYMBOLS[code] || CURRENCY_SYMBOLS.INR;
};

export const addThousandsSeparator = (num) => {
    if (num == null || isNaN(num)) return "0";

    const numStr = num.toString();
    const parts = numStr.split('.');

    let integerPart = parts[0];
    let fractionalPart = parts[1];

    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);

    if (otherNumbers !== '') {
        const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
        integerPart = formattedOtherNumbers + ',' + lastThree;
    } else {
        integerPart = lastThree;
    }

    return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
};

export const formatAmount = (num, currencyCode = "INR") => {
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${addThousandsSeparator(num)}`;
};

export const prepareIncomeLineChartData = (data = []) => {
    const groupedByDate = data.reduce((acc, item) => {
        const dateKey = item.date;

        if (!acc[dateKey]) {
            acc[dateKey] = {
                date: dateKey,
                totalAmount: 0,
                items: [],
            };
        }

        acc[dateKey].totalAmount += item.amount;
        acc[dateKey].items.push(item);
        return acc;
    }, {});

    let chartData = Object.values(groupedByDate);
    chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

    chartData = chartData.map((dataPoint) => ({
        ...dataPoint,
        month: moment(dataPoint.date).format('Do MMM'),
    }));

    return chartData;
};