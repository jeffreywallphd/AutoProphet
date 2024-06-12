import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function MovingAvgChart(props) {
  const [smaValues, setSmaValues] = useState([]);
  const [emaValues, setEmaValues] = useState([]);
  const [header, setHeader] = useState("Search for a company");
  const [chartData, setChartData] = useState([]);
  // const [data, setData] = useState([]);
  const [yAxisDomain, setYAxisDomain] = useState([0, 0]);

  const calculateSMA = (prices, period) => {
    const smaValues = [];
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      const sma = sum / period;
      smaValues.push({ sma, date: props.state.data.response.results[0]["data"][i].date });
    }
    return smaValues;
  };

  const calculateEMA = (prices, period) => {
    const emaValues = [];
    const k = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period; // First EMA value (SMA for the first period)
    emaValues.push({ ema, date: props.state.data.response.results[0]["data"][period - 1].date });

    for (let i = period; i < prices.length; i++) {
      ema = prices[i] * k + ema * (1 - k);
      emaValues.push({ ema, date: props.state.data.response.results[0]["data"][i].date });
    }
    return emaValues;
  };

  const setInterval = (selectedInterval) => {
    const type = "interday";

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
    if (!props.state.data) return;
    try {
      const originalData = props.state.data.response.results[0]["data"];
      const prices = props.state.data.response.results[0]["data"].map(
        (item) => item.price
    );

      const calculateDynamicPeriod = (interval) => {
        const dataLength = prices.length;
        switch (interval) {
          // case "5D":
          //   return Math.floor(dataLength * 0.1); // Use 10% of the data
          case "1M":
          default:
            return Math.floor(dataLength * 0.2); // Use 20% of the data
          case "6M":
            return Math.floor(dataLength * 0.3); // Use 30% of the data
          case "1Y":
            return Math.floor(dataLength * 0.4); // Use 40% of the data
          case "5Y":
            return Math.floor(dataLength * 0.5); // Use 50% of the data
          // case "Max":
          // default:
          //   return dataLength - 1; // Use all the data
        }
      };

      const period = calculateDynamicPeriod(props.state.interval);
      console.log("Selected interval:", props.state.interval, "Period:", period);

      const newSmaValues = calculateSMA(prices, period);
      const newEmaValues = calculateEMA(prices, period);

       // Merge original data with SMA and EMA values
       const mergedData = originalData.map((item, index) => {
        const sma = newSmaValues.find(s => s.date === item.date)?.sma || null;
        const ema = newEmaValues.find(e => e.date === item.date)?.ema || null;
        return { ...item, sma, ema };
      });

      setHeader(`${props.state.data.response.results[0]["companyName"]} (${props.state.data.response.results[0]["ticker"]})`);
      setChartData(mergedData);
      // Calculate the y-axis boundaries
      const allValues = prices.concat(newSmaValues.map(d => d.sma), newEmaValues.map(d => d.ema));
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      setYAxisDomain([minValue, maxValue]);

    } catch (error) {
      console.error("Error in useEffect: ", error);
    }
  }, [props.state.data, props.state.interval]);

  return (
    <div className="chartContainer">
      <h3>{header} - Moving Averages ({props.state.interval})</h3>
      <div className="btn-group">
          {props.state.data ? 
          (<>
                {/* <button disabled={props.state.interval === "5D" ? true:false} onClick={(e) => setInterval("5D")}>5D</button> */}
                <button disabled={props.state.interval === "1M" ? true:false} onClick={(e) => setInterval("1M")}>1M</button>
                <button disabled={props.state.interval === "6M" ? true:false} onClick={(e) => setInterval("6M")}>6M</button>
                <button disabled={props.state.interval === "1Y" ? true:false} onClick={(e) => setInterval("1Y")}>1Y</button>
                <button disabled={props.state.interval === "5Y" ? true:false} onClick={(e) => setInterval("5Y")}>5Y</button>
                {/* <button disabled={props.state.interval === "Max" ? true:false} onClick={(e) => setInterval("Max")}>Max</button> */}
            </>) : 
            (<>
              {/* <button disabled={true}>5D</button> */}
              <button disabled={true}>1M</button>
              <button disabled={true}>6M</button>
              <button disabled={true}>1Y</button>
              <button disabled={true}>5Y</button>
              {/* <button disabled={true}>Max</button> */}
            </>
          )}
       </div>
      <LineChart width={700} height={300} data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <XAxis dataKey="date" />
        <YAxis domain={yAxisDomain} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
        <Line type="monotone" dataKey="sma" data={smaValues} stroke="#82ca9d" dot={false} />
        <Line type="monotone" dataKey="ema" data={emaValues} stroke="#ffc658" dot={false} />
      </LineChart>
    </div>
  );
}

export { MovingAvgChart };
