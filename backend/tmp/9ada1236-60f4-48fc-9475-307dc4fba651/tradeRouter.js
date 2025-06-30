function decideTrade(currentPrice, lastPrice) {
    const priceChange = currentPrice - lastPrice;
    const threshold = 2.0;

    if (priceChange >= threshold) {
        return "SELL";
    } else if (priceChange <= -threshold) {
        return "BUY";
    }
    return "HOLD";
}

module.exports = { decideTrade };
