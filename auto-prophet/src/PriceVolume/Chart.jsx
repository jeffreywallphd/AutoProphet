import React from "react";
import { LineChart, XAxis, YAxis, Tooltip, Line } from "recharts";

function DataCharts(props) {

    return(<>
        <div> 
                <p>From Chart File: Selected {props.data["MetaData"]["ticker"]}</p>

                {/* Edit this section below to change the chart. All info about the charts can be found on recharts website. */}
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