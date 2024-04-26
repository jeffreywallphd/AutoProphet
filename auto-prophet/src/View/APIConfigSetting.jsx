import React, { useRef, useEffect, useState } from "react";
import ConfigUpdater from "../Utility/ConfigManager";

function Settings(props) {
    const stockApiRef = useRef(null);
    const newsApiRef = useRef(null);
    var stockApiKeyRef = useRef();
    var newsAPIKeyRef = useRef();
    const [state, setState] = useState({
        hasStockApiKey: false,
        hasNewsApiKey: false,
        currentStockApiKey: null,
        currentNewsApiKey: null,
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
                ...prevstate,
                hasStockApiKey: true,
                currentStockApiKey: env.ALPHAVANTAGE_API_KEY,
                apiSize: env.ALPHAVANTAGE_API_KEY ? env.ALPHAVANTAGE_API_KEY.length : 30,
                message: null
            });
        } else if(stockApiRef.current.value === "FinancialModelingPrepGateway") {
            setState({
                ...prevstate,
                hasStockApiKey: true,
                currentStockApiKey: env.FMP_API_KEY,
                apiSize: env.FMP_API_KEY ? env.FMP_API_KEY.length : 30,
                message: null
            });
        } else {
            setState({
                ...prevstate,
                hasStockApiKey: false,
                currentStockApiKey: null,
                apiSize: 30,
                message: null
            });
        }
    };    
    
    const handleNewsApiChange = () => {
        const config = getConfigAPI(); // Get the current API from config
        const env = getEnv();

        // set the value of the API Key textbox
        if(newsApiRef.current.value === "AlphaVantageNewsGateway") {
            setState({
                ...prevstate,
                hasNewsApiKey: true,
                currentNewsApiKey: env.NEWS_API_KEY,
                apiSize: env.NEWS_API_KEY ? env.NEWS_API_KEY.length : 30,
                message: null
            });
        } else {
            setState({
                ...prevstate,
                hasNewsApiKey: false,
                currentNewsApiKey: null,
                apiSize: 30,
                message: null
            });
        }
    };

    useEffect(() => {
        const config = getConfigAPI(); // Get the current API from config

        stockApiRef.current.value = config.StockGateway;
        newsApiRef.current.value = config.NewsGateway;

        handleStockApiChange();
        handleNewsApiChange();
    }, []);

    const handleSubmit = (event) => {
        // Handle form submission logic here
        event.preventDefault();

        const stock_api = stockApiRef.current.value;
        const news_api = newsApiRef.current.value;
        var stock_apiKey = null;
        var news_apiKey = null;
        const updater = new ConfigUpdater();

         // Check if selected API requires an API key
        if (state.hasStockApiKey) {
            stock_apiKey = event.target.stock_apiKey.value;
        }

        updater.updateConfigFile({stock_api: stock_api, stock_apiKey: stock_apiKey});
        // Update .env file with new API key
        if(!state.hasStockApiKey) {
            updater.updateConfigFile();
            setState({
                ...state,
                hasStockApiKey: state.hasStockApiKey,
                currentStockApiKey: state.currentStockApiKey,
                apiSize: state.apiSize,
                message: "Successfully saved the configuration"
            });
        } else if(state.hasStockApiKey && stock_apiKey !== null && stock_apiKey !== undefined && stock_apiKey !== "") {
            // Update default.json with new API endpoint
            updater.updateConfigFile();

            updater.updateEnvFile();
            setState({
                ...state,
                hasStockApiKey: state.hasStockApiKey,
                currentStockApiKey: state.currentStockApiKey,
                apiSize: state.apiSize,
                message: "Successfully saved the configuration"
            });
        } else {
            setState({
                ...state,
                hasStockApiKey: state.hasStockApiKey,
                currentStockApiKey: state.currentStockApiKey,
                apiSize: state.apiSize,
                message: "Configuration not saved. The API key for this API may not be empty"
            });
        } 
        
        if (state.hasNewsApiKey) {
            news_apiKey = event.target.news_apiKey.value;
        }

        updater.updateConfigFile({news_api: news_api, news_apiKey: news_apiKey});
        if (!state.hasNewsApiKey) {
            updater.updateConfigFile();
            setState({
                hasNewsApiKey: state.hasNewsApiKey,
                currentNewsApiKey: state.currentNewsApiKey,
                apiSize: state.apiSize,
                message: "Successfully saved the configuration"
            });
        } else if(state.hasNewsApiKey && news_apiKey !== null && news_apiKey !== undefined && news_apiKey !== "") {
            updater.updateConfigFile();

            updater.updateEnvFile();
            setState({
                hasNewsApiKey: state.hasNewskApiKey,
                currentNewsApiKey: state.currentNewsApiKey,
                apiSize: state.apiSize,
                message: "Successfully saved the configuration"
            });
        } else {
            setState({
                hasNewsApiKey: state.hasNewsApiKey,
                currentNewsApiKey: state.currentNewsApiKey,
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
                    <div><label htmlFor="stock_api">Select a Stock Data API:</label></div>
                    <select id="stock_api" name="stock_api" ref={stockApiRef} onChange={handleStockApiChange}>
                        <option value="AlphaVantageStockGateway">Alpha Vantage API</option>
                        <option value="FinancialModelingPrepGateway">Financial Modeling Prep API</option>
                        <option value="YFinanceStockGateway">Yahoo Finance (unofficial community) API</option>
                    </select>
                    <br />
                    {/* only show API key textbox if the API requires one */}
                    {state.hasStockApiKey ?  
                        ( 
                        <>
                            <div><label htmlFor="stock_apiKey">API Key:</label></div>
                            <input type="text" id="stock_apiKey" name="stock_apiKey" size={state.apiSize} ref={stockApiKeyRef} value={state.currentStockApiKey} onChange={e => {
                                setState({ 
                                    hasStockApiKey: state.hasStockApiKey,
                                    currentStockApiKey: e.target.value,
                                    apiSize: e.target.value.length > 30 ? e.target.value.length : 30,
                                    message: null
                                });
                            }} />
                        </>
                        ) : (null)
                    }
                
                    <br />
                    <div><label htmlFor="news_api">Select a News Data API:</label></div>
                    <select id="news_api" name="news_api" ref={newsApiRef} onChange={handleNewsApiChange}>
                        <option value="AlphaVantageNewsGateway">Alpha Vantage API</option>
                    </select>
                    <br />
                    {/* only show API key textbox if the API requires one */}
                    {state.hasNewsApiKey ?  
                        ( 
                        <>
                            <div><label htmlFor="news_apiKey">API Key:</label></div>
                            <input type="text" id="news_apiKey" name="news_apiKey" size={state.apiSize} ref={newsAPIKeyRef} value={state.currentNewsApiKey} onChange={e => {
                                setState({ 
                                    hasNewsApiKey: state.hasNewsApiKey,
                                    currentNewsApiKey: e.target.value,
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
