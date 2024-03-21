// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { Component } from "react";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { TickerSearchBar } from "./TickerSearchBar";

class TimeSeriesPage extends Component {
    constructor(props) {
        super(props);
    }

    //set default state for search bar and chart
    state = {
        initializing: true,
        data: null,
        error: null,
        type: 'intraday',
        interval: '1D',
        securitiesList: null,
        searchRef: null,
        isLoading: false,
        minPrice: null,
        maxPrice: null,
        maxVolume: null,
        yAxisStart: null,
        yAxisEnd: null
    };

    //Used to pass data from the search bar to the chart
    handleDataChange = (state) => {
        this.setState(state);
    }

    //used to pass interval changes from button clicks on chart
    handleIntervalChange = (state) => {
        this.setState(state);
    }

    render() {        
        return (
                <div className="page">
                    <h2>Price and Volume Trends</h2>
                    <TickerSearchBar state={this.state} onDataChange={this.handleDataChange}/>
                    {/* Use a ternary operator for concise conditional rendering */}
                    { this.state.data ? (
                        <TimeSeriesChart state={this.state} onIntervalChange={this.handleIntervalChange} />
                    ) : this.state.isLoading === true ? (
                        <p>Loading...</p>
                    ) : this.state.error ? (
                        <p>The ticker you entered is not valid. Please choose a valid ticker.</p>
                    ) : (null)}
                </div>
        );
    }
}

// In case hooks are needed for this class. Can remove later if not necessary
export function TimeSeries() {
    return <TimeSeriesPage />
};