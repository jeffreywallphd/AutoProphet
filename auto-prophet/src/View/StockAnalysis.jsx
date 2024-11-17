import React, { useState } from 'react';
import '../index.css';
import { Line } from 'react-chartjs-2';
import { saveAs } from 'file-saver';

const StockAnalysis = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const stockData = [
    {
      ticker: 'META',
      exchange: 'NASDAQ',
      companyName: 'Meta Platforms Inc',
      lastPrice: '$504.79',
      todaysChange: '--',
      schwabRating: 'B',
      open: '$508.16',
      bid: '$504.26',
      ask: '$504.77',
      daysRange: '$500.03 - $514.18',
      fiftyTwoWeekRange: '$279.40 - $544.23',
      todaysVolume: '9,899,022',
      averageVolume: '9,799,034',
      annualDividendYield: '0.40%',
      asOfDate: 'As of close Tuesday, 09/10/2024'
    },
    {
      ticker: 'GOOGL',
      exchange: 'NASDAQ',
      companyName: 'Alphabet Inc',
      lastPrice: '$148.66',
      todaysChange: '-0.05 (-0.03%)',
      schwabRating: 'A',
      open: '$150.45',
      bid: '$148.75',
      ask: '$148.85',
      daysRange: '$148.34 - $151.27',
      fiftyTwoWeekRange: '$120.21 - $191.75',
      todaysVolume: '31,118,765',
      averageVolume: '25,308,878',
      annualDividendYield: '0.54%',
      asOfDate: 'As of close Tuesday, 09/10/2024'
    },
    {
      ticker: 'BIDU',
      exchange: 'NASDAQ',
      companyName: 'Baidu Inc',
      lastPrice: '$82.05',
      todaysChange: '0.42 (0.51%)',
      schwabRating: 'NC',
      open: '$82.17',
      bid: '$81.89',
      ask: '$82.08',
      daysRange: '$80.81 - $82.42',
      fiftyTwoWeekRange: '$79.68 - $140.93',
      todaysVolume: '1,808,274',
      averageVolume: '1,789,601',
      annualDividendYield: '--',
      asOfDate: 'As of close Tuesday, 09/10/2024'
    },
    {
      ticker: 'MTCH',
      exchange: 'NASDAQ',
      companyName: 'Match Group Inc',
      lastPrice: '$36.26',
      todaysChange: '0.23 (0.64%)',
      schwabRating: 'C',
      open: '$36.34',
      bid: '$35.76',
      ask: '$36.47',
      daysRange: '$35.76 - $36.44',
      fiftyTwoWeekRange: '$27.66 - $44.87',
      todaysVolume: '4,165,084',
      averageVolume: '3,387,283',
      annualDividendYield: '--',
      asOfDate: 'As of close Tuesday, 09/10/2024'
    }
  ];

  const handleSearch = () => {
    const result = stockData.find(stock => stock.ticker.toLowerCase() === searchTerm.toLowerCase());
    setSearchResult(result);
  };

  const handleExport = (type) => {
    if (type === 'csv') {
      const headers = Object.keys(stockData[0]).join(',');
      const rows = stockData.map(stock => Object.values(stock).join(',')).join('\n');
      const csvString = `${headers}\n${rows}`;
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'stock_data.csv');
    } else if (type === 'pdf') {
      // Placeholder for PDF export logic
      alert('PDF export functionality is not yet implemented.');
    }
  };

  return (
    <div className="stock-analysis">
      <div className="search-bar" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by ticker symbol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '300px', height: '30px', padding: '5px', fontSize: '16px' }}
        />
        <button onClick={handleSearch} style={{ marginLeft: '10px', padding: '5px 15px', fontSize: '16px' }}>Search</button>
      </div>
      {searchResult && (
        <div className="search-result">
          <h3>{searchResult.companyName} ({searchResult.ticker})</h3>
          <p>Last Price: {searchResult.lastPrice}</p>
          <p>Today's Change: {searchResult.todaysChange}</p>
          <p>Open: {searchResult.open}</p>
          <p>Bid: {searchResult.bid}</p>
          <p>Ask: {searchResult.ask}</p>
          <div className="stock-chart">
            <Line
              data={{
                labels: ['Open', 'Bid', 'Ask'],
                datasets: [
                  {
                    label: `Price Data for ${searchResult.ticker}`,
                    data: [
                      parseFloat(searchResult.open.replace('$', '')),
                      parseFloat(searchResult.bid.replace('$', '')),
                      parseFloat(searchResult.ask.replace('$', '')),
                    ],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                  },
                ],
              }}
            />
          </div>
        </div>
      )}
      <table className="stock-table">
        <thead>
          <tr>
            <th>Description</th>
            {stockData.map((stock) => (
              <th key={stock.ticker}>
                <div>
                  {stock.ticker}: {stock.exchange}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Company Name</td>
            {stockData.map((stock) => (
              <td key={stock.ticker}>{stock.companyName}</td>
            ))}
          </tr>
          <tr>
            <td>Last Price</td>
            {stockData.map((stock) => (
              <td key={stock.ticker}>{stock.lastPrice}</td>
            ))}
          </tr>
          <tr>
            <td>Today's Change</td>
            {stockData.map((stock) => (
              <td key={stock.ticker}>{stock.todaysChange}</td>
            ))}
          </tr>
          <tr>
            <td>Schwab Equity Rating®</td>
            {stockData.map((stock) => (
              <td key={stock.ticker}>{stock.schwabRating}</td>
            ))}
          </tr>
          <tr>
            <td>Open</td>
            {stockData.map((stock) => (
              <td key={stock.ticker}>{stock.open}</td>
            ))}
          </tr>
          <tr>
            <td>Bid</td>
            {stockData.map((stock) => (
              <td key={stock.ticker}>{stock.bid}</td>
            ))}
          </tr>
          <tr>
            <td>Ask</td>
            {stockData.map((stock) => (
              <td key={stock.ticker}>{stock.ask}</td>
            ))}
          </tr>
          <tr>
            <td>Day's Range</td>
            {stockData.map((stock) => (
              <td key={stock.ticker}>{stock.daysRange}</td>
            ))}
          </tr>
          <tr>
            <td>52 Week Range</td>
            {stockData.map((stock) => (
              <td key={stock.ticker}>{stock.fiftyTwoWeekRange}</td>
            ))}
          </tr>
          <tr>
            <td>Today's Volume</td>
            {stockData.map((stock) => (
              <td key={stock.ticker}>{stock.todaysVolume}</td>
            ))}
          </tr>
          <tr>
            <td>Average Volume</td>
            {stockData.map((stock) => (
              <td key={stock.ticker}>{stock.averageVolume}</td>
            ))}
          </tr>
          <tr>
            <td>Annual Dividend Yield</td>
            {stockData.map((stock) => (
              <td key={stock.ticker}>{stock.annualDividendYield}</td>
            ))}
          </tr>
          <tr>
            <td colSpan={stockData.length + 1} className="as-of-date">
              {stockData[0].asOfDate}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="export-buttons" style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={() => handleExport('csv')} style={{ marginRight: '10px', padding: '10px 20px', fontSize: '16px' }}>Export to CSV</button>
        <button onClick={() => handleExport('pdf')} style={{ padding: '10px 20px', fontSize: '16px' }}>Export to PDF</button>
      </div>
    </div>
  );
};

export default StockAnalysis;
