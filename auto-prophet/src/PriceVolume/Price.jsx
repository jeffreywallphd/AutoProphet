import React, { Component } from "react";
import { SearchBar } from "./SearchBar";
import { DataCharts } from "./Chart";

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
        return (
            <div className="page">
                <SearchBar data={this.state.ChartData} onDataChange={this.handleDataChange}/>
                {
                    this.state.ChartData ?
                    <DataCharts data={this.state.ChartData}/>
                    : null
                }
                
            </div>
        );
    }
}

export default Price;