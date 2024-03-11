import React, { useState, useRef } from "react";
import { GetSearchBarData, Get1DMinuteData } from '../AlphaVantage';
import { FaSearch } from "react-icons/fa";
import "./Price.css";

function SearchBar(props) {
    const [securityList, setList] = useState(null);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef("META");

    //Checks the keyUp event to determine if a key was hit or a datalist option was selected
    const checkInput = async (e) => {
        //Unidentified means datalist option was selected, otherwise a key was hit
        if (e.key == "Unidentified" || e.key == "Enter"){
            await fetch1DMinuteData();
        } else {
            await fetchSearchData();
        }
    }

    //Gets potential tickers based on the current input in the search bar
    const fetchSearchData = async () => {
        if (searchRef.current.value != "") {
            try {
                setLoading(true);
                const searchData = await GetSearchBarData(searchRef.current.value);
                setList(searchData);
            } finally {
                setLoading(false);
            }
        } else {
            setList(null);
        }
        
    };

    //Gets ticker data
    const fetch1DMinuteData = async () => {
        //Take away preious data
        props.onDataChange("Loading");

        //Get new data
        const data = await Get1DMinuteData(searchRef.current.value);

        if (data == "Error") {
            //Give the data back to the price page
            props.onDataChange(data);
        } else {
            //Get new ticker
            var ticker = (searchRef.current.value).toUpperCase();

            //Capitalize the ticker in the search bar if not done already
            searchRef.current.value = ticker;

            //Update meta data about the company
            data["MetaData"]["ticker"] = ticker;
            data["MetaData"]["company"] = (await GetSearchBarData(searchRef.current.value)).find((element) => {
                return element.ticker == ticker;
            }).name;

            //Give the data back to the price page
            props.onDataChange(data);
        }
    }

    return (
        <>
            <div className="priceSearchFormContainer">
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    fetch1DMinuteData();
                }}>
                    <input className="priceSearchBar" type="text" list="tickers" ref={searchRef}
                           onKeyUp={(e) => checkInput(e)} placeholder="Please enter your security"></input>

                    {securityList ?
                        <datalist id="tickers">
                            {securityList.map((data) => (
                                <option key={data.ticker} value={data.ticker}>
                                    {data.name}
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

export { SearchBar }