// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { useEffect } from "react";
import { StockInteractor } from "../Interactor/StockInteractor";
import { JSONRequest } from "../Gateway/Request/JSONRequest";
import { SymbolSearchBar } from "./Shared/SymbolSearchBar";

function TickerSearchBar(props) {
    //TODO: implement error handling
    //Gets ticker data
    const fetchData = async () => {
        //Reset data parts of the state object
        props.onDataChange({
            initializing: false,
            error: props.state.error,
            data: null,
            type: props.state.type,
            interval: props.state.interval,
            securitiesList: props.state.securitiesList,
            searchRef: props.state.searchRef,
            isLoading: true,
            priceMin: null,
            priceMax: null,
            volumeMax: null,
            yAxisStart: null,
            yAxisEnd: null
        });

        //get company name from securities list data
        var companyName = "";
        
        props.state.securitiesList.find((element) => {
            if(element.ticker === (props.state.searchRef.current.value).toUpperCase()) {
                companyName = element.companyName;
            }
        });

        //get data through stock interactor
        var interactor = new StockInteractor();
        var requestObj = new JSONRequest(`{ 
            "request": { 
                "stock": {
                    "action": "${props.state.type}",
                    "ticker": "${props.state.searchRef.current.value}",
                    "companyName": "${companyName}",
                    "interval": "${props.state.interval}"
                }
            }
        }`);

        const results = await interactor.get(requestObj);

        //set the new data state with the updated search results
        props.onDataChange({
            initializing: false,
            data: results,
            error: props.state.error,
            type: props.state.type,
            interval: props.state.interval,
            securitiesList: props.state.securitiesList,
            searchRef: props.state.searchRef,
            isLoading: false,
            priceMin: Math.min(...results.response.results[0]["data"].map(data => data.price)),
            priceMax: Math.max(...results.response.results[0]["data"].map(data => data.price)),
            volumeMax: Math.max(...results.response.results[0]["data"].map(data => data.volume)),
            yAxisStart: dateTimeFormatter(results.response.results[0]["data"][0]),
            yAxisEnd: dateTimeFormatter(results.response.results[0]["data"][-1])
        });
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
        if(props.state.initializing === false) {
            //stops fetchData() from being called upon page start 
            fetchData();
        }
    }, [props.state.interval]);

    const handleSymbolChange = (state) => {
        props.onDataChange(state);
    };
   
    return (
        <SymbolSearchBar fetchData={fetchData} state={props.state} onSymbolChange={handleSymbolChange}/>
    );
}

export { TickerSearchBar }