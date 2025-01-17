// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React from "react";
import RatioCalculator from "../Utility/RatioCalculator";

function TickerSidePanel(props) {
    const ratioCalculator = new RatioCalculator(props.state.secData.response.results[0]["data"]);
    ratioCalculator.calculateRatios();

    return (
        <div>
            <h4>{props.state.secData.response.results[0]["data"]["Name"]} Ratios</h4>
            <p>CIK: {props.state.secData.response.results[0]["cik"]}</p>
            <p>EPS: {ratioCalculator.EPS}</p>
            <p>P/E: {ratioCalculator.PER}</p>
            <p>Working Capital: {ratioCalculator.WCR}</p>
            <p>Quick Ratio: {ratioCalculator.QR}</p>
            <p>Debt/Equity Ratio: {ratioCalculator.DER}</p>
            <p>Gross Profit Margin: {ratioCalculator.GPM}</p>
        </div>
    );
}

export { TickerSidePanel }