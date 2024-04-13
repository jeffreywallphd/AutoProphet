// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Forecast extends Component {
    render() {
        return (
            <div className="page">
                <h2>Forecast</h2>
                <p>
                    There are many different models that can be used to forecast movements in the market.
                </p>
                <section className="cardRow">
                    <NavLink to="/forecast-features">
                      <div className="card">
                        <div className="cardHeader">
                            <h3>Create Custom Data Features</h3>
                        </div>
                        <div className="cardContainer">
                            <img scr="../Asset/Image/binary_header.jpg" alt="header image"/>
                            <p>If you would like to create custom data features for prediction and forecasting models, this page will help you do so. For example, you can choose different types windows for moving average calculations. You can save your data features and use them in different forecasting models.</p>
                        </div>
                      </div>
                    </NavLink>
                    <NavLink to="/forecast-models">
                      <div className="card">
                        <div className="cardHeader">
                            <h3>Select a Forecasting Model</h3>
                        </div>
                        <div className="cardContainer">
                          <p>Select and run forecasts using different forecasting models using traditional time series models or machine learning and AI models.</p>
                        </div>
                      </div>
                    </NavLink>
                </section>
            </div>
        );
    }
}

export default Forecast;
