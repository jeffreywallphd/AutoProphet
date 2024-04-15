// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.


import React, { Component } from "react";

class Portfolio extends Component {
    portfolioValue = 2534.26;
    buyingPower = 500.00;

    render() {
        return (
            <div className="page">
                <h2>Portfolio Simulator</h2>
                <div>
                    <h3>Portfolio Value: <span>${this.portfolioValue}</span></h3>
                    <p>Buying Power: <span>${this.buyingPower}</span></p>
                </div>
                <div className="portfolioTableContainer">
                    <table className="portfolioTable">
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Company</th>
                                <th>Current Price</th>
                                <th>Purchase Price</th>
                                <th>Quantity</th>
                                <th>Gains</th>
                                <th>% Gain</th>
                            </tr>
                        </thead>
                        <tr>
                            <td>F</td>
                            <td>Ford Motor Company</td>
                            <td className="numeric">13.45</td>
                            <td className="numeric">13.00</td>
                            <td className="numeric">10</td>
                            <td className="numeric">4.50</td>
                            <td className="numeric">+3.46%</td>
                        </tr>
                        <tr>
                            <td>GOOG</td>
                            <td>Alphabet Inc.</td>
                            <td className="numeric">13.45</td>
                            <td className="numeric">13.00</td>
                            <td className="numeric">10</td>
                            <td className="numeric">4.50</td>
                            <td className="numeric">+3.46%</td>
                        </tr>
                        <tr>
                            <td>TSLA</td>
                            <td>Tesla</td>
                            <td className="numeric">13.45</td>
                            <td className="numeric">13.00</td>
                            <td className="numeric">10</td>
                            <td className="numeric">4.50</td>
                            <td className="numeric">+3.46%</td>
                        </tr>
                        <tr>
                            <td>AAPL</td>
                            <td>Apple</td>
                            <td className="numeric">13.45</td>
                            <td className="numeric">13.00</td>
                            <td className="numeric">10</td>
                            <td className="numeric">4.50</td>
                            <td className="numeric">+3.46%</td>
                        </tr>
                        <tr>
                            <td>Dow</td>
                            <td>Dow</td>
                            <td className="numeric">13.45</td>
                            <td className="numeric">13.00</td>
                            <td className="numeric">10</td>
                            <td className="numeric">4.50</td>
                            <td className="numeric">+3.46%</td>
                        </tr>
                    </table>
                </div>
            </div>
        );
    }
}

export default Portfolio;
