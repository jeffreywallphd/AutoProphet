import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TickerSearchBar } from "./TickerSearchBar";
import { DataContext } from "./App";
import { RSIChart } from "./RSIChart";
import { MovingAvgChart } from "./MovingAVGChart";

function ForecastFeaturesPage(props) {
  const location = useLocation();
  const { state, setState } = useContext(DataContext);

  // Force state update (might be removed later)
  useEffect(() => {
    setState({
      ...state,
    });
  }, [state.data, state.searchRef, state.interval]);

  const handleDataChange = (newState) => {
    setState(newState);
  };

  return ( 
    <div className="page">
      <h2>Forecast Features</h2>
      <div className="flex">
        <div>
          {state ? (
            <>
              <TickerSearchBar state={state} handleDataChange={handleDataChange} />
              {state.isLoading === true ? (
                <p>Loading...</p>
              ) : state.error ? (
                <p>The ticker you entered is not valid. Please choose a valid ticker.</p>
              ) : (
                <p>Data Source: {state.dataSource}</p>
              )}
              <RSIChart state={state} handleDataChange={handleDataChange} />
              <MovingAvgChart state={state} handleDataChange={handleDataChange} />
            </>
          ) : (
            <p>Loading Context...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ForecastFeature() {
  return <ForecastFeaturesPage />;
}
