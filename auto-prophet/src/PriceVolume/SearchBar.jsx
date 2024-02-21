import React, { useState, useRef, Component, useEffect } from "react";
import { GetSearchData, GetHourlyData } from '../AlphaVantage';
import { FaSearch } from "react-icons/fa";
import "./Price.css";

function SearchBar() {
    const [securityList, setList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tickerData, setTickerData] = useState(null);
    const searchRef = useRef("META");

    //Checks the keyUp event to determine if a key was hit or a datalist option was selected
    const checkInput = async (e) => {
        //Unidentified means datalist option was selected, otherwise a key was hit
        if (e.key == "Unidentified"){
            await fetchHourlyData();
        } else {
            await fetchSearchData();
        }
    }

    //Gets potential tickers based on the current input in the search bar
    const fetchSearchData = async () => {
        if (searchRef.current.value != "") {
            try {
                setLoading(true);
                const searchData = await GetSearchData(searchRef.current.value);
                setList(searchData);
            } finally {
                setLoading(false);
            }
        } else {
            setList(null);
        }
        
    };

    //Gets ticker data
    const fetchHourlyData = async () => {
        try {
            const data = await GetHourlyData(searchRef.current.value);
            console.log(data);
            setTickerData(data);
        } finally {
        }
    }

    return (
        <>
            <div className="priceSearchFormContainer">
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    fetchHourlyData();
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