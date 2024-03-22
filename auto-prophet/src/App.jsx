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
import Price from "./PriceVolume/Price";
import Learn from "./Learn";

class App extends Component {
    // --Code for collapsable menu--
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
    // --End: Code for collapsable menu--
    render() {
        const { menuCollapsed } = this.state;

        return (
            <HashRouter>
                <div className={`main ${menuCollapsed ? 'menu-collapsed' : ''}`}>
                    <div class="vertical-menu">
                        <button className="toggle-menu" onClick={this.toggleMenu}>
                            {menuCollapsed ? 'Show Menu' : 'Hide Menu'}
                        </button>
                        <div className={`menu-items ${menuCollapsed ? 'collapsed' : ''}`}>
                            <NavLink to="/" activeClassName="activeNav">Home</NavLink>
                            <NavLink to="/portfolio" activeClassName="activeNav">Portfolio</NavLink>
                            <NavLink to="/analysis" activeClassName="activeNav">Analysis</NavLink>
                            <NavLink to="/price" activeClassName="activeNav">Price/Volume</NavLink>
                            <NavLink to="/learn" activeClassName="activeNav">Learn</NavLink>
                        </div>
                    </div>
                </div>
                <div>
                    <header className={`header ${menuCollapsed ? 'header-collapsed' : ''}`}>
                        <h1>Auto Prophet</h1>
                    </header>
                </div>
                <div className={`content ${menuCollapsed ? 'content-collapsed' : ''}`}>
                    <Routes>
                        <Route path="/" element={<Home />}/>
                        <Route path="/portfolio" element={<Portfolio />}/>
                        <Route path="/analysis" element={<Analysis />}/>
                        <Route path="/buy-report" element={<BuyReport />}/>
                        <Route path="/price" element={<Price />}/>
                        <Route path="/learn" element={<Learn />}/>
                    </Routes>
                </div>
            </HashRouter>
        );
    }
}

export default App;
