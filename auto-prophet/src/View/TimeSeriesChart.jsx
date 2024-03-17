import React from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function TimeSeriesChart(props) {
    //TODO: calculate a max value for the y-axis that adds a little padding to top of graph    
    //TODO: set the min value for the x-axis to 9:00 AM and the max value to 5:00 PM
    return(<>
        <div> 
                <h3>{props.data.response.results[0]["companyName"]} ({props.data.response.results[0]["ticker"]})</h3>

                {/* A button group that will eventually be clickable to change the chart timeframe. */}
                <div className="btn-group">
                    <button disabled={true}>1D</button>
                    <button>5D</button>
                    <button>1M</button>
                    <button>6M</button>
                    <button>1Y</button>
                    <button>5Y</button>
                </div>

                <p>Price data for {props.data.response.results[0]["data"][0].date}</p>

                {/* The actual chart displaying the data from recharts */}
                <AreaChart width={800} height={300} data={props.data.response.results[0]["data"]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#62C0C2" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#62C0C2" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="time" />
                    <YAxis type="number" domain={['dataMin', 'dataMax']} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="price" stroke="#62C0C2" fillOpacity={1} fill="url(#colorArea)" dot={false}/>
                </AreaChart>
                <BarChart width={800} height={100} data={props.data.response.results[0]["data"]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 'dataMax']} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar type="monotone" dataKey="volume" fill="#62C0C2"/>
                </BarChart> 
            </div>
    </>);
} 

export { TimeSeriesChart }