import { SecAPIGateway } from "@DataGateway/SecAPIGateway";
import { IKeylessDataGateway } from "./IKeylessDataGateway";

export class SecReportGatewayFactory {
    async createGateway(config: any): Promise<IKeylessDataGateway> {
        
        if(config["ReportGateway"] === "SecAPIGateway") {
            return new SecAPIGateway();
        } else {
            //default will be SEC for now
            return new SecAPIGateway();
        }
    }
}