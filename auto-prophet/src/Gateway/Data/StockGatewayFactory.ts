import { AlphaVantageStockGateway } from "@DataGateway/AlphaVantageStockGateway";
import { IDataGateway } from "./IDataGateway";
import { EnvVariableExtractor } from "../../Utility/EnvVariableExtractor";
import { FinancialModelingPrepGateway } from "./FMPStockGateway";

export class StockGatewayFactory {
    async createGateway(config: any): Promise<IDataGateway> {
        const extractor = new EnvVariableExtractor();
        window.console.log(config["StockGateway"]);
        //TODO: add other gateways, such as Yahoo Finance API
        if(config["StockGateway"] === "AlphaVantageStockGateway") {
            const key = await extractor.extract("ALPHAVANTAGE_API_KEY");
            return new AlphaVantageStockGateway(key);
        }
        // For Financial Modeling Prep
        else if(config["StockGateway"] === "FMPStockGateway"){
            const key = await extractor.extract("FMP_API_KEY");
            return new FinancialModelingPrepGateway(key)
        }
         else {
            //default will be AlphaVantage for now
            const key = await extractor.extract("ALPHAVANTAGE_API_KEY");
            return new AlphaVantageStockGateway(key);
        }
    }
}