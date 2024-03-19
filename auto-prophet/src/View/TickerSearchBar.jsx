import React, { useState, useRef, useEffect } from "react";
import {StockInteractor} from "../Interactor/StockInteractor";
import {JSONRequest} from "../Gateway/Request/JSONRequest";
import { FaSearch } from "react-icons/fa";

function TickerSearchBar(props) {
    const [securityList, setList] = useState(null);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef("META");
    
    //Checks the keyUp event to determine if a key was hit or a datalist option was selected
    const checkInput = async (e) => {
        //Unidentified means datalist option was selected, otherwise a key was hit
        if (e.key == "Unidentified" || e.key == "Enter"){
            await fetchData();
        } else {
            await fetchSymbol();
        }
    }

    //Checks if the interval has been changed in the TimeSeriesChart. If so, the fetchData is triggered again.
    useEffect(() => {
        fetchData();
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
        //Take away previous data
        props.onDataChange({
            data: null,
            error: props.state.error,
            type: props.state.type,
            interval: props.state.interval,
            isLoading: true
        });

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
                    "action": "${props.state.type}",
                    "ticker": "${searchRef.current.value}",
                    "companyName": "${companyName}",
                    "interval": "${props.state.interval}"
                }
            }
        }`);

        const results = await interactor.get(requestObj);
        
        props.onDataChange({
            data: results,
            error: props.state.error,
            type: props.state.type,
            interval: props.state.interval,
            isLoading: false
        });
    }

    return (
        <>
            <div className="priceSearchFormContainer">
                <form onSubmit={async (e) => {
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