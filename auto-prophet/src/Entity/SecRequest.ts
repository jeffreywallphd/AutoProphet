import {IEntity} from "./IEntity";
import {Field} from "./Field";
import {IRequestModel} from "../Gateway/Request/IRequestModel";
import {IResponseModel} from "../Gateway/Response/IResponseModel";

export class SecRequest implements IEntity {
    fields: Map<string,Field> = new Map();
    
    constructor() {
        var id = new Field("id","integer", null);
        this.fields.set("id", id);

        var ticker = new Field("ticker", "string", null);
        this.fields.set("ticker", ticker);

        var companyName = new Field("companyName", "string", null);
        this.fields.set("companyName", companyName);

        var keyword = new Field("keyword", "string", null);
        this.fields.set("keyword", keyword);

        var limit = new Field("limit", "string", null);
        this.fields.set("limit", limit);

        var sort = new Field("sort", "string", null);
        this.fields.set("sort", sort);

        var startDate = new Field("startDate", "date", null);
        this.fields.set("startDate", startDate);

        var endDate = new Field("endDate", "date", null);
        this.fields.set("endDate", endDate);

        var data = new Field("data", "array", null);
        this.fields.set("data", data);

        var key = new Field("key", "string", null);
        this.fields.set("key", key);
    }

    fillWithRequest(requestModel: IRequestModel) {
        var json = requestModel.request;

        if(!json.request.hasOwnProperty("sec")) {
            throw new Error("Making a request about financial statements requires a sec property");
        }

        if(json.request.sec.hasOwnProperty("key")) {
            this.setFieldValue("key", json.request.sec.key);
        }

        //set properties of SecRequest entity based on request model
        if(json.request.sec.hasOwnProperty("cik")) {
            this.setFieldValue("cik", json.request.sec.cik);
        }

        if(json.request.sec.hasOwnProperty("accountingStandard")) {
            this.setFieldValue("accountingStandard", json.request.sec.accountingStandard);
        } else {
            //set us-gaap as default if no other standard is provided
            this.setFieldValue("accountingStandard", "us-gaap");
        }

        if(json.request.sec.hasOwnProperty("concept")) {
            this.setFieldValue("concept", json.request.sec.concept);
        }

        if(json.request.sec.hasOwnProperty("limit")) {
            this.setFieldValue("limit", json.request.sec.limit);
        }

        if(json.request.sec.hasOwnProperty("startDate")) {
            this.setFieldValue("startDate", json.request.sec.startDate);
        }
        
        if(json.request.sec.hasOwnProperty("endDate")) {
            this.setFieldValue("endDate", json.request.sec.endDate);
        }
    }

    fillWithResponse(model: IResponseModel) {
        throw new Error("Method not implemented.");
    }

    setFieldValue(field: string, value: any) {
        if(this.fields.has(field)) {
            this.fields.get(field)?.setValue(value);
        } else {
            throw new Error("The requested data property does not exist.");
        }
    }

    getFields(): Map<string, Field> {
        return this.fields;
    }

    getFieldValue(field: string) {
        return this.fields.get(field).value;
    }

    getId() {
        return this.fields.get("id").value;
    }
}