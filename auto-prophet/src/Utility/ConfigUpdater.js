class ConfigUpdater {
    configFile = './config/default.json';
    envFile = './.env';
    api;
    apiKey;
    
    constructor(args) {
        this.api = args["api"];
        this.apiKey = args["apiKey"];
    }

    updateConfigFile() {
        try {
            // Access fs module from the preload script
            const fs = window.fs.fs;
            
            let configData = fs.readFileSync(this.configFile, 'utf8');
            let config = JSON.parse(configData);
            
            // Update the specific API endpoint based on the selected API
            if (this.api === 'alphaVantage') {
                config.StockGateway = 'AlphaVantageStockGateway';
                config.newsGateway = 'AlphaVantageNewsGateway';
            } else if (this.api === 'financialModelingPrep') {
                config.StockGateway = 'FinancialModelingPrepGateway';
                config.newsGateway = 'AlphaVantageNewsGateway';
            } else if (this.api === 'yahooFinance') {
                config.StockGateway = 'YFinanceStockGateway';
                config.newsGateway = 'AlphaVantageNewsGateway';
            }
            
            fs.writeFileSync(this.configFile, JSON.stringify(config, null, 4));
            console.log('Configuration updated successfully.');
        } catch (err) {
            console.error('Error updating configuration:', err);
        }
    }
    
    // Function to update .env file with new API key
    updateEnvFile() {
        // Access fs module from the preload script
        const fs = window.fs.fs;
    
        try {
            let envData = fs.readFileSync(this.envFile, 'utf8');
            let envConfig = JSON.parse(envData);
    
            // Update the specific API key based on the selected API
            if (this.api === 'alphaVantage') {
                envConfig.ALPHAVANTAGE_API_KEY = this.apiKey;
            } else if (this.api === 'financialModelingPrep') {
                envConfig.FMP_API_KEY = this.apiKey;
            } 
                       
            fs.writeFileSync(this.envFile, JSON.stringify(envConfig, null, 4));
            console.log('.env file updated successfully.');
        } catch (err) {
            console.error('Error updating .env file:', err);
        }
    }
}

export default ConfigUpdater;