import React, { useState, useEffect } from "react";
import { AreaChart, LineChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine} from "recharts";

function RSIChart(props) {

  const [rsiValues, setRsiValues] = useState([]);
  const [header, setHeader] = useState("Search for a company");
  const [data, SetData] =useState([]);


  const calculateRSI = (prices, period) => {
    try{
      const rsiValues = [];
      let gains = 0;
      let losses = 0;

      console.log("Calculating RSI with period:", period);
      console.log("Prices:", prices);


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

      console.log("Initial avgGain:", avgGain, "Initial avgLoss:", avgLoss);

      for (let i = period; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) {
          avgGain = ((avgGain * (period - 1)) + change) / period;
          avgLoss = ((avgLoss * (period - 1))) / period;
        } else {
          avgGain = (avgGain * (period - 1)) / period;
          avgLoss = ((avgLoss * (period - 1)) - change) / period;
          console.log("Initial avgGain:", avgGain, "Initial avgLoss:", avgLoss);

        }

        const rs = avgGain / Math.max(avgLoss, 0.00001);
        const rsi = 100 - (100 / (1 + rs));

        rsiValues.push({ rsi, date: props.state.data.response.results[0]["data"][i].date });
        console.log("Index:", i, "Change:", change, "avgGain:", avgGain, "avgLoss:", avgLoss, "RS:", rs, "RSI:", rsi);
      }

      return rsiValues;
    } catch (error) {
      console.log("Error calculating RSI: ",error);
      return[];
    }
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

    if (!props.state.data) return ;
      try{
      
        const prices = props.state.data.response.results[0]["data"].map(
          (item) => item.price
        );

        // Map intervals to RSI periods
        const calculateDynamicPeriod = (interval) => {
          const dataLength = prices.length;
          switch (interval) {
            case "5D":
              return Math.floor(dataLength * 0.1); // Use 10% of the data
            case "1M":
              return Math.floor(dataLength * 0.2); // Use 20% of the data
            case "6M":
              return Math.floor(dataLength * 0.3); // Use 30% of the data
            case "1Y":
              return Math.floor(dataLength * 0.4); // Use 40% of the data
            case "5Y":
              return Math.floor(dataLength * 0.5); // Use 50% of the data
            case "Max":
            default:
              return dataLength - 1; // Use all the data
          }
        };

        const period = calculateDynamicPeriod(props.state.interval);
        console.log("Selected interval:", props.state.interval, "Period:", period);

        const newRsiValues = calculateRSI(prices, period);

        setHeader(`${props.state.data.response.results[0]["companyName"]} (${props.state.data.response.results[0]["ticker"]})`);
        SetData(props.state.data.response.results[0]["data"])
        setRsiValues(newRsiValues);

        console.log("New RSI values:", newRsiValues);
        
      } catch (error){
        console.error("Error in useEffect: ",error);
      } 
    
  }, [props.state.data, props.state.interval]);

  return (
    <>
      <div className="chartContainer">
        <h3>{header} - RSI ({props.state.interval})</h3>
        
        <div className="btn-group">
          {props.state.data ? 
          (<>
                <button disabled={props.state.interval === "5D"} onClick={() => setInterval("5D")}>5D</button>
                <button disabled={props.state.interval === "1M"} onClick={() => setInterval("1M")}>1M</button>
                <button disabled={props.state.interval === "6M"} onClick={() => setInterval("6M")}>6M</button>
                <button disabled={props.state.interval === "1Y"} onClick={() => setInterval("1Y")}>1Y</button>
                <button disabled={props.state.interval === "5Y"} onClick={() => setInterval("5Y")}>5Y</button>
                <button disabled={props.state.interval === "Max"} onClick={() => setInterval("Max")}>Max</button>
            </>) : 
            (<>
              <button disabled={true}>5D</button>
              <button disabled={true}>1M</button>
              <button disabled={true}>6M</button>
              <button disabled={true}>1Y</button>
              <button disabled={true}>5Y</button>
              <button disabled={true}>Max</button>
            </>
          )}
        </div>

        <LineChart width={700} height={300} key="rsiChart" data={rsiValues} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {/* <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#62C0C2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#62C0C2" stopOpacity={0}/>
                </linearGradient>
            </defs> */}
            <XAxis dataKey = "date" domain={[props.state.yAxisStart, props.state.yAxisEnd]}/>
            <YAxis domain={[0, 100]}/>
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <Tooltip />
            <Line type="monotone" dataKey="rsi" stroke="#62C0C2" fillOpacity={1} fill="url(#colorArea)" dot={false}/>
            {/* Add reference lines for oversold (30%) and overbought (70%) */}
            <ReferenceLine y={30} stroke="red" strokeDasharray="3 3" label={{ value: 'Oversold < 30%', position: 'insideRight', fill: 'red', fontSize: 12 }} />
            <ReferenceLine y={70} stroke="green" strokeDasharray="3 3" label={{ value: 'Overbought > 70%', position: 'insideRight', fill: 'green', fontSize: 12 }} />

            
        </LineChart>
      </div>
    </>);        
  }

export { RSIChart };

