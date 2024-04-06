import { IEntity } from "@Entity/IEntity";
import { IResponseModel } from "./IResponseModel";

export class XMLResponse implements IResponseModel {
    response: any;

    constructor(xml?: string) {
        if (typeof xml !== 'undefined') {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, "text/xml");

            // Handle parsing errors (optional)
            if (xmlDoc.documentElement.nodeName === "parsererror") {
                throw new Error("Error parsing XML data");
            }

            this.response = xmlDoc;
        }
    }

    convertFromEntity(entities: IEntity[]): void {
        throw new Error("Method not implemented.");
    }

}