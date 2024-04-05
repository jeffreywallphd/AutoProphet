import { SecAPIGateway } from "@DataGateway/SecAPIGateway";
import { IDataGateway } from "./IDataGateway";
import { EnvVariableExtractor } from "../../Utility/EnvVariableExtractor";

export class ReportGatewayFactory {
    async createGateway(config: any): Promise<IDataGateway> {
        const extractor = new EnvVariableExtractor();
        
        if(config["ReportGateway"] === "AlphaVantageRatioGateway") {
            const key = await extractor.extract("ALPHAVANTAGE_API_KEY");
            return new SecAPIGateway(key);
        } else {
            //default will be AlphaVantage for now
            const key = await extractor.extract("ALPHAVANTAGE_API_KEY");
            return new SecAPIGateway(key);
        }
    }
}