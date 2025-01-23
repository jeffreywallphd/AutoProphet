import {IResponseModel} from "./IResponseModel";

export interface IPresenterGateway {
    toString(response: IResponseModel): String;
}