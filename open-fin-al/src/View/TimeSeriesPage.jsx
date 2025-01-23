// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { useContext, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { TickerSearchBar } from "./TickerSearchBar";
import { TickerSidePanel } from "./TickerSidePanel";
import { DataContext } from "./App";

function TimeSeriesPage(props) {
    const location = useLocation();
    const { state, setState } = useContext(DataContext);
    
    //ensure that the state changes
    useEffect(() => {
        setState({
            ...state
        })
    }, [state.data, state.searchRef, state.secData, state.interval]);

    const handleDataChange = (newState) => {
        setState(newState);
    };

    return (
        <div className="page">
            <h2>Price and Volume Trends</h2>
            <div className="flex">
                <div>
                    {state ?
                        ( 
                            <>
                                <TickerSearchBar state={state} handleDataChange={handleDataChange}/>
                            
                                { state.isLoading === true ? (
                                    <>
                                        <p>Loading...</p>
                                    </>
                                ) : state.error ? (
                                    <p>The ticker you entered is not valid. Please choose a valid ticker.</p>
                                ) : (<p>Data Source: {state.dataSource}</p>) }
                            
                                <TimeSeriesChart state={state} handleDataChange={handleDataChange} />
                            </>
                        ) :   
                        (<p>Loading Context...</p>)
                    }
                </div>
                <div className="sidePanel">
                    { state && state.secData ? (
                        <>
                            <TickerSidePanel state={state} />
                        </>
                    ) : (null)}
                    { state && state.data? 
                            <>
                                <h4>Financial Statements</h4>
                                <div><NavLink to="/sec-report" state={{...state, report: "10-K"}}>Most Recent 10-K</NavLink></div>
                                <div><NavLink to="/sec-report" state={{...state, report: "10-Q"}}>Most Recent 10-Q</NavLink></div>
                            </>
                        :
                            (null)
                    }
                </div>
            </div>
        </div>
    );
}

// In case hooks are needed for this class. Can remove later if not necessary
export function TimeSeries() {
    return <TimeSeriesPage />
};