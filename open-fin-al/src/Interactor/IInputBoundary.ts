import {IRequestModel} from "../Gateway/Request/IRequestModel";
import {IResponseModel} from "../Gateway/Response/IResponseModel";

export interface IInputBoundary {
    requestModel: IRequestModel;
    responseModel: IResponseModel;
    post(requestModel: IRequestModel): Promise<IResponseModel>;
    get(requestModel: IRequestModel): Promise<IResponseModel>;
    put(requestModel: IRequestModel): Promise<IResponseModel>;
    delete(requestModel: IRequestModel): Promise<IResponseModel>;
}