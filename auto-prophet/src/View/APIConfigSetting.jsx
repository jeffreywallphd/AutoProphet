import React, { Component } from "react";
import ConfigUpdater from "../Utility/ConfigUpdater";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAPI: "alphaVantage", // Default selected API
            apiKeyRequired: true // Initially, assume API key is required
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { selectedAPI } = this.state;
        const api = selectedAPI;
         // Check if selected API requires an API key
        if (selectedAPI !== "yahooFinance") {
            const apiKey = event.target.apiKey.value;

            const updater = new ConfigUpdater({api: api, apiKey: apiKey});
            
            updater.updateConfigFile();
            updater.updateEnvFile();
            
            console.log('Configuration updated successfully.');
        } else {
            // Handle form submission for Yahoo Finance (no API key required)
            const updater = new ConfigUpdater({api: api});
            
            updater.updateConfigFile();
            
            console.log('Configuration updated successfully.');
        }
    };
    
    handleAPIChange = (event) => {
        const selectedAPI = event.target.value;
        const apiKeyRequired = selectedAPI !== "yahooFinance"; // Yahoo Finance doesn't require API key
        this.setState({ selectedAPI, apiKeyRequired });
    };

    render() {
        const { selectedAPI, apiKeyRequired } = this.state;

        return (
            <div className="page">
                <h2>Settings</h2>
                <div>
                    <h1>API Configuration</h1>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="api">Select API:</label>
                        <select id="api" name="api" onChange={this.handleAPIChange} value={selectedAPI}>
                            <option value="alphaVantage">AlphaVantage</option>
                            <option value="financialModelingPrep">FinancialModelingPrep</option>
                            <option value="yahooFinance">YahooFinance</option>
                        </select>
                        <br />
                        {apiKeyRequired && (
                            <>
                                <label htmlFor="apiKey">API Key:</label>
                                <input
                                    type="text"
                                    id="apiKey"
                                    name="apiKey"
                                    required
                                />
                            </>
                        )}
                        <br />
                        {selectedAPI !== "yahooFinance" && (
                            <small>Note: Yahoo Finance doesn't require an API key.</small>
                        )}
                        <br />
                        <button type="submit">Save Configuration</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Settings;
