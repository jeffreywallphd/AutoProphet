// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { Component } from "react";
import * as ReactDOM from "react-dom";
import { Routes, Route, NavLink, HashRouter } from "react-router-dom";

import Analysis from "./Analysis";
import BuyReport from "./BuyReport";

class Home extends Component {
  render() {
    return (
      <div className="page">
        <h2>Welcome!</h2>
       
        <p>
          AutoProphet is an open-source AI-enabled tool that seeks to
          democratize financial analysis by providing you with advanced
          analytics tools to help you make wise financial decisions.
        </p>
        <section className="cardRow">
          <NavLink to="/buy-report">
            <div className="card">
              <div className="cardHeader">
                <h3>Buy Report</h3>
              </div>
              <div className="cardContainer">
                <p>
                  Gather performance information about publicly traded firms,
                  such as quarterly and annual reports, to help you determine
                  whether to invest in a company.
                </p>
              </div>
            </div>
          </NavLink>
          <NavLink to="/analysis">
            <div className="card">
              <div className="cardHeader">
                <h3>Advanced Analytics</h3>
              </div>
              <div className="cardContainer">
                <p>
                  Select from different advanced analytics tools, including
                  machine learning and AI tools, to help you identify market
                  trends.
                </p>
              </div>
              
              <span className ="ellipse1"></span>
              <span className ="ellipse2"></span>
              <span cassName ="ellipse3"></span>
         
            </div>
          </NavLink>
        </section>
      </div>
    );
  }
}

export default Home;
