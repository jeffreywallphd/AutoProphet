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

function TickerSearchBar(props) {
    //TODO: implement error handling

    //Gets all data for a ticker and updates the props with the data
    const fetchAllData = async (state) => {
        state.isLoading = true;
        props.onDataChange(state);

        //Get Price Data
        await fetchPriceVolumeData(state);

        //state.isLoading = false;

        //Get SEC Data
        await fetchSecData(state);
    }

    //Gets price and volume data for a ticker
    const fetchPriceVolumeData = async (state) => {
        // TODO: can we store cik in the securities list as well? 
        // get company name from securities list data
        var companyName = "";
        var cik = "";
        state.securitiesList.find((element) => {
            if(element.ticker === state.searchRef) {
                companyName = element.companyName;
                cik = element.cik;
            }
        });
        
        //get price and volume data through stock interactor
        var interactor = new StockInteractor();
        var requestObj = new JSONRequest(`{ 
            "request": { 
                "stock": {
                    "action": "${state.type}",
                    "ticker": "${state.searchRef}",
                    "cik": "${cik}",
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
        //TODO: we need to get the CIK from the database. If this is captured in the securitiesList, we don't need a database lookup                    
        //TODO: create a parent interactor that can send a single request and dispatch
        var cik = "";
        state.securitiesList.find((element) => {
            if(element.ticker === state.searchRef) {
                cik = element.cik;
            }
        });

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
        //stops fetch from being called upon page start
        if(props.state.initializing === false) {
            //fetchAllData(props.state);
            fetchPriceVolumeData(props.state);
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