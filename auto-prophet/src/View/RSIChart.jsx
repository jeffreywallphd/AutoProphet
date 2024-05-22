import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine} from "recharts";

function RSIChart(props) {

  const [rsiValues, setRsiValues] = useState([]);
  const [header, setHeader] = useState("Search for a company");

  // Map intervals to RSI periods
  const intervalToPeriodMap = {
    "1W": 7,   // Example period for 1 day interval
    "2W": 14,
    "1M": 30,
    "6M": 180,
    "1Y": 365,
    "5Y": 900,
    "Max": 1800
  };

  const calculateRSI = (prices, period) => {
    const rsiValues = [];
    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses -= change;
      }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = period; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) {
        avgGain = ((avgGain * (period - 1)) + change) / period;
        avgLoss = ((avgLoss * (period - 1))) / period;
      } else {
        avgGain = (avgGain * (period - 1)) / period;
        avgLoss = ((avgLoss * (period - 1)) - change) / period;
      }

      const rs = avgGain / Math.max(avgLoss, 0.00001);
      const rsi = 100 - (100 / (1 + rs));

      rsiValues.push({ rsi, date: props.state.data.response.results[0]["data"][i].date });
    }

    return rsiValues;
  };

  const setInterval = (selectedInterval) => {
    const type = selectedInterval === "1D" ? "intraday" : "interday";

    // Set interval properties
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
      const period = intervalToPeriodMap[props.state.interval] || 14; // Default to 14 if interval not found
      const newRsiValues = calculateRSI(prices, period);
      setHeader(`${props.state.data.response.results[0]["companyName"]} (${props.state.data.response.results[0]["ticker"]})`);
      setRsiValues(newRsiValues);
    }
  }, [props.state.data, props.state.interval]);

  return (
    <>
      <div className="chartContainer">
        <h3>{header} - RSI ({props.state.interval})</h3>
        
        <div className="btn-group">
          {props.state.data ? 
          (<>
                <button disabled={props.state.interval === "1W"} onClick={() => setInterval("1W")}>1W</button>
                <button disabled={props.state.interval === "2W"} onClick={() => setInterval("2W")}>2W</button>
                <button disabled={props.state.interval === "1M"} onClick={() => setInterval("1M")}>1M</button>
                <button disabled={props.state.interval === "6M"} onClick={() => setInterval("6M")}>6M</button>
                <button disabled={props.state.interval === "1Y"} onClick={() => setInterval("1Y")}>1Y</button>
                <button disabled={props.state.interval === "5Y"} onClick={() => setInterval("5Y")}>5Y</button>
                <button disabled={props.state.interval === "Max"} onClick={() => setInterval("Max")}>Max</button>
            </>) : 
            (<>
              <button disabled={true}>1W</button>
              <button disabled={true}>2W</button>
              <button disabled={true}>1M</button>
              <button disabled={true}>6M</button>
              <button disabled={true}>1Y</button>
              <button disabled={true}>5Y</button>
              <button disabled={true}>Max</button>
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
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <Tooltip />
            <Area type="monotone" dataKey="rsi" stroke="#62C0C2" fillOpacity={1} fill="url(#colorArea)" dot={false}/>
            {/* Add reference lines for oversold (30%) and overbought (70%) */}
            <ReferenceLine y={30} stroke="red" strokeDasharray="3 3" label={{ value: 'Oversold < 30%', position: 'insideRight', fill: 'red', fontSize: 12 }} />
            <ReferenceLine y={70} stroke="green" strokeDasharray="3 3" label={{ value: 'Overbought > 70%', position: 'insideRight', fill: 'green', fontSize: 12 }} />

            
        </AreaChart>
      </div>
    </>);        
  }

export { RSIChart };

