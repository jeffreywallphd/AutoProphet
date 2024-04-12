// Function to update default.json with new API endpoint
const updateConfigFile = (api) => {
    const configFile = './config/default.json';
    try {
        // Access fs module from the preload script
        const fs = window.fs;
        
        let configData = fs.readFileSync(configFile, 'utf8');
        let config = JSON.parse(configData);
        
        // Update the specific API endpoint based on the selected API
        if (api === 'alphaVantage') {
            config.StockGateway = 'AlphaVantageStockGateway';
            config.NewsGateway = 'AlphaVantageNewsGateway';
        } else if (api === 'financialModelingPrep') {
            config.StockGateway = 'FinancialModelingPrepGateway';
            config.NewsGateway = 'AlphaVantageNewsGateway';
        } else if (api === 'YahooFinance') {
            config.StockGateway = 'YFinanceStockGateway';
            config.NewsGateway = 'AlphaVantageNewsGateway';
        }
        
        fs.writeFileSync(configFile, JSON.stringify(config, null, 4));
        console.log('Configuration updated successfully.');
    } catch (err) {
        console.error('Error updating configuration:', err);
    }
};

// Function to update .env file with new API key
const updateEnvFile = (apiKey) => {
    // Access fs module from the preload script
    const fs = window.fs;

    const envFile = './.env';
    try {
        let envData = fs.readFileSync(envFile, 'utf8');
        let envConfig = JSON.parse(envData);

        // Update the specific API key based on the provided key
        envConfig.ALPHAVANTAGE_API_KEY = apiKey;
        
        
        fs.writeFileSync(envFile, JSON.stringify(envConfig, null, 4));
        console.log('.env file updated successfully.');
    } catch (err) {
        console.error('Error updating .env file:', err);
    }
};

module.exports = {
    updateConfigFile,
    updateEnvFile
};
