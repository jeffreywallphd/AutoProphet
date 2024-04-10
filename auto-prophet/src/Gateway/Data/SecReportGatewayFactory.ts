import { SecAPIGateway } from "@DataGateway/SecAPIGateway";
import { AlphaVantageRatioGateway } from "@DataGateway/AlphaVantageRatioGateway";
import { IDataGateway } from "./IDataGateway";
import { EnvVariableExtractor } from "../../Utility/EnvVariableExtractor";

export class SecReportGatewayFactory {
    async createGateway(config: any): Promise<IDataGateway> {
        const extractor = new EnvVariableExtractor();

        if(config["ReportGateway"] === "SecAPIGateway") {
            return new SecAPIGateway();
        } else if(config["ReportGateway"] === "AlphaVantageRatioGateway") {
            const key = await extractor.extract("ALPHAVANTAGE_API_KEY");
            return new AlphaVantageRatioGateway(key);
        } else {
            //default will be AlphaVantage for now
            const key = await extractor.extract("ALPHAVANTAGE_API_KEY");
            return new AlphaVantageRatioGateway(key);
        }
    }
}