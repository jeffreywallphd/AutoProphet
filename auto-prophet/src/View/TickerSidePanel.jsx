// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React from "react";
import {EPS, PER, WCR, QR, DER, GPM} from "./Ratios";

function TickerSidePanel(props) {
    return (
        <div>
            <h4>{props.state.data.response.results[0]["companyName"]}</h4>
            <p>CIK: {props.state.secData.response.results[0]["cik"]}</p>
            <p>Revenues: {props.state.secData.response.results[0]["data"]["facts"]["us-gaap"]["Revenues"]["units"]["USD"][0]["val"]}</p>
            <p>Earnings Per Share Ratio: {EPS}</p>
            <p>Price to Earnings Ratio: {PER}</p>
            <p>Working Capital Ratio: {WCR}</p>
            <p>Quick Rate: {QR}</p>
            <p>Debt to Equity Ratio: {DER}</p>
            <p>Gross Profit Margin: {GPM}</p>
        </div>
    );
}

export { TickerSidePanel }