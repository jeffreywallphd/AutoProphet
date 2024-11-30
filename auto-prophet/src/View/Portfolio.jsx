// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.



import React, { useState } from "react";
import "../index.css";

const Portfolio = () => {
  const [search, setSearch] = useState("");
  const [stocks, setStocks] = useState([]);
  const [overview, setOverview] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [viewingWatchlist, setViewingWatchlist] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  const apiKey = "";

  // Search Functionality
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setStocks([]);
    try {
      const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${search}&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.bestMatches) {
        const stockData = data.bestMatches.map((match) => ({
          symbol: match["1. symbol"],
          name: match["2. name"],
          type: match["3. type"],
          region: match["4. region"],
        }));
        setStocks(stockData);
        setViewingWatchlist(false);
      } else {
        setError("No results found.");
      }
    } catch (error) {
      setError("Failed to fetch stock data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Stock Overview
  const fetchOverview = async (symbol) => {
    setLoading(true);
    setError(null);
    setOverview(null);
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      const globalQuote = data["Global Quote"];
      if (globalQuote) {
        setOverview({
          symbol: globalQuote["01. symbol"],
          open: parseFloat(globalQuote["02. open"]).toFixed(2),
          high: parseFloat(globalQuote["03. high"]).toFixed(2),
          low: parseFloat(globalQuote["04. low"]).toFixed(2),
          price: parseFloat(globalQuote["05. price"]).toFixed(2),
volume: globalQuote["06. volume"],
previousClose: parseFloat(globalQuote["08. previous close"]).toFixed(2),
change: parseFloat(globalQuote["09. change"]).toFixed(2),
changePercent: globalQuote["10. change percent"],
});

// Fetch Price History Data
fetchPriceHistory(symbol);
} else {
setError("No overview data available for the selected stock.");
}
} catch (error) {
setError("Failed to fetch stock overview. Please try again.");
} finally {
setLoading(false);
}
};

// Fetch Price History
const fetchPriceHistory = async (symbol) => {
setLoading(true);
setError(null);
setPriceHistory([]);
try {
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
const response = await fetch(url);
const data = await response.json();
const timeSeries = data["Time Series (Daily)"];
if (timeSeries) {
const history = Object.keys(timeSeries)
.slice(0, 10) // Last 10 days
.map((date) => ({
  date,
  close: parseFloat(timeSeries[date]["4. close"]).toFixed(2),
}));
setPriceHistory(history);
} else {
setError("No price history available for the selected stock.");
}
} catch (error) {
setError("Failed to fetch price history. Please try again.");
} finally {
setLoading(false);
}
};

// Add to Watchlist
const addToWatchlist = (stock) => {
if (watchlist.some((item) => item.symbol === stock.symbol)) {
alert("This stock is already in your watchlist.");
} else {
setWatchlist((prevWatchlist) => [...prevWatchlist, stock]);
}
};

// View Watchlist
const viewWatchlist = () => {
setViewingWatchlist(true);
};

// Confirm Buy
const confirmBuy = () => {
if (!overview) {
alert("Select a stock before buying.");
return;
}
const existingHolding = holdings.find((holding) => holding.symbol === overview.symbol);
if (existingHolding) {
const updatedHoldings = holdings.map((holding) =>
holding.symbol === overview.symbol
? {
    ...holding,
    quantity: holding.quantity + parseInt(buyQuantity, 10),
    avgCost:
      (holding.avgCost * holding.quantity +
                overview.price * parseInt(buyQuantity, 10)) /
                (holding.quantity + parseInt(buyQuantity, 10)).toFixed(2),
              ltp: overview.price,
              currentValue: (
                (holding.quantity + parseInt(buyQuantity, 10)) *
                overview.price
              ).toFixed(2),
              pnl: (
                (overview.price -
                  ((holding.avgCost * holding.quantity +
                    overview.price * parseInt(buyQuantity, 10)) /
                    (holding.quantity + parseInt(buyQuantity, 10))) *
                  (holding.quantity + parseInt(buyQuantity, 10))).toFixed(2)
              ),
            }
          : holding
      );
      setHoldings(updatedHoldings);
    } else {
      const newHolding = {
        ...overview,
        quantity: parseInt(buyQuantity, 10),
        avgCost: overview.price,
        ltp: overview.price,
        currentValue: (overview.price * buyQuantity).toFixed(2),
        pnl: 0,
      };
      setHoldings((prevHoldings) => [...prevHoldings, newHolding]);
    }
    alert(`Purchased ${buyQuantity} shares of ${overview.symbol}`);
  };

  // Download Holdings as CSV
  const downloadCSV = () => {
    const csvData = holdings.map(
      (holding) =>
        `${holding.symbol},${holding.quantity},${holding.avgCost},${holding.ltp},${holding.currentValue},${holding.pnl}`
    );
    const csvHeader = "Symbol,Quantity,Avg Cost,LTP,Current Value,P&L\n";
    const csvContent = csvHeader + csvData.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "holdings.csv";
    link.click();
  };

  // Save Watchlist as CSV
  const saveWatchlist = () => {
    const csvData = watchlist.map(
      (stock) => `${stock.symbol},${stock.name},${stock.type},${stock.region}`
    );
    const csvHeader = "Symbol,Name,Type,Region\n";
    const csvContent = csvHeader + csvData.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "watchlist.csv";
    link.click();
  };

  return (
    <div className="portfolio-container">
      <h2>My Portfolio</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Stock..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={viewWatchlist}>View Watchlist</button>
        <button onClick={saveWatchlist}>❤️ Save Watchlist</button>
     
        </div>

{loading && <p>Loading...</p>}
{error && <p className="error-message">{error}</p>}

{!viewingWatchlist && (
  <>
    <h3>Search Results</h3>
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Type</th>
          <th>Region</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((stock, index) => (
          <tr key={index}>
            <td>{stock.symbol}</td>
            <td>{stock.name}</td>
            <td>{stock.type}</td>
            <td>{stock.region}</td>
            <td>
              <button onClick={() => fetchOverview(stock.symbol)}>
                View Overview
              </button>
              <button onClick={() => addToWatchlist(stock)}>
                Add to Watchlist
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)}

{viewingWatchlist && (
  <>
    <h3>Watchlist</h3>
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Type</th>
          <th>Region</th>
        </tr>
      </thead>
      <tbody>
        {watchlist.map((stock, index) => (
          <tr key={index}>
            <td>{stock.symbol}</td>
            <td>{stock.name}</td>
            <td>{stock.type}</td>
            <td>{stock.region}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)}

{overview && !viewingWatchlist && (
  <div className="stock-overview">
    <h3>Stock Overview: {overview.symbol}</h3>
    <p>
      <strong>Open:</strong> ${overview.open}
    </p>
    <p>
      <strong>High:</strong> ${overview.high}
    </p>
    <p>
      <strong>Low:</strong> ${overview.low}
    </p>
    <p>
      <strong>Price:</strong> ${overview.price}
    </p>
    <p>
      <strong>Volume:</strong> {overview.volume}
    </p>
    <p>
      <strong>Previous Close:</strong> ${overview.previousClose}
    </p>
    <p>
      <strong>Change:</strong> ${overview.change}
    </p>
    <p>
      <strong>Change Percent:</strong> {overview.changePercent}
    </p>
    <input
      type="number"
      min="1"
      value={buyQuantity}
      onChange={(e) => setBuyQuantity(e.target.value)}
    />
    <button onClick={confirmBuy}>Confirm Buy</button>
  </div>
)}

{priceHistory.length > 0 && (
  <div className="price-history">
    <h3>Price History (Last 10 Days)</h3>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Close Price</th>
        </tr>
      </thead>
      <tbody>
        {priceHistory.map((entry, index) => (
          <tr key={index}>
            <td>{entry.date}</td>
            <td>${entry.close}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

<h3>My Holdings</h3>
<table>
  <thead>
    <tr>
      <th>Symbol</th>
      <th>Quantity</th>
      <th>Avg Cost</th>
      <th>LTP</th>
      <th>Current Value</th>
      <th>P&L</th>
    </tr>
  </thead>
  <tbody>
    {holdings.map((holding, index) => (
      <tr key={index}>
        <td>{holding.symbol}</td>
        <td>{holding.quantity}</td>
        <td>${holding.avgCost}</td>
        <td>${holding.ltp}</td>
        <td>${holding.currentValue}</td>
        <td>${holding.pnl}</td>
      </tr>
    ))}
  </tbody>
</table>
<button onClick={downloadCSV}>Download Holdings as CSV</button>
</div>
);
};

export default Portfolio;