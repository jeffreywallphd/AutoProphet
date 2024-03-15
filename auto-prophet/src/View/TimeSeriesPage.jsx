import React, { Component } from "react";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { TickerSearchBar } from "./TickerSearchBar";

class TimeSeriesPage extends Component {
    //Used to pass data from the search bar to the chart
    state = {
        ChartData: null
    };

    //Used to pass data from the search bar to the chart
    handleDataChange = (ChartData) => {
        this.setState({ ChartData });
    }

    render() {
        //Different dispaly options other than a blank screen while waiting for data or if we get an error from the API
        var chartDisplay = null;
        if (this.state.ChartData == "Loading") {
            chartDisplay = <p>Loading...</p>;
        } else if (this.state.ChartData == "Error") {
            chartDisplay = <p>The ticker you entered is not valid. Please choose a valid ticker.</p>
        } else if (this.state.ChartData) {
            chartDisplay = <TimeSeriesChart data={this.state.ChartData}/>;
        } else {
            chartDisplay = null;
        }

        return (
            <div className="page">
                <TickerSearchBar data={this.state.ChartData} onDataChange={this.handleDataChange}/>
                {chartDisplay}
            </div>
        );
    }
}

export default TimeSeriesPage;