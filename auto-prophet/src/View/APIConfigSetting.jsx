import React, { Component } from "react";

class Settings extends Component {
    handleSubmit = (api, apiKey) => {
        // Handle form submission logic here
        console.log('Selected API:', api);
        console.log('API Key:', apiKey);
    };

    render() {
        return (
            <div className="page">
                <h2>Settings</h2>
                <div>
                    <h1>API Configuration</h1>
                    <form onSubmit={(e) => { e.preventDefault(); }}>
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
                        <button type="submit" onClick={() => this.handleSubmit(document.getElementById('api').value, document.getElementById('apiKey').value)}>Save Configuration</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Settings;
