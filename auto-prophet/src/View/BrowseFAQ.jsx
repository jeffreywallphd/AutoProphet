// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { Component } from "react";

class BrowseFAQ extends Component {

    render() {
        return (
            <div className="page">
                <h2>Page FAQs:</h2>

                <div class="divSpacing">
                    <h3>Porfolio</h3>
                    <h4>Page Overview:</h4>
                    <p>Users can create a mock portfolio to own imaginary shares of real companies. Portfolio metrics include value and buying power, and portfolio metrics show stock holdings, stock values, and portfolio returns.</p>
                    <h4>Term Definitions:</h4>
                    <p>Portfolio Value - The total market value of all investments held in a portfolio at a specific time.</p>
                    <p>Buying Power - The amount of money available to purchase additional securities, factoring in cash and margin allowances.</p>
                    <p>Symbol - A unique series of letters assigned to a security for trading purposes, representing a specific stock or financial instrument.</p>
                    <p>Company - The name of the business entity that issues the stock or financial instrument represented by the symbol.</p>
                    <p>Current Price - The most recent market price at which a security is being traded.</p>
                    <p>Purchase Price - The price at which an investor bought a security, also known as the cost basis.</p>
                    <p>Quantity - The number of shares or units of a specific security held in the portfolio.</p>
                    <p>Gains - The increase in value of an investment compared to its purchase price, indicating profit.</p>
                    <p>% Gain - The percentage increase in value of an investment, calculated by comparing the current price to the purchase price.</p>
                </div>

                <div class="divSpacing">
                    <h3>Stock & Fund</h3>
                    <h4>Page Overview:</h4>
                    <p>Allows users to research stocks for their trading price and volume.</p>
                    <h4>Term Definitions:</h4>
                    <p>Price - The market price at which a security is being traded.</p>
                    <p>Volume - The total number of shares or contracts traded for a particular security during a specific period, indicating the level of activity and liquidity in the market.</p>
                </div>

                <div class="divSpacing">
                    <h3>Risk Analysis</h3>
                    <h4>Page Overview:</h4>
                    <p>Allows users to input a variety of company metrics to create a set of metrics that provide insight into a company's performance.</p>
                    <h4>Term Definitions:</h4>
                    <p>Term- definition</p>
                    <p>Acronym (full-term)- definition</p>
                </div>

            </div>
        );
    }
}

export default BrowseFAQ;