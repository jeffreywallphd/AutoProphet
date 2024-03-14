import React, { Component } from "react";
import { SearchBar } from "./SearchBar";
import { DataCharts } from "./Chart";
import { SearchBarNew } from "../View/SearchBarNew";

class Price extends Component {
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
            chartDisplay = <p>Error! Invalid ticker!</p>
        } else if (this.state.ChartData) {
            chartDisplay = <DataCharts data={this.state.ChartData}/>;
        } else {
            chartDisplay = null;
        }

        return (
            <div className="page">
                <SearchBarNew data={this.state.ChartData} onDataChange={this.handleDataChange}/>
                {chartDisplay}
            </div>
        );
    }
}

export default Price;