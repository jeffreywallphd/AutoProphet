// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.


import React from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function TimeSeriesChart(props) {
    setInterval = (selectedInterval) => {
        var type;
        if(selectedInterval === "1D") {
            type = "intraday";
        } else {
            type = "interday";
        }

        //set internval properties
        props.handleDataChange({
            ...props.state,
            initializing: false,
            type: type,
            interval: selectedInterval,
            isLoading: false
        });
    };

    var priceMin;
    var priceMax;
    var volumeMax;

    var header = "Search for a Company";
    var data = null;
    var priceMin = 0;

    if(props.state.data) {
        header = `${props.state.data.response.results[0]["companyName"]} (${props.state.data.response.results[0]["ticker"]})`;
        data = props.state.data.response.results[0]["data"];
        priceMin = props.state.priceMin;
    }

    //TODO: calculate a max value for the y-axis that adds a little padding to top of graph    
    //TODO: set the min value for the x-axis to 9:00 AM and the max value to 5:00 PM when intraday data
    return(<>
            <div className="chartContainer">
                <h3>{header}</h3>

                {/* A button group that will eventually be clickable to change the chart timeframe. */}
                <div className="btn-group">
                    { props.state.data ? 
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
                        </>)
                    }
                </div>

                {/* The actual chart displaying the data from recharts */}
                <AreaChart width={700} height={300} key="timeSeries" data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#62C0C2" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#62C0C2" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey={props.state.type === "intraday" ? "time" : "date"} domain={[props.state.yAxisStart, props.state.yAxisEnd]} />
                    <YAxis type="number" domain={[priceMin, props.state.priceMax]} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="price" stroke="#62C0C2" fillOpacity={1} fill="url(#colorArea)" dot={false}/>
                </AreaChart>
                <BarChart width={700} height={100} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey={props.state.type === "intraday" ? "time" : "date"} domain={[props.state.yAxisStart, props.state.yAxisEnd]} />
                    <YAxis domain={[0, props.state.maxVolume]} angle={-45} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar type="monotone" dataKey="volume" fill="#62C0C2"/>
                </BarChart>
            </div>
    </>);
} 

export { TimeSeriesChart }