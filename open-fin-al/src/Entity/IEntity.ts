import {Field} from "./Field";
import {IRequestModel} from "../Gateway/Request/IRequestModel";
import {IResponseModel} from "../Gateway/Response/IResponseModel";

export interface IEntity {
    fields: Map<string, Field>;

    getFields(): Map<string, Field>;
    getFieldValue(field: string): any;
    setFieldValue(field: string, value: any): void;
    fillWithRequest(requestModel: IRequestModel): void;
    fillWithResponse(responseModel: IResponseModel): void;
    getId(): any;
}