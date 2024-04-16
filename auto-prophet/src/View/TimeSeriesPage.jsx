// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { Component } from "react";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { TickerSearchBar } from "./TickerSearchBar";
import { TickerSidePanel } from "./TickerSidePanel";

class TimeSeriesPage extends Component {
    constructor(props) {
        super(props);
    }

    currentDate = new Date();

    //set default state for search bar and chart
    state = {
        initializing: true,
        data: null,
        dataSource: null,
        secData: null,
        secSource: null,
        error: null,
        ticker: null,
        cik: null,
        type: 'intraday',
        interval: '1D',
        securitiesList: null,
        searchRef: null,
        isLoading: false,
        minPrice: 0,
        maxPrice: 10,
        maxVolume: 1000,
        yAxisStart: new Date(this.currentDate.getDate() - 5).toISOString().split('T')[0],
        yAxisEnd: new Date().toISOString().split('T')[0]
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
                    <div className="flex">
                        <div>
                            <TickerSearchBar state={this.state} onDataChange={this.handleDataChange}/>
                            { this.state.isLoading === true ? (
                                <>
                                    <p>Loading...</p>
                                </>
                            ) : this.state.error ? (
                                <p>The ticker you entered is not valid. Please choose a valid ticker.</p>
                            ) : (<p>Data Source: {this.state.dataSource}</p>)}
                            <TimeSeriesChart state={this.state} onIntervalChange={this.handleIntervalChange} />
                        </div>
                        <div className="sidePanel">
                            { this.state.secData ? (
                                <TickerSidePanel state={this.state} />
                            ) : (null)}
                        </div>
                    </div>
                </div>
        );
    }
}

// In case hooks are needed for this class. Can remove later if not necessary
export function TimeSeries() {
    return <TimeSeriesPage />
};