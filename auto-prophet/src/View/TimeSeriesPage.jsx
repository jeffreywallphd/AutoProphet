// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { Component } from "react";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { TickerSearchBar } from "./TickerSearchBar";
import { CacheManager } from "../Utility/CacheManager";
import { TickerSidePanel } from "./TickerSidePanel";

class TimeSeriesPage extends Component {
    constructor(props) {
        super(props);
    }

    cacheManager = new CacheManager();

    //set default state for search bar and chart
    state = {
        initializing: true,
        data: null,
        secData: null,
        error: null,
        ticker: null,
        cik: null,
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
        window.terminal.log(state);
        this.setState(state);
    }

    //used to pass interval changes from button clicks on chart
    handleIntervalChange = (state) => {
        this.setState(state);
    }

    manageTickerCikMapCache = async (selectedTicker) => {
        const date = new Date();
        
        try {
            //get any cached data that exists
            const cacheFilePath = `sec/${selectedTicker.toLowerCase().charAt(0)}/sec.json`;
            const secCache = this.cacheManager.extractSync(cacheFilePath);
    
            // throw errors when data isn't complete to trigger caching
            parsedData = JSON.parse(secCache);
            if (parsedData.lastCached === undefined) {
                throw Error("The cache of mapping between ticker symbols and CIK numbers is empty");
            }

            // Calculate last time cache was updated in milliseconds; convert to days
            const lastCachedDate = new Date(parsedData.lastCached);
            const timeDiff = Math.abs(date.getTime() - lastCachedDate.getTime());
            const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            // Re-cache particular folder data map if more than 7 days old
            if (dayDiff > 7) {
                throw Error("The cache is outdated");
            }
        } catch (error) {
            this.alterCache();
        }
    };

    alterCache = async () => {
        const date = new Date();
        // If cached data is unavailable or invalid, fetch from SEC
        const response = await fetch('https://www.sec.gov/include/ticker.txt');
        const secTextData = await response.text();

        const secData = {lastCached: date.toLocaleDateString(), data: {}};

        // Parse the SEC text file to extract ticker:CIK pairs
        const lines = secTextData.split('\n');
        const parsedData = lines.map(async (line) => {
            var [ticker, cik] = line.split('\t');
            
            // Add leading 0's to CIK
            if(cik.toString().length < 10) {
                const diff = 10 - cik.toString().length;
                var newCik = "";

                for(var i=0; i < diff; i++) {
                    newCik += "0";
                }

                cik = newCik + cik;
            }

            // Parse the data alphabetically to create smaller cache files  
            const folder = ticker.charAt(0).toLowerCase();

            if(secData.data.hasOwnProperty(folder)) {
                secData.data[ticker.charAt(0).toLowerCase()][ticker] = cik;
            } else {
                secData.data[ticker.charAt(0).toLowerCase()] = {};
                secData.data[ticker.charAt(0).toLowerCase()][ticker] = cik;
            }
        });

        // TODO: consider whether there is a more computationally efficient way to do this
        // TODO: move from file cache to the SQLite DB for more efficient querying
        // Cache the parsed data into the created folders
        for(var cacheFolder in secData.data) {
            var folderData = {lastCached: date.toLocaleDateString(), data: {}}
            
            for(var ticker in secData.data[cacheFolder]) {
                folderData["data"][ticker] = secData.data[cacheFolder][ticker];
            }

            var filePath = `sec/${cacheFolder}/sec.json`;

            try {
                const cached = this.cacheManager.cacheSync(filePath, JSON.stringify(folderData));
                if(cached === false) {
                    throw Error("Unable to cache the data");
                }
            } catch(error) {
                this.cacheManager.makeDirectorySync("sec",cacheFolder);
                this.cacheManager.cacheSync(filePath, JSON.stringify(folderData));
            }
        }
    }

    render() {        
        return (
                <div className="page">
                    <h2>Price and Volume Trends</h2>
                    <div className="flex">
                        <div>
                            <TickerSearchBar cacheHandler={this.manageTickerCikMapCache} state={this.state} onDataChange={this.handleDataChange}/>
                            { this.state.data ? (
                                <TimeSeriesChart state={this.state} onIntervalChange={this.handleIntervalChange} />
                            ) : this.state.isLoading === true ? (
                                <p>Loading...</p>
                            ) : this.state.error ? (
                                <p>The ticker you entered is not valid. Please choose a valid ticker.</p>
                            ) : (null)}
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