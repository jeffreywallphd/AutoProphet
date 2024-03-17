import React, { useState, useRef, useEffect } from "react";
import {StockInteractor} from "../Interactor/StockInteractor";
import {JSONRequest} from "../Gateway/Request/JSONRequest";
import { FaSearch } from "react-icons/fa";
//import "../PriceVolume/Price.css";

function TickerSearchBar(props) {
    const [securityList, setList] = useState(null);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef("META");

    //Checks the keyUp event to determine if a key was hit or a datalist option was selected
    const checkInput = async (e) => {
        //Unidentified means datalist option was selected, otherwise a key was hit
        if (e.key == "Unidentified" || e.key == "Enter"){
            await fetchIntraDayData();
        } else {
            await fetchSearchData();
        }
    }

    //Gets potential tickers based on the current input in the search bar
    const fetchSearchData = async () => {
        if (searchRef.current.value != "") {
            try {
                setLoading(true);
                
                //get data through stock interactor
                var interactor = new StockInteractor();
                var requestObj = new JSONRequest(`{ 
                    "request": { 
                        "stock": {
                            "action": "lookup",
                            "keyword": "${searchRef.current.value}"
                        }
                    }
                }`);

                const searchData = await interactor.search(requestObj);

                setList(searchData.response.results);
            } finally {
                setLoading(false);
            }
        } else {
            setList(null);
        }
    };

    //TODO: implement error handling
    //Gets ticker data
    const fetchIntraDayData = async () => {
        //Take away preious data
        props.onDataChange("Loading");

        var companyName = "";

        //get company name from securities list data
        securityList.find((element) => {
            if(element.ticker === (searchRef.current.value).toUpperCase()) {
                companyName = element.companyName;
            }
        });

        //get data through stock interactor
        var interactor = new StockInteractor();
        var requestObj = new JSONRequest(`{ 
            "request": { 
                "stock": {
                    "action": "intraday",
                    "ticker": "${searchRef.current.value}",
                    "companyName": "${companyName}"
                }
            }
        }`);

        const data = await interactor.get(requestObj);

        props.onDataChange(data);
    }

    return (
        <>
            <div className="priceSearchFormContainer">
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    fetchIntraDayData();
                }}>
                    <input className="priceSearchBar" type="text" list="tickers" ref={searchRef}
                           onKeyUp={(e) => checkInput(e)} placeholder="Please enter a ticker symbol"></input>

                    {securityList ?
                        <datalist id="tickers">
                            {securityList.map((data) => (
                                <option key={data.ticker} value={data.ticker}>
                                    {data.companyName}
                                </option>
                            ))}

                        </datalist>
                        : null
                    }
                    <button className="priceSearchButton" type="submit" disabled={loading}><FaSearch/></button>
                </form>
            </div>
            <div>
                
            </div>
        </>
    );
}

export { TickerSearchBar }