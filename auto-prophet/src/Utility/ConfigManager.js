class ConfigUpdater {
    configFile = './config/default.json';
    envFile = './.env';
    stock_api;
    news_api;
    stock_apiKey;
    news_apiKey;
    
    constructor(args={api: null, apiKey:null}) {
        this.stock_api = args["stock_api"];
        this.news_api = args["news_api"];
        this.stock_apiKey = args["stock_apiKey"];
        this.news_apiKey = args["news_apiKey"];
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
                    FMP_API_KEY: "",
                    News_API_KEY:"",
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
            if (this.stock_api === 'AlphaVantageStockGateway') {
                config.StockGateway = 'AlphaVantageStockGateway';
            } else if (this.stock_api === 'FinancialModelingPrepGateway') {
                config.StockGateway = 'FinancialModelingPrepGateway';
            } else if (this.stock_api === 'YFinanceStockGateway') {
                config.StockGateway = 'YFinanceStockGateway';
            }

            if (this.news_api === "AlphaVantageNewsGateway") {
                config.NewsGateway = 'AlphaVantageNewsGateway';
            } 
            else {
                config.NewsGateway = 'AlphaVantageNewsGateway';
            }
            
            fs.writeFileSync(this.configFile, JSON.stringify(config, null, 4));
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
            if (this.stock_api === 'AlphaVantageStockGateway') {
                envConfig.ALPHAVANTAGE_API_KEY = this.stock_apiKey;
            } else if (this.stock_api === 'FinancialModelingPrepGateway') {
                envConfig.FMP_API_KEY = this.stock_apiKey;
            } 

            if (this.news_api === 'AlphaVantageNewsGateway') {
                envConfig.News_API_KEY === this.news_apiKey;
            }
                       
            fs.writeFileSync(this.envFile, JSON.stringify(envConfig, null, 4));
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