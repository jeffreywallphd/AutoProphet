import React, { Component } from "react";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { TickerSearchBar } from "./TickerSearchBar";

class TimeSeriesPage extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        data: null,
        error: null,
        type: 'intraday',
        interval: '1D',
        isLoading: false,
    };

    //Used to pass data from the search bar to the chart
    handleDataChange = (state) => {
        this.setState(state);
    }

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