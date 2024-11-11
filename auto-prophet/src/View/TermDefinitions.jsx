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
                <h2>Term Definitions:</h2>

                <div className="faq-card">
                    <h2>Porfolio</h2>
                    <h3>Page Overview:</h3>
                    <p>Users can create a mock portfolio to own imaginary shares of real companies. Portfolio metrics include value and buying power, and portfolio metrics show stock holdings, stock values, and portfolio returns.</p>
                    <h3>Term Definitions:</h3>
                    <p>Buying Power - The amount of money available to purchase additional securities, factoring in cash and margin allowances.</p>
                    <p>Company - The name of the business entity that issues the stock or financial instrument represented by the symbol.</p>
                    <p>Current Price - The most recent market price at which a security is being traded.</p>
                    <p>Gains - The increase in value of an investment compared to its purchase price, indicating profit.</p>
                    <p>% Gain - The percentage increase in value of an investment, calculated by comparing the current price to the purchase price.</p>
                    <p>Portfolio Value - The total market value of all investments held in a portfolio at a specific time.</p>
                    <p>Purchase Price - The price at which an investor bought a security, also known as the cost basis.</p>
                    <p>Quantity - The number of shares or units of a specific security held in the portfolio.</p>
                    <p>Symbol - A unique series of letters assigned to a security for trading purposes, representing a specific stock or financial instrument.</p>
                </div>

                <div class="divSpacing"></div>

                <div className="faq-card">
                    <h2>Stock & Fund</h2>
                    <h3>Page Overview:</h3>
                    <p>Allows users to research stocks for their trading price and volume.</p>
                    <h3>Term Definitions:</h3>
                    <p>Price - The market price at which a security is being traded.</p>
                    <p>Volume - The total number of shares or contracts traded for a particular security during a specific period, indicating the level of activity and liquidity in the market.</p>
                </div>

                <div class="divSpacing"></div>

                <div className="faq-card">
                    <h2>Risk Analysis</h2>
                    <h3>Page Overview:</h3>
                    <p>Allows users to input a variety of company metrics to create a set of metrics that provide insight into a company's performance.</p>
                    <h3>Term Definitions:</h3>
                    <p>Assets - Resources owned by a company that provide future economic benefits.</p>
                    <p>Cost of Revenue - The direct costs associated with producing the goods or services sold by a company.</p>
                    <p>EPS (Earnings per Share) - A financial metric that divides a company's profit by the number of outstanding shares to show profitability per share. Although there are many compounding factors, companies should aim for an EPS of at least 10% year-over-year.</p>
                    <p>Interest Expense - The cost a company incurs from borrowing funds, typically from loans or bonds.</p>
                    <p>Large Cap Stocks - Stocks of companies with a market capitalization typically over $10 billion.</p>
                    <p>Micro Cap Stocks - Stocks of companies with a market capitalization below $300 million.</p>
                    <p>Mid Cap Stocks - Stocks of companies with a market capitalization between $2 billion and $10 billion.</p>
                    <p>NPM (Net Profit Margin) - A profitability ratio that shows the percentage of revenue left as profit after all expenses are deducted. Although there are many compounding factors, companies should aim for a net profit margin of 10% or higher.</p>
                    <p>PER (Price to Earnings Ratio) - A valuation ratio that compares a company's current share price to its earnings per share. Although there are many compounding factors, companies should aim for a P/E ratio below 15 for value stocks, and 15-20 for growth stocks.</p>
                    <p>PSSO (Preferred Stock Shares Outstanding) - The total number of issued shares of preferred stock that are currently held by shareholders, providing them with fixed dividends and priority over common stockholders in the event of liquidation.</p>
                    <p>Q and A Expense - Expenses related to Quality Assurance (QA) and possibly Quality and Administrative costs, which ensure product or service standards.</p>
                    <p>Revenue - Total revenue of the company.</p>
                    <p>ROA (Return on Assets) - A profitability ratio that measures how efficiently a company uses its assets to generate profit. Although there are many compounding factors, companies should aim for an ROA of 5% or higher.</p>
                    <p>ROE (Return on Equity) - A measure of financial performance that calculates the return generated on shareholders' equity. Although there are many compounding factors, companies should aim for an ROE of 15% or higher.</p>
                    <p>Share Price - The current price at which a company's stock is traded on the market.</p>
                    <p>Small Cap Stocks - Stocks of companies with a market capitalization between $300 million and $2 billion.</p>
                    <p>Stakeholders equity - The total value of ownership held by shareholders, calculated as assets minus liabilities.</p>
                    <p>S and M expense - Sales and Marketing expenses, including advertising, promotions, and salesforce costs.</p>
                    <p>WANSOB (Weighted Average Number of Shares Outstanding) - The average number of a company's shares outstanding over a specific period, adjusted for stock issuance, buybacks, or other changes in the number of shares during that time.</p>
                </div>

            </div>
        );
    }
}

export default BrowseFAQ;