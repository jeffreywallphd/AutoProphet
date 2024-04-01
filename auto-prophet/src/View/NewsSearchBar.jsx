// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React from "react";
import {NewsInteractor} from "../Interactor/NewsInteractor";
import {JSONRequest} from "../Gateway/Request/JSONRequest";
import { SymbolSearchBar } from "./Shared/SymbolSearchBar";

function NewsSearchBar(props) {
    //TODO: implement error handling
    //Gets ticker data
    const fetchNews = async (args) => {
        //Take away previous data
        props.onDataChange({
            initializing: false,
            data: null,
            error: props.state.error,
            isLoading: true,
            securitiesList: props.state.securitiesList,
            searchRef: props.state.searchRef,
        });

        var companyName = "";

        //get company name from securities list data
        props.state.securitiesList.find((element) => {
            if(element.ticker === (props.state.searchRef.current.value).toUpperCase()) {
                companyName = element.companyName;
            }
        });

        //get data through stock interactor
        var interactor = new NewsInteractor();
        var requestObj = new JSONRequest(`{ 
            "request": { 
                "news": {
                    "action": "searchByTicker",
                    "ticker": "${props.state.searchRef.current.value}",
                    "companyName": "${companyName}"
                }
            }
        }`);

        const results = await interactor.get(requestObj);

        props.onDataChange({
            initializing: false,
            data: results,
            error: props.state.error,
            isLoading: false,
            securitiesList: props.state.securitiesList,
            searchRef: props.state.searchRef,
        });
    }

    const handleSymbolChange = (state) => {
        props.onDataChange(state);
    };

    return (
        <SymbolSearchBar fetchData={fetchNews} state={props.state} onSymbolChange={handleSymbolChange}/>
    );
}

export { NewsSearchBar }