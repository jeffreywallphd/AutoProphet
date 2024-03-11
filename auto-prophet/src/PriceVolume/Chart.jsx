import React from "react";
import { LineChart, XAxis, YAxis, Tooltip, Line } from "recharts";

function DataCharts(props) {

    return(<>
        <div> 
                <h1>{props.data["MetaData"]["company"]} ({props.data["MetaData"]["ticker"]})</h1>

                {/* A button group that will eventually be clickable to change the chart timeframe. */}
                <div className="btn-group">
                    <button disabled={true}>1D</button>
                    <button>5D</button>
                    <button>1M</button>
                    <button>6M</button>
                    <button>1Y</button>
                    <button>5Y</button>
                </div>

                <p>Price data for {props.data["MetaData"]["lastUpdatedDate"]}</p>

                {/* The actual chart displaying the data from recharts */}
                <LineChart width={730} height={250} data={props.data["Data"]}>
                    <XAxis dataKey="time" />
                    <YAxis type="number" domain={['dataMin', 'dataMax']}/>
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#8884d8" />
                </LineChart>
            </div>
    </>);
} 

export { DataCharts }