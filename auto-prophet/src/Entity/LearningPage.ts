import {IEntity} from "./IEntity";
import {Field} from "./Field";
import {IRequestModel} from "../Gateway/Request/IRequestModel";
import {IResponseModel} from "../Gateway/Response/IResponseModel";
import { v4 as uuidv4 } from 'uuid';

export class LearningPage implements IEntity {
    fields: Map<string,Field> = new Map();
    
    constructor() {
        var id = new Field("id","uuid", null);
        this.fields.set("id", id);

        var moduleId = new Field("moduleId", "uuid", null);
        this.fields.set("moduleId", moduleId);

        var title = new Field("title", "string", null);
        this.fields.set("title", title);

        var pageContentUrl = new Field("pageContentUrl", "string", null);
        this.fields.set("pageContentUrl", pageContentUrl);

        var voiceoverUrl = new Field("voiceoverUrl", "string", null);
        this.fields.set("voiceoverUrl", voiceoverUrl);
    }

    fillWithRequest(requestModel: IRequestModel) {
        var json = requestModel.request;

        if(!json.request.hasOwnProperty("learningPage")) {
            throw new Error("Making a request about a learning module page requires a learningPage property");
        }

        //TODO: determine how to handle the fact that learningPage will be an array of learning pages
        //set properties of learningModule entity based on request model
        if(json.request.learningModule.learningPage.hasOwnProperty("id")) {
            this.setFieldValue("id", json.request.learningModule.learningPage.id);
        } else {
            //by default set id to a randomly generated UUID v4
            this.setFieldValue("id", uuidv4());
        }

        if(json.request.learningModule.learningPage.hasOwnProperty("moduleId")) {
            this.setFieldValue("moduleId", json.request.learningModule.learningPage.keywords);
        }

        if(json.request.learningModule.learningPage.hasOwnProperty("title")) {
            this.setFieldValue("title", json.request.learningModule.learningPage.title);
        }

        if(json.request.learningModule.learningPage.hasOwnProperty("pageContentUrl")) {
            this.setFieldValue("pageContentUrl", json.request.learningModule.learningPage.pageContentUrl);
        }

        if(json.request.learningModule.learningPage.hasOwnProperty("voiceoverUrl")) {
            this.setFieldValue("voiceoverUrl", json.request.learningModule.learningPage.voiceoverUrl);
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