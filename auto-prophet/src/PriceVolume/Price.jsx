import React, { useState, useRef, Component } from "react";
import { GetSearchData } from '../AlphaVantage';
import { FaSearch } from "react-icons/fa";
import "./Price.css";

function SearchBar() {
    const [securityList, setList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ticker, setTicker] = useState(null);
    const searchRef = useRef("META");

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

    const fetchTickerData = async () => {
        setTicker(searchRef.current.value);
    }


    return (
        <>
            <div className="priceSearchFormContainer">
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    fetchTickerData();
                }}>
                    <input className="priceSearchBar" type="text" list="tickers" ref={searchRef} onChange={async () => fetchSearchData()} placeholder="Please enter your security"></input>
                    {securityList ?
                        <datalist id="tickers">
                            {securityList.map((data) => (
                                <option value={data.ticker}>
                                    {data.name}
                                </option>
                            ))}
                        </datalist> : null
                    }
                    <button className="priceSearchButton" type="submit" disabled={loading}><FaSearch/></button>
                </form>
            </div>
            <div>
                    {ticker ? <p>Searched for {ticker}</p> : null}
            </div>
        </>
    );
}

class Price extends Component {
    render() {
        return (
            <div className="page">
                <SearchBar />
            </div>
        );
    }
}

export default Price;