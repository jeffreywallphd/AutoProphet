// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React from "react";


function Ratios(props) {
    //EPS Ratio
    var netIncome = "1";
    var preferredDividends = "2";
    var weightedAvgSharesOutstanding = "3";
    var earningsPerShare = (netIncome - preferredDividends) / weightedAvgSharesOutstanding;

    //PE Ratio
    var sharePrice = props.state.secData.response.results[0]["data"]["facts"]["us-gaap"]["SharePrice"]["units"]["USD/shares"][0]["val"];
    var priceEarningRatio = sharePrice / earningsPerShare;

    //WC Ratio
    var currentAssets = 1
    var currentLiabilities = 2
    var workingCapitalRatio = currentAssets / currentLiabilities;

    //Quick Ratio
    var inventory = 1;
    var quickRatio = (currentAssets - inventory) / currentLiabilities;


    //Debt-Equity Ratio
    var shortTermDebt = 1;
    var longTermDebt = 2;
    var otherFixedPayments = 3;
    var shareholdersEquity = 4;
    var debtEquityRatio = (shortTermDebt + longTermDebt + otherFixedPayments) / shareholdersEquity;

    //Gross Profit Margin
    var cOGS = 1
    var revenue = 2
    var grossProfitMargin = (revenue - cOGS) / revenue;

    return {
        earningsPerShare,
        priceEarningRatio,
        workingCapitalRatio,
        quickRatio,
        debtEquityRatio,
        grossProfitMargin
    };
}

var ratioValues = getRatioValues(props)

var EPS = ratioValues.earningsPerShare
var PER = ratioValues.priceEarningRatio
var WCR = ratioValues.workingCapitalRatio
var QR = ratioValues.quickRatio
var DER = ratioValues.debtEquityRatio
var GPM = ratioValues.grossProfitMargin

export {EPS, PER, WCR, QR, DER, GPM};