import React, { Component } from "react";
import { SearchBar } from "./SearchBar";
import { DataCharts } from "./Chart";
import {ProgressBar} from 'react-loader-spinner'

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
                <SearchBar data={this.state.ChartData} onDataChange={this.handleDataChange}/>
                {chartDisplay}
            </div>
        );
    }
}

export default Price;