import {IInputBoundary} from "./IInputBoundary";
import {IRequestModel} from "../Gateway/Request/IRequestModel";
import {IResponseModel} from "../Gateway/Response/IResponseModel";
import {JSONResponse} from "../Gateway/Response/JSONResponse";
import {IDataGateway} from "../Gateway/Data/IDataGateway";
import {LearningModule} from "../Entity/LearningModule";
import {LearningPage} from "../Entity/LearningPage";
import dep from '../../config/default.json';

export class LearningModuleInteractor implements IInputBoundary {
    requestModel: IRequestModel;
    responseModel: IResponseModel;
    
    post(requestModel: IRequestModel): Promise<IResponseModel> {
        throw new Error("Method not implemented.");
    }
    get(requestModel: IRequestModel): Promise<IResponseModel> {
        throw new Error("Method not implemented.");
    }
    put(requestModel: IRequestModel): Promise<IResponseModel> {
        throw new Error("Method not implemented.");
    }
    delete(requestModel: IRequestModel): Promise<IResponseModel> {
        throw new Error("Method not implemented.");
    }

}