import React, { useState, useEffect, useRef, Component } from "react";
import { GetSearchData } from '../AlphaVantage';
import { FaSearch } from "react-icons/fa";
import "./Price.css";

function SearchBar() {
    const [securityList, setList] = useState(null);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef("META");

    const fetchData = async () => {
        try {
            setLoading(true);
            const searchData = await GetSearchData(searchRef.current.value);
            setList(searchData);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="priceSearchFormContainer">
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    fetchData();
                }}>
                    <input className="priceSearchBar" type="text" ref={searchRef} placeholder="Please enter your security"></input>
                    <button className="priceSearchButton" type="submit" disabled={loading}><FaSearch/></button>
                </form>
            </div>

            {securityList && (
                <ul>
                    {securityList.map((data) => (
                        <li key={data.ticker}>
                            {data.ticker} - {data.name}
                        </li>
                    ))}
                </ul>
            )}
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