import React, { useState, useEffect, Component } from "react";
import { GetSearchData } from './AlphaVantage';


function SearchBar() {
    const [securityList, setList] = useState(null);

    if (securityList) {
        //console.log(securityList);
        return (
            <div>
                <button type="Submit" onClick={async () => setList(await GetSearchData("nv"))}>Get Search Data</button>
                <>
                    {securityList.map(function(data) {
                        return (
                            <li>
                                {data.ticker} - {data.name}
                            </li>
                        );
                    })}
                </>
            </div>
        );
    } else {
        return (
            <div>
                <button type="Submit" onClick={async () => setList(await GetSearchData("nv"))}>Get Search Data</button>
            </div>
        );
    }
    
}

class Price extends Component {

    
    render() {
        return (
            <div className="page">
                <h2>Price/Volume</h2>
                <SearchBar />
            </div>
        );
    }
}

export default Price;