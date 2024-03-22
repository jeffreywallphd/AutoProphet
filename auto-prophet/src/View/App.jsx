// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { Component, useEffect } from "react";
import {
  Routes,
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import { CacheManager } from "../Utility/CacheManager";

//Imports for react pages and assets
import Home from "./Home";
import Portfolio from "./Portfolio";
import Analysis from "./Analysis";
import BuyReport from "./BuyReport";
import { TimeSeries } from "./TimeSeriesPage";
import { News } from "./NewsPage";
import Learn from "./Learn";
import logo from "../Asset/Image/logo.png";
//import secCache from "../Cache/sec.json"; //TODO: load this through the new preload.js script

class AppContainer extends Component {
    // --Code for collapsable sidebar menu--
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
    // --End: Code for collapsable sidebar menu--

    render() {
        const { menuCollapsed } = this.state;

        return (
            <HashRouter>
                <div>
                    <div className="main">
                        <div className={`sidebar ${menuCollapsed ? 'collapsed' : ''}`}>
                            <button className="toggle-sidebar" onClick={this.toggleMenu}>
                                {menuCollapsed ? '>>' : '<<'}
                            </button>
                            <header className={`header ${menuCollapsed ? 'collapsed' : ''}`}>
                                <img src={logo} alt="Logo" width="150" />
                            </header>
                            <div className={`menu-items ${menuCollapsed ? 'collapsed' : ''}`}>
                                <NavLink to="/">Home</NavLink>
                                <NavLink to="/price">Stock & Fund</NavLink>
                                <NavLink to="/portfolio">Portfolio</NavLink>
                                <NavLink to="/analysis">Risk Analysis</NavLink>
                                <NavLink to="/news">Investment News</NavLink>
                                <NavLink to="/learn">Learn</NavLink>
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

//dynamic functional react required for useEffect
export function App() {
    const parsedData = null;
    /*
    //check daily for new IPOs and create/update cache map
    useEffect(() => {
        const cacheSecTickerCikMap = async () => {
            const date = new Date();
            const cacheManager = new CacheManager();
            
            try {
                //check if data has been cached for the day
                //TODO: add date logic to see when lastCached
                const cacheFilePath = `/Cache/sec/`;
                const secCache = cacheManager.extract();

                parsedData = JSON.parse(secCache);
                if (parsedData.lastCached === undefined) {
                    throw Error("The cache of mapping between ticker symbols and CIK numbers is empty");
                }

                // Calculate last time cache was updated in milliseconds, then convert to days
                const lastCachedDate = new Date(parsedData.lastCached);
                const timeDiff = Math.abs(date.getTime() - lastCachedDate.getTime());
                const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
                // Re-cache data map once per week
                if (dayDiff > 7) {
                    throw Error("The cache is outdated");
                }
            } catch (error) {
                // If cached data is unavailable or invalid, fetch from SEC
                const response = await fetch('https://www.sec.gov/include/ticker.txt');
                const secTextData = await response.text();
        
                const secData = {lastCached: date.toLocaleDateString(), data: {}};

                // Parse the text data
                const lines = secTextData.split('\n');
                const parsedData = lines.map(async (line) => {
                    const [ticker, cik] = line.split('\t');
                    
                    //Create folders based on starting letter of ticker to split SEC
                    //Used to minimzie memory and compute once cached
                    const folder = "Cache/sec/" + ticker.charAt(0).toLowerCase();
                    
                    //Store ticker:CIK pairs in folder names by starting letter of ticker
                    if(await cacheManager.makeDirectoryIfNotExists(folder)) {
                        secData.data[ticker.charAt(0).toLowerCase()][ticker] = cik;
                    } else {
                        throw Error("Failed to create folder sec cache folder " + ticker.charAt(0).toLowerCase());
                    }
                });
        
                // Cache the parsed data into the created folders
                secData.data.map(async (folder) => {
                    var folderData = {lastCached: date.toLocaleDateString(), data: {}}

                    secData.data[folder].map((ticker) => {
                        folderData["data"][ticker] = secData.data[folder][ticker];
                    });

                    var filePath = `Cache/sec/${folder}/sec.json`;
                    await cacheManager.cache(filePath, JSON.stringify(folderData));
                }); 
            }
        };

        cacheSecTickerCikMap();
    }, []);
    */
    return(
        <AppContainer/>
    );
};

//export default App;
