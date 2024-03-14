import { AlphaVantageStockGateway } from "@DataGateway/AlphaVantageStockGateway";
import { IDataGateway } from "./IDataGateway";
import { EnvVariableExtractor } from "../../Utility/EnvVariableExtractor";

export class StockGatewayFactory {
    async createGateway(config: any): Promise<IDataGateway> {
        const extractor = new EnvVariableExtractor();
        
        //TODO: add other gateways, such as Yahoo Finance API
        if(config["StockGateway"] === "AlphaVantageStockGateway") {
            const key = await extractor.extract("ALPHAVANTAGE_API_KEY");
            return new AlphaVantageStockGateway(key);
        } else {
            const key = await extractor.extract("ALPHAVANTAGE_API_KEY");
            return new AlphaVantageStockGateway(key);
        }
    }
}