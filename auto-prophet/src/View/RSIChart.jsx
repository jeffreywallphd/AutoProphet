import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function RSIChart(props) {

  const [rsiValues, setRsiValues] = useState([]);
  const [period, setPeriod] = useState(14); // Default RSI period
  const [header, setHeader] = useState("Search for a company");

  const calculateRSI = (prices, period) => {
    const gains = [];
    const losses = [];

    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) {
        gains.push(change);
        losses.push(0);
      } else {
        gains.push(0);
        losses.push(-change);
      }
    }

    const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;

    const rs = avgGain / Math.max(avgLoss, 0.00001);
    const rsi = 100 - (100 / (1 + rs));

    return rsi;
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const setInterval = (selectedInterval) => {
    const type = selectedInterval === "1D" ? "intraday" : "interday";

    //set interval properties
    props.handleDataChange({
      ...props.state,
      initializing: false,
      type: type,
      interval: selectedInterval,
      isLoading: false
    });
  };

  useEffect(() => {
    if (props.state.data) {
      const prices = props.state.data.response.results[0]["data"].map(
        (item) => item.price
      );
      const newRsi = calculateRSI(prices, period);
      setHeader(`${props.state.data.response.results[0]["companyName"]} (${props.state.data.response.results[0]["ticker"]})`);
      setRsiValues(newRsi);
    }
  }, [props.state.data, period]);

  // ... existing code for setInterval, header

  return (
    <>
      <div className="chartContainer">
        <h3>{header} - RSI ({period})</h3>
        
        <div className="btn-group">
          {props.state.data ? 
          (<>
                <button disabled={props.state.interval === "1D" ? true: false} onClick={(e) => setInterval("1D")}>1D</button>
                <button disabled={props.state.interval === "5D" ? true: false} onClick={(e) => setInterval("5D")}>5D</button>
                <button disabled={props.state.interval === "1M" ? true: false} onClick={(e) => setInterval("1M")}>1M</button>
                <button disabled={props.state.interval === "6M" ? true: false} onClick={(e) => setInterval("6M")}>6M</button>
                <button disabled={props.state.interval === "1Y" ? true: false} onClick={(e) => setInterval("1Y")}>1Y</button>
                <button disabled={props.state.interval === "5Y" ? true: false} onClick={(e) => setInterval("5Y")}>5Y</button>
                <button disabled={props.state.interval === "Max" ? true: false} onClick={(e) => setInterval("Max")}>Max</button>
            </>) : 
            (<>
              <button disabled={true}>1D</button>
              <button disabled={true}>5D</button>
              <button disabled={true}>1M</button>
              <button disabled={true}>6M</button>
              <button disabled={true}>1Y</button>
              <button disabled={true}>5Y</button>
              <button disabled={true}>Max</button>
              {/* ... similar buttons for disabled state */}
            </>
          )}
        </div>

        <AreaChart width={700} height={300} key="rsiChart" data={rsiValues} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#62C0C2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#62C0C2" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <XAxis dataKey={props.state.type === "intraday" ? "time" : "date"} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <Tooltip />
            <Area type="monotone" dataKey="price" stroke="#62C0C2" fillOpacity={1} fill="url(#colorArea)" dot={false}/>
        </AreaChart>
      </div>
    </>);        
  }

export { RSIChart };
