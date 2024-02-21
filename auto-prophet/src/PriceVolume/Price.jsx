import React, { Component } from "react";
import { SearchBar } from "./SearchBar";
import { DataCharts } from "./Chart";

class Price extends Component {
    state = {
        ChartData: null
    };

    handleDataChange = (ChartData) => {
        this.setState({ ChartData });
    }

    render() {
        return (
            <div className="page">
                <SearchBar data={this.state.ChartData} onDataChange={this.handleDataChange}/>
                <DataCharts data={this.state.ChartData}/>
            </div>
        );
    }
}

export default Price;