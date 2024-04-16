import React, { useRef, useEffect, useState } from "react";
import ConfigUpdater from "../Utility/ConfigManager";

function Settings(props) {
    const stockApiRef = useRef(null);
    var stockApiKeyRef = useRef();
    const [state, setState] = useState({
        hasStockApiKey: false,
        currentApiKey: null,
        apiSize: 30,
        message: null
    });

    const getConfigAPI = () => {
        const updater = new ConfigUpdater();
        return updater.getConfig();
    };

    const getEnv = () => {
        const updater = new ConfigUpdater();
        return updater.getEnv();
    };

    // some stock APIs don't have API keys
    const handleStockApiChange = () => {
        const config = getConfigAPI(); // Get the current API from config
        const env = getEnv();

        // set the value of the API Key textbox
        if(stockApiRef.current.value === "AlphaVantageStockGateway") {
            setState({
                hasStockApiKey: true,
                currentApiKey: env.ALPHAVANTAGE_API_KEY,
                apiSize: env.ALPHAVANTAGE_API_KEY ? env.ALPHAVANTAGE_API_KEY.length : 30,
                message: null
            });
        } else if(stockApiRef.current.value === "FinancialModelingPrepGateway") {
            setState({
                hasStockApiKey: true,
                currentApiKey: env.FMP_API_KEY,
                apiSize: env.FMP_API_KEY ? env.FMP_API_KEY.length : 30,
                message: null
            });
        } else {
            setState({
                hasStockApiKey: false,
                currentApiKey: null,
                apiSize: 30,
                message: null
            });
        }
    };

    useEffect(() => {
        const config = getConfigAPI(); // Get the current API from config

        stockApiRef.current.value = config.StockGateway;

        handleStockApiChange();
    }, []);

    const handleSubmit = (event) => {
        // Handle form submission logic here
        event.preventDefault();

        const api = stockApiRef.current.value;
        var apiKey = null;
         // Check if selected API requires an API key
        if (state.hasStockApiKey) {
            apiKey = event.target.apiKey.value;
        }

        const updater = new ConfigUpdater({api: api, apiKey: apiKey});
        // Update .env file with new API key
        if(!state.hasStockApiKey) {
            updater.updateConfigFile();
            setState({
                hasStockApiKey: state.hasStockApiKey,
                currentApiKey: state.currentApiKey,
                apiSize: state.apiSize,
                message: "Successfully saved the configuration"
            });
        } else if(state.hasStockApiKey && apiKey !== null && apiKey !== undefined && apiKey !== "") {
            // Update default.json with new API endpoint
            updater.updateConfigFile();

            updater.updateEnvFile();
            setState({
                hasStockApiKey: state.hasStockApiKey,
                currentApiKey: state.currentApiKey,
                apiSize: state.apiSize,
                message: "Successfully saved the configuration"
            });
        } else {
            setState({
                hasStockApiKey: state.hasStockApiKey,
                currentApiKey: state.currentApiKey,
                apiSize: state.apiSize,
                message: "Configuration not saved. The API key for this API may not be empty"
            });
        }              
    };

    return (
        <div className="page">
            <h2>Settings</h2>
            <div>
                <h3>Stock Data API Configuration</h3>
                <form onSubmit={handleSubmit}>
                    <div><label htmlFor="api">Select a Stock Data API:</label></div>
                    <select id="api" name="api" ref={stockApiRef} onChange={handleStockApiChange}>
                        <option value="AlphaVantageStockGateway">Alpha Vantage API</option>
                        <option value="FinancialModelingPrepGateway">Financial Modeling Prep API</option>
                        <option value="YFinanceStockGateway">Yahoo Finance (unofficial community) API</option>
                    </select>
                    <br />
                    {/* only show API key textbox if the API requires one */}
                    {state.hasStockApiKey ?  
                        ( 
                        <>
                            <div><label htmlFor="apiKey">API Key:</label></div>
                            <input type="text" id="apiKey" name="apiKey" size={state.apiSize} ref={stockApiKeyRef} value={state.currentApiKey} onChange={e => {
                                setState({ 
                                    hasStockApiKey: state.hasStockApiKey,
                                    currentApiKey: e.target.value,
                                    apiSize: e.target.value.length > 30 ? e.target.value.length : 30,
                                    message: null
                                });
                            }} />
                        </>
                        ) : (null)
                    }
                
                    <br />
                    <button type="submit">Save Configuration</button>
                    <p>{state.message}</p>
                </form>
            </div>
        </div>
    );
}

export { Settings };
