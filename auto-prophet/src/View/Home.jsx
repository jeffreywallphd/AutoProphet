// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.


import React, { Component } from "react";
import * as ReactDOM from 'react-dom';
import {
  Routes,
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

import Analysis from "./Analysis";
import BuyReport from "./BuyReport";

class Home extends Component {
    render() {
        return (
            <div className="page">
                <h2>Welcome!</h2>
                <p>
                    AutoProphet is an open-source AI-enabled tool that seeks to democratize financial analysis by providing you with advanced analytics tools to help you make wise financial decisions.
                </p>
            </div>
        );
    }
}

export default Home;
