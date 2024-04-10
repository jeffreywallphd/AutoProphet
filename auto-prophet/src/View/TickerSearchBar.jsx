// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { useEffect } from "react";
import { StockInteractor } from "../Interactor/StockInteractor";
import { SecInteractor } from "../Interactor/SecInteractor";
import { JSONRequest } from "../Gateway/Request/JSONRequest";
import { SymbolSearchBar } from "./Shared/SymbolSearchBar";
import { CacheManager } from "../Utility/CacheManager";

function TickerSearchBar(props) {
    //TODO: implement error handling

    //Gets all data for a ticker and updates the props with the data
    const fetchAllData = async (state) => {
        //Take away previous data and set the state to loading
        //Uses old state and interval to avoid useEffect fetching again
        props.onDataChange({
            initializing: false,
            error: state.error,
            data: null,
            secData: null,
            ticker: null,
            cik: null,
            type: props.state.type,
            interval: props.state.interval,
            securitiesList: state.securitiesList,
            searchRef: state.searchRef,
            isLoading: true,
            priceMin: null,
            priceMax: null,
            maxVolume: null,
            yAxisStart: null,
            yAxisEnd: null
        });

        //Initialize the new state
        var newState = {
            initializing: null,
            data: null,
            secData: null,
            error: null,
            ticker: null,
            cik: null,
            type: state.type,
            interval: state.interval,
            securitiesList: state.securitiesList,
            searchRef: state.searchRef,
            isLoading: null,
            minPrice: null,
            maxPrice: null,
            maxVolume: null,
            yAxisStart: null,
            yAxisEnd: null
        };

        //Get Price Data
        await fetchPriceVolumeData(newState);
        //Get SEC Data
        await fetchSecData(newState);
    }

    //Gets price and volume data for a ticker
    const fetchPriceVolumeData = async (state) => {
        //get company name from securities list data
        var companyName = "";
        state.securitiesList.find((element) => {
            if(element.ticker === state.searchRef) {
                companyName = element.companyName;
            }
        });

        //get price and volume data through stock interactor
        var interactor = new StockInteractor();
        var requestObj = new JSONRequest(`{ 
            "request": { 
                "stock": {
                    "action": "${state.type}",
                    "ticker": "${state.searchRef}",
                    "companyName": "${companyName}",
                    "interval": "${state.interval}"
                }
            }
        }`);

            const results = await interactor.get(requestObj);
            var priceData = results;

            //Update the state
            state.initializing = true;
            state.data = priceData;
            state.ticker = state.searchRef;
            state.error = state.error;
            state.isLoading = false;
            state.priceMin = Math.min(...priceData.response.results[0]["data"].map(data => data.price));
            state.priceMax = Math.max(...priceData.response.results[0]["data"].map(data => data.price));
            state.maxVolume = Math.max(...priceData.response.results[0]["data"].map(data => data.volume));
            state.yAxisStart = dateTimeFormatter(priceData.response.results[0]["data"][0]);
            state.yAxisEnd = dateTimeFormatter(priceData.response.results[0]["data"][-1]);

            props.onDataChange(state);

    }

    //Gets SEC data for a ticker
    const fetchSecData = async (state) => {
        //TODO: consider whether the cachManager needs to be called here 
        //or if it could be called on cache extraction error
        
        //check to make sure ticker:CIK map cache exists and is up-to-date
        await props.cacheHandler(state.searchRef).then(async () => {
            //add a momentary pause to allow cache to create on initial startup
            // TODO: create a better way to wait for cache to completely resolve. Possibly useEffect()
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            await delay(1000);
            
            //get CIK from cache based on ticker symbol
            const cacheManager = new CacheManager();
            
            const tickerFolder = state.searchRef.toString().charAt(0).toLowerCase();
            var data = cacheManager.extractSync(`sec/${tickerFolder}/sec.json`);
            const tickerCikMap = JSON.parse(data);

            // remove the data to free memory
            data = null;

            // Make sure the ticker exists in the ticker:CIK mapping
            var cik;
            if(tickerCikMap["data"] !== undefined && tickerCikMap["data"].hasOwnProperty(state.searchRef.toLowerCase())) {
                cik = tickerCikMap["data"][state.searchRef.toLowerCase()];
            } else {
                // either the cache isn't set up or
                //the requested ticker is not from a company tracked by the SEC

                // TODO: if not a company tracked by the SEC, throw error or alert user of issue
                // TODO: come up with a better way than timeout above to wait for cache creation
                return;
            }
            
            //TODO: create a parent interactor that can send a single request and dispatch
            
            //get SEC data through SEC interactor
            var secInteractor = new SecInteractor();
            var secRequestObj = new JSONRequest(`{
                "request": {
                    "sec": {
                        "action": "overview",
                        "cik": "${cik}",
                        "ticker": "${state.searchRef}"
                    }
                }
            }`);

            const secResults = await secInteractor.get(secRequestObj);
            window.console.log(JSON.stringify(secResults));

            var secBalanceRequestObj = new JSONRequest(`{
                "request": {
                    "sec": {
                        "action": "balance",
                        "cik": "${cik}",
                        "ticker": "${state.searchRef}"
                    }
                }
            }`);

            const secBalanceResults = await secInteractor.get(secBalanceRequestObj);
            window.console.log(JSON.stringify(secBalanceResults));

            secResults.response.results[0].data = Object.assign({}, secResults.response.results[0].data, secBalanceResults.response.results[0].data[0]);
            window.console.log(JSON.stringify(secResults));

            //build the financial statements based on SEC submissions and company data
            //var schema = await secInteractor.calculateReport(props.state.searchRef.current.value.toLowerCase(), secSubmissionsResults, secResults);
            //window.console.dirxml(schema[0].response);

            //update the state
            state.secData = secResults;
            state.cik = cik;

        });

        //Update the props
        props.onDataChange(state);
    }

    //format the date and time for chart
    const dateTimeFormatter = (value) => {
        const date = new Date(value);
        
        if( props.state.type === "intraday") {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        } else {
            const dateNoMinutes = date.getDate().toString();
            return dateNoMinutes;
        }
    };

    //fetch data when the interval is changed by the interval buttons in TimeSeriesChart
    useEffect(() => {
        //stops fetchData() from being called upon page start
        if(props.state.initializing === false) {
            fetchAllData(props.state);
        }
    }, [props.state.interval]);

    const handleSymbolChange = (state) => {
        props.onDataChange(state);
    };
   
    return (
        <SymbolSearchBar fetchData={fetchAllData} state={props.state} onSymbolChange={handleSymbolChange}/>
    );
}

export { TickerSearchBar }