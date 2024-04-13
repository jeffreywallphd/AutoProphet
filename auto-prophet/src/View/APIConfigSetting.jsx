import React, { Component } from "react";
import ConfigUpdater from "../Utility/ConfigUpdater";

class Settings extends Component {
    handleSubmit = (event) => {
        // Handle form submission logic here
        event.preventDefault();
        const api = event.target.api.value;
        const apiKey = event.target.apiKey.value;

        const updater = new ConfigUpdater({api: api, apiKey: apiKey});
        
        // Update default.json with new API endpoint
        updater.updateConfigFile();

        // Update .env file with new API key
        updater.updateEnvFile();
        
        console.log('Configuration updated successfully.');
    };

    render() {
        return (
            <div className="page">
                <h2>Settings</h2>
                <div>
                    <h1>API Configuration</h1>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="api">Select API:</label>
                        <select id="api" name="api">
                            <option value="alphaVantage">AlphaVantage</option>
                            <option value="financialModelingPrep">FinancialModelingPrep</option>
                            <option value="yahooFinance">YahooFinance</option>
                        </select>
                        <br />
                        <label htmlFor="apiKey">API Key:</label>
                        <input
                            type="text"
                            id="apiKey"
                            name="apiKey"
                            // required
                        />
                        <br />
                        <small>Note: Yahoo Finance doesn't require an API key.</small>
                        <br />
                        <button type="submit">Save Configuration</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Settings;
