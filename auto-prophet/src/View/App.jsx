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

import Home from "./Home";
import Portfolio from "./Portfolio";
import Analysis from "./Analysis";
import BuyReport from "./BuyReport";
import TimeSeriesPage from "./TimeSeriesPage";
import logo from "../Asset/Image/logo.png";
import icon from "../Asset/Image/icon.png";

class App extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <div className="main">
                        <div className="sidebar">
                            <header className="header">
                                <img src={logo} alt="Logo" width="150" />
                            </header>
                            <nav>
                                <ul className="navigation">
                                    <li><NavLink to="/">Home</NavLink></li>
                                    <li><NavLink to="/price">Stock & Fund</NavLink></li>
                                    <li><NavLink to="/portfolio">Portfolio</NavLink></li>
                                    <li><NavLink to="/analysis">Risk Analysis</NavLink></li>
                                </ul>
                            </nav>
                        </div>
                        <div className="content">
                            <Routes>
                            <Route path="/" element={<Home />}/>
                            <Route path="/portfolio" element={<Portfolio />}/>
                            <Route path="/analysis" element={<Analysis />}/>
                            <Route path="/buy-report" element={<BuyReport />}/>
                            <Route path="/price" element={<TimeSeriesPage />}/>
                            </Routes>
                        </div>
                    </div>
                    <footer>
                        This software is licensed under the GPL-3.0 license. 
                    </footer>
                </div>
            </HashRouter>
        );
    }
}

export default App;
