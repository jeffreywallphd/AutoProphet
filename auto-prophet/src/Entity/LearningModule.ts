import {IEntity} from "./IEntity";
import {Field} from "./Field";
import {IRequestModel} from "../Gateway/Request/IRequestModel";
import {IResponseModel} from "../Gateway/Response/IResponseModel";
import { v4 as uuidv4 } from 'uuid';

export class LearningModule implements IEntity {
    fields: Map<string,Field> = new Map();
    
    constructor() {
        var id = new Field("id","uuid", null);
        this.fields.set("id", id);

        var title = new Field("title", "string", null);
        this.fields.set("title", title);

        var description = new Field("description", "string", null);
        this.fields.set("description", description);

        var keywords = new Field("keywords", "string", null);
        this.fields.set("keywords", keywords);

        var timeEstimate = new Field("timeEstimate", "number", null);
        this.fields.set("timeEstimate", timeEstimate);

        var pages = new Field("pages", "array:LearningPage", null);
        this.fields.set("pages", pages);

        var quiz = new Field("quiz", "object:LearningQuiz", null);
        this.fields.set("quiz", quiz);

        var dateCreated = new Field("dateCreated", "date", null);
        this.fields.set("dateCreated", dateCreated);
    }

    fillWithRequest(requestModel: IRequestModel) {
        var json = requestModel.request;

        if(!json.request.hasOwnProperty("learningModule")) {
            throw new Error("Making a request about a learning module requires a learningModule property");
        }

        //set properties of learningModule entity based on request model
        if(json.request.learningModule.hasOwnProperty("id")) {
            this.setFieldValue("id", json.request.learningModule.id);
        } else {
            //by default set id to a randomly generated UUID v4
            this.setFieldValue("id", uuidv4());
        }

        if(json.request.learningModule.hasOwnProperty("keywords")) {
            this.setFieldValue("keywords", json.request.learningModule.keywords);
        }

        if(json.request.learningModule.hasOwnProperty("title")) {
            this.setFieldValue("title", json.request.learningModule.title);
        }

        if(json.request.learningModule.hasOwnProperty("description")) {
            this.setFieldValue("description", json.request.learningModule.description);
        }

        if(json.request.learningModule.hasOwnProperty("timeEstimate")) {
            this.setFieldValue("timeEstimate", json.request.learningModule.timeEstimate);
        }

        if(json.request.learningModule.hasOwnProperty("pages")) {
            this.setFieldValue("pages", json.request.learningModule.pages);
        }
        
        if(json.request.learningModule.hasOwnProperty("quiz")) {
            this.setFieldValue("quiz", json.request.learningModule.quiz);
        }

        if(json.request.learningModule.hasOwnProperty("dateCreated")) {
            this.setFieldValue("dateCreated", json.request.learningModule.dateCreated);
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