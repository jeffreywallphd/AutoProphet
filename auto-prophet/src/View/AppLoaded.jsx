// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { Component } from "react";
import {
  Routes,
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

//Imports for react pages and assets
import Home from "./Home";
import Portfolio from "./Portfolio";
import { Analysis } from "./Analysis";
import BuyReport from "./BuyReport";
import { TimeSeries } from "./TimeSeriesPage";
import { News } from "./NewsPage";
import { Learn } from "./Learn";
import { LearningModuleDetails } from "./LearningModuleDetails";
import { LearningModulePage } from "./LearningModulePage";
import logo from "../Asset/Image/logo.png";
import navIcon from "../Asset/Image/navIcon.png"

class AppLoaded extends Component {
    // --Code for collapsible menu--
    constructor(props) {
        super(props);
        this.state = {
            menuCollapsed: false
        };
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu() {
        this.setState(prevState => ({
            menuCollapsed: !prevState.menuCollapsed
        }));
    }
    // --End: Code for collapsible menu--

    render() {
        const { menuCollapsed } = this.state;

        return (
            <HashRouter>
                <div>
                    <div className="main">
                        <div className={`sidebar ${menuCollapsed ? 'collapsed' : ''}`}>
                            <button id="navButton">
                                <img className="toggle-menu" id="navIcon" onClick={this.toggleMenu} src={menuCollapsed ? navIcon : navIcon} alt="navIcon" />
                            </button>
                            <header className={`header ${menuCollapsed ? 'collapsed' : ''}`}>
                                <img src={logo} alt="Logo" width="150" />
                            </header>
                            <div className={`menu-items ${menuCollapsed ? 'collapsed' : ''}`}>
                                <NavLink to="/">Home</NavLink>
                                <NavLink to="/learn">Learn</NavLink>
                                <NavLink to="/price">Stock & Fund</NavLink>
                                <NavLink to="/portfolio">Portfolio</NavLink>
                                <NavLink to="/analysis">Risk Analysis</NavLink>
                                <NavLink to="/news">News</NavLink>                                
                            </div>
                        </div>
                        <div className="content">
                            <Routes>
                                <Route path="/" element={<Home />}/>
                                <Route path="/portfolio" element={<Portfolio />}/>
                                <Route path="/analysis" element={<Analysis />}/>
                                <Route path="/buy-report" element={<BuyReport />}/>
                                <Route path="/price" element={<TimeSeries />}/>
                                <Route path="/news" element={<News />}/>
                                <Route path="/learn" element={<Learn />}/>
                                <Route path="/learningModule" element={<LearningModuleDetails />}/>
                                <Route path="/learningModulePage" element={<LearningModulePage />}/>
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

export default AppLoaded;
