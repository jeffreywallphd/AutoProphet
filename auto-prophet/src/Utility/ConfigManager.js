class ConfigUpdater {
    configFile = './config/default.json';
    envFile = './.env';
    api;
    apiKey;
    
    constructor(args={api: null, apiKey:null}) {
        this.api = args["api"];
        this.apiKey = args["apiKey"];
    }

    createEnvIfNotExists() {
        const fs = window.fs.fs;

        try {
            const envExists = fs.statSync("./.env");     
        } catch(error) {
            // .env file didn't exist throws error. Try to create .env
            try {
                fs.openSync("./.env", "w");
                
                var envJson = {
                    ALPHAVANTAGE_API_KEY: "",
                    FMP_API_KEY: ""
                }

                fs.writeFileSync("./.env", JSON.stringify(envJson, null, 4));
            } catch(error2) {
                console.error(error);
            }
        }
    }

    updateConfigFile() {
        try {
            // Access fs module from the preload script
            const fs = window.fs.fs;
            
            let configData = fs.readFileSync(this.configFile, 'utf8');
            let config = JSON.parse(configData);
            
            // Update the specific API endpoint based on the selected API
            if (this.api === 'AlphaVantageStockGateway') {
                config.StockGateway = 'AlphaVantageStockGateway';
                config.NewsGateway = 'AlphaVantageNewsGateway';
            } else if (this.api === 'FinancialModelingPrepGateway') {
                config.StockGateway = 'FinancialModelingPrepGateway';
                config.NewsGateway = 'AlphaVantageNewsGateway';
            } else if (this.api === 'YFinanceStockGateway') {
                config.StockGateway = 'YFinanceStockGateway';
                config.NewsGateway = 'AlphaVantageNewsGateway';
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
            if (this.api === 'AlphaVantageStockGateway') {
                envConfig.ALPHAVANTAGE_API_KEY = this.apiKey;
            } else if (this.api === 'FinancialModelingPrepGateway') {
                envConfig.FMP_API_KEY = this.apiKey;
            } 
                       
            fs.writeFileSync(this.envFile, JSON.stringify(envConfig, null, 4));
            console.log('.env file updated successfully.');
        } catch (err) {
            console.error('Error updating .env file:', err);
        }
    }

    getEnv() {
        const fs = window.fs.fs;
    
        try {
            let envData = fs.readFileSync(this.envFile, 'utf8');
            let envConfig = JSON.parse(envData);
    
            return envConfig;
        } catch (err) {
            console.error('Error updating .env file:', err);
        }
    }

    getConfig() {
        const fs = window.fs.fs;

        try {
            // Access fs module from the preload script
            const fs = window.fs.fs;
            
            let configData = fs.readFileSync(this.configFile, 'utf8');
            let config = JSON.parse(configData);
            
            return config;
        } catch (err) {
            console.error('Error updating configuration:', err);
        }
    }
}

export default ConfigUpdater;