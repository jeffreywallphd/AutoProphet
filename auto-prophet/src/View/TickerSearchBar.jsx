import React, { useState, useRef, useEffect } from "react";
import {StockInteractor} from "../Interactor/StockInteractor";
import {JSONRequest} from "../Gateway/Request/JSONRequest";
import { FaSearch } from "react-icons/fa";

function TickerSearchBar(props) {
    const [securityList, setList] = useState(null);
    const [loading, setLoading] = useState(false);
    var newSearch = false;
    const searchRef = useRef("META");
    
    //Checks the keyUp event to determine if a key was hit or a datalist option was selected
    const checkInput = async (e) => {
        //Unidentified means datalist option was selected, otherwise a key was hit
        if (e.key == "Unidentified" || e.key == "Enter"){
            newSearch = true;
            await fetchData();
        } else {
            await fetchSymbol();
        }
    }

    //Checks if the interval has been changed in the TimeSeriesChart. If so, the fetchData is triggered again.
    useEffect(() => {
        if(props.state.initializing !== true) {
            //stop fetchData() from running on startup
            fetchData();
        }
    }, [props.state.interval]);
    

    //Gets potential tickers based on the current input in the search bar
    const fetchSymbol = async () => {
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

                const searchData = await interactor.get(requestObj);
                
                setList(searchData.response.results);
            } finally {
                setLoading(false);
            }
        } 
    };

    //TODO: implement error handling
    //Gets ticker data
    const fetchData = async () => {
        //set type and interval based on if this is a new search
        var type;
        var interval;
        if (newSearch) {
            interval = "1D";
            type = "intraday";
            newSearch = false;
        } else {
            type = props.state.type;
            interval = props.state.interval;
        }

        //Take away previous data
        props.onDataChange({
            initializing: true,
            data: null,
            error: props.state.error,
            type: type,
            interval: interval,
            isLoading: true,
            priceMin: null,
            priceMax: null,
            volumeMax: null,
            yAxisStart: null,
            yAxisEnd: null
        });

        var companyName = "";

        //Make sure ticker is in upper case
        searchRef.current.value = (searchRef.current.value).toUpperCase();

        //get company name from securities list data
        securityList.find((element) => {
            if(element.ticker === searchRef.current.value) {
                companyName = element.companyName;
            }
        });

        //get data through stock interactor
        var interactor = new StockInteractor();
        var requestObj = new JSONRequest(`{ 
            "request": { 
                "stock": {
                    "action": "${type}",
                    "ticker": "${searchRef.current.value}",
                    "companyName": "${companyName}",
                    "interval": "${interval}"
                }
            }
        }`);

        const results = await interactor.get(requestObj);

        props.onDataChange({
            initializing: false,
            data: results,
            error: props.state.error,
            type: type,
            interval: interval,
            isLoading: false,
            priceMin: Math.min(...results.response.results[0]["data"].map(data => data.price)),
            priceMax: Math.max(...results.response.results[0]["data"].map(data => data.price)),
            volumeMax: Math.max(...results.response.results[0]["data"].map(data => data.volume)),
            yAxisStart: dateTimeFormatter(results.response.results[0]["data"][0]),
            yAxisEnd: dateTimeFormatter(results.response.results[0]["data"][-1])
        });
    }

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

    return (
        <>
            <div className="priceSearchFormContainer">
                <form onSubmit={async (e) => {
                    newSearch = true;
                    e.preventDefault();
                    fetchData();
                }}>
                    {/*alert("From TickerSearchBar: " + type)*/}
                    <input className="priceSearchBar" type="text" list="tickers" ref={searchRef}
                           onKeyUp={(e) => checkInput(e)} placeholder="Please enter a ticker symbol"></input>

                    {securityList ?
                        <datalist id="tickers">
                            {securityList.map((listData) => (
                                <option key={listData.ticker} value={listData.ticker}>
                                    {listData.companyName}
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