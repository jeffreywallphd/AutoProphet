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
            config.newsGateway = 'AlphaVantageNewsGateway';
        } else if (api === 'financialModelingPrep') {
            config.StockGateway = 'FinancialModelingPrepGateway';
        } // Add more conditions as needed for other APIs
        
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
        // Replace the existing API key with the new one
        const regex = new RegExp(/^(ALPHAVANTAGE_API_KEY|FINANCIALMODELINGPREP_API_KEY|YAHOO_FINANCE_API_KEY)=.*$/gm);
        envData = envData.replace(regex, `$1=${apiKey}`);
        fs.writeFileSync(envFile, envData);
        console.log('.env file updated successfully.');
    } catch (err) {
        console.error('Error updating .env file:', err);
    }
};

module.exports = {
    updateConfigFile,
    updateEnvFile
};
