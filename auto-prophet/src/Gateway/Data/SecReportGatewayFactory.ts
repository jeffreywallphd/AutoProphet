import { SecAPIGateway } from "@DataGateway/SecAPIGateway";
import { IDataGateway } from "./IDataGateway";

export class SecReportGatewayFactory {
    async createGateway(config: any): Promise<IDataGateway> {
        
        if(config["ReportGateway"] === "SecAPIGateway") {
            return new SecAPIGateway();
        } else {
            //default will be SEC for now
            return new SecAPIGateway();
        }
    }
}