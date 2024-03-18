import {IRequestModel} from "../Request/IRequestModel";

export class JSONRequest implements IRequestModel {
    type: "JSON";
    request: JSON;
    
    constructor(json: string) {
        this.convert(json);
    }

    convert(request: string) {
        this.request = JSON.parse(request);
    }
}