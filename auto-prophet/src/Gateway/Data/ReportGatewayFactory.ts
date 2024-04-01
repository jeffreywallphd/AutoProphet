import { SecAPIGateway } from "@DataGateway/SecAPIGateway";
import { IDataGateway } from "./IDataGateway";
//import { EnvVariableExtractor } from "../../Utility/EnvVariableExtractor";

export class ReportGatewayFactory {
    async createGateway(config: any): Promise<IDataGateway> {
        //const extractor = new EnvVariableExtractor();
        
        if(config["ReportGateway"] === "SecAPIGateway") {
            const key = "" //await extractor.extract("");
            return new SecAPIGateway(key);
        } else {
            //default will be Sec for now
            const key = "" //await extractor.extract("ALPHAVANTAGE_API_KEY");
            return new SecAPIGateway(key);
        }
    }
}