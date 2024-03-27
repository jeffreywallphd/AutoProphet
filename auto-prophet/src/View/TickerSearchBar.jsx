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
    //Variables to reset the chart view
    var type;
    var interval;
    var priceData;

    //TODO: implement error handling
    //When fetching data for a new ticker fromt he search bar, get 1D data
    const fetch1DData = async () => {
        type = "intraday";
        interval = "1D";
        fetchData();
    }


    //Gets ticker data
    const fetchData = async () => {
        //Take away previous data
        props.onDataChange({
            initializing: false,
            error: props.state.error,
            data: null,
            secData: null,
            ticker: null,
            cik: null,
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
            if(element.ticker === props.state.searchRef.current.value) {
                companyName = element.companyName;
            }
        });

        //get price and volume data through stock interactor
        var interactor = new StockInteractor();
        var requestObj = new JSONRequest(`{ 
            "request": { 
                "stock": {
                    "action": "${type}",
                    "ticker": "${props.state.searchRef.current.value}",
                    "companyName": "${companyName}",
                    "interval": "${interval}"
                }
            }
        }`);

        const results = await interactor.get(requestObj);
        priceData = results;

        //set the new data state with the updated search results
        props.onDataChange({
            initializing: true,
            data: results,
            secData: null,
            ticker: props.state.searchRef.current.value,
            cik: null,
            error: props.state.error,
            type: type,
            interval: interval,
            securitiesList: props.state.securitiesList,
            searchRef: props.state.searchRef,
            isLoading: false,
            priceMin: Math.min(...results.response.results[0]["data"].map(data => data.price)),
            priceMax: Math.max(...results.response.results[0]["data"].map(data => data.price)),
            volumeMax: Math.max(...results.response.results[0]["data"].map(data => data.volume)),
            yAxisStart: dateTimeFormatter(results.response.results[0]["data"][0]),
            yAxisEnd: dateTimeFormatter(results.response.results[0]["data"][-1])
        });

        await fetchSecData();
    }

    const fetchSecData = async () => {
        //TODO: consider whether the cachManager needs to be called here 
        //or if it could be called on cache extraction error

        //check to make sure ticker:CIK map cache exists and is up-to-date
        await props.cacheHandler(props.state.searchRef.current.value).then(async () => {
            //add a momentary pause to allow cache to create on initial startup
            // TODO: create a better way to wait for cache to completely resolve. Possibly useEffect()
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
            await delay(1000);
            
            //get CIK from cache based on ticker symbol
            const cacheManager = new CacheManager();
            
            const tickerFolder = props.state.searchRef.current.value.toString().charAt(0).toLowerCase();
            var data = cacheManager.extractSync(`sec/${tickerFolder}/sec.json`);
            const tickerCikMap = JSON.parse(data);

             // remove the data to free memory
             data = null;

            // Make sure the ticker exists in the ticker:CIK mapping
            var cik;
            if(tickerCikMap["data"] !== undefined && tickerCikMap["data"].hasOwnProperty(props.state.searchRef.current.value.toLowerCase())) {
                cik = tickerCikMap["data"][props.state.searchRef.current.value.toLowerCase()];
            } else {
                // either the cache isn't set up or
                //the requested ticker is not from a company tracked by the SEC

                // TODO: come up with a better way than timeout above to wait for cache creation
                return;
            }
            
            //TODO: create a parent interactor that can send a single request and dispatch
            //get SEC data through SEC interactor
            var secInteractor = new SecInteractor();
            var secRequestObj = new JSONRequest(`{ 
                "request": { 
                    "sec": {
                        "action": "companyLookup",
                        "cik": "${cik}"
                    }
                }
            }`);

            const secResults = await secInteractor.get(secRequestObj);
            window.fsApi.logData(JSON.stringify(secResults));

            //set the new secData state with the SEC API results
            props.onDataChange({
                initializing: true,
                data: priceData,
                secData: secResults,
                ticker: props.state.searchRef.current.value,
                cik: cik,
                error: props.state.error,
                type: type,
                interval: interval,
                securitiesList: props.state.securitiesList,
                searchRef: props.state.searchRef,
                isLoading: false,
                priceMin: props.state.priceMin,
                priceMax: props.state.priceMax,
                volumeMax: props.state.volumeMax,
                yAxisStart: props.state.yAxisState,
                yAxisEnd: props.state.yAxisEnd
            });
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
        //stops fetchData() from being called upon page start
        if(props.state.initializing === false) {
            //Get new type and interval for which to format data
            type = props.state.type;
            interval = props.state.interval;
            
            fetchData();
        }
    }, [props.state.interval]);

    const handleSymbolChange = (state) => {
        props.onDataChange(state);
    };
   
    return (
        <SymbolSearchBar fetchData={fetch1DData} state={props.state} onSymbolChange={handleSymbolChange}/>
    );
}

export { TickerSearchBar }