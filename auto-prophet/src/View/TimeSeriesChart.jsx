import React, { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function TimeSeriesChart(props) {
    setInterval = (selectedInterval) => {
        var type;
        if(selectedInterval === "1D") {
            type = "intraday";
        } else {
            type = "interday";
        }

        props.onIntervalChange({
            data: null,
            error: props.state.error,
            type: type,
            interval: selectedInterval,
            isLoading: false
        });
    };

    var priceMin;
    var priceMax;
    var volumeMax;

    useEffect(() => {
        priceMin = Math.min(...props.state.data.response.results[0]["data"].map(data => data.price));
        priceMax = Math.max(...props.state.data.response.results[0]["data"].map(data => data.price));
        volumeMax = Math.max(...props.state.data.response.results[0]["data"].map(data => data.volume));
        alert(`Price Min: ${priceMin} Price Max: ${priceMax} Volume Max: ${volumeMax}`);
    }, [props.state.data]);


    //TODO: calculate a max value for the y-axis that adds a little padding to top of graph    
    //TODO: set the min value for the x-axis to 9:00 AM and the max value to 5:00 PM
    return(<>
            <div>
                <h3>{props.state.data.response.results[0]["companyName"]} ({props.state.data.response.results[0]["ticker"]})</h3>

                {/* A button group that will eventually be clickable to change the chart timeframe. */}
                <div className="btn-group">
                    <button disabled={props.state.interval === "1D" ? true: false} onClick={(e) => setInterval("1D")}>1D</button>
                    <button disabled={props.state.interval === "5D" ? true: false} onClick={(e) => setInterval("5D")}>5D</button>
                    <button disabled={props.state.interval === "1M" ? true: false} onClick={(e) => setInterval("1M")}>1M</button>
                    <button disabled={props.state.interval === "6M" ? true: false} onClick={(e) => setInterval("6M")}>6M</button>
                    <button disabled={props.state.interval === "1Y" ? true: false} onClick={(e) => setInterval("1Y")}>1Y</button>
                    <button disabled={props.state.interval === "5Y" ? true: false} onClick={(e) => setInterval("5Y")}>5Y</button>
                    <button disabled={props.state.interval === "Max" ? true: false} onClick={(e) => setInterval("Max")}>Max</button>
                </div>

                <p>{props.state.interval} Price data for {props.state.data.response.results[0]["data"][0].date}</p>

                {/* The actual chart displaying the data from recharts */}
                <AreaChart width={600} height={400} key="timeSeries" data={props.state.data.response.results[0]["data"]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#62C0C2" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#62C0C2" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="time" />
                    <YAxis type="number" domain={[priceMin, priceMax]} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="price" stroke="#62C0C2" fillOpacity={1} fill="url(#colorArea)" dot={false}/>
                </AreaChart>
                <BarChart width={600} height={100} data={props.state.data.response.results[0]["data"]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, volumeMax]} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar type="monotone" dataKey="volume" fill="#62C0C2"/>
                </BarChart>
            </div>
    </>);
} 

export { TimeSeriesChart }