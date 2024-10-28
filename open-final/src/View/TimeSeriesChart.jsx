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

    var priceMinPadded;
    var priceMaxPadded;
    var volumeMax;

    var header = "Search for a Company";
    var data = null;
    

    if(props.state.data) {
        header = `${props.state.data.response.results[0]["companyName"]} (${props.state.data.response.results[0]["ticker"]})`;
        data = props.state.data.response.results[0]["data"];

        if((props.state.priceMax - props.state.priceMin) > 1.5) {
            //round to nearest dollar when difference between max and min price is in dollars
            //set min to 0 if max-min is less than 0
            priceMinPadded = (Math.floor(props.state.priceMin - ((props.state.priceMax - props.state.priceMin) * 0.2))) > 0 ? Math.round(props.state.priceMin - ((props.state.priceMax - props.state.priceMin) * 0.2)): 0;
            priceMaxPadded = Math.ceil(props.state.priceMax + ((props.state.priceMax - props.state.priceMin) * 0.2));
        } else {
            //round to nearest cent  mwhen difference between max and min price is in cents
            //set min to 0 if max-min is less than 0
            priceMinPadded = (Math.round((props.state.priceMin - ((props.state.priceMax - props.state.priceMin) * 0.2)) * 100)/100) > 0 ? Math.round((props.state.priceMin - ((props.state.priceMax - props.state.priceMin) * 0.2)) * 100)/100 : 0;
            priceMaxPadded = Math.round((props.state.priceMax + ((props.state.priceMax - props.state.priceMin) * 0.2)) * 100)/100;
        }
        
        
    }

    //evenly spaces the ticks of the time series chart by putting the ticks in a fixed intervall into Array "ticks" determined by tickCount
    const tickCount = 4;
    const tickInterval = (priceMaxPadded - priceMinPadded) / (tickCount - 1);
    const ticks = Array.from({ length: tickCount }, (_, index) => (priceMinPadded + tickInterval * index).toFixed(2));


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
                    <YAxis type="number" domain={[priceMinPadded, priceMaxPadded]} ticks={ticks}/>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
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