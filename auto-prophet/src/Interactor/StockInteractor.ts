import {IInputBoundary} from "./IInputBoundary";
import {IRequestModel} from "../Gateway/Request/IRequestModel";
import {IResponseModel} from "../Gateway/Response/IResponseModel";
import {JSONResponse} from "../Gateway/Response/JSONResponse";
import {IDataGateway} from "../Gateway/Data/IDataGateway";
import {StockRequest} from "../Entity/StockRequest";
import { StockGatewayFactory } from "@DataGateway/StockGatewayFactory";
import dep from '../../config/default.json';

export class StockInteractor implements IInputBoundary {
    requestModel: IRequestModel;
    responseModel: IResponseModel;

    async post(requestModel: IRequestModel): Promise<IResponseModel> {    
        return this.get(requestModel);
    }
    
    async get(requestModel: IRequestModel): Promise<IResponseModel> {
        //create stock request object and fill with request model
        var stock = new StockRequest();
        stock.fillWithRequest(requestModel);

         //instantiate the correct API gateway
        const stockGatewayFactory = new StockGatewayFactory();
        var stockGateway: IDataGateway = await stockGatewayFactory.createGateway(dep);

        //add the API key to the stock request object
        stock.setFieldValue("key", stockGateway.key);
        
        //search for the requested information via the API gateway
        var results = await stockGateway.read(stock);

        //convert the API gateway response to a JSON reponse object
        var response = new JSONResponse();
        response.convertFromEntity(results, false);

        return response.response;
    }

    //TODO: remove search from the list because it is the same as get.
    //TODO: add "method", "action", or something similar to the request model
    async search(requestModel: IRequestModel): Promise<IResponseModel> {
        //create stock request object and fill with request model
        var stock = new StockRequest();
        stock.fillWithRequest(requestModel);

        //instantiate the correct API gateway
        const stockGatewayFactory = new StockGatewayFactory();
        var stockGateway: IDataGateway = await stockGatewayFactory.createGateway(dep);

        //add the API key to the stock request object
        stock.setFieldValue("key", stockGateway.key);
        
        //search for the requested information via the API gateway
        var results = await stockGateway.search(stock);
    
        //convert the API gateway response to a JSON reponse object
        var response = new JSONResponse();
        response.convertFromEntity(results, false);

        return response.response;
    }
    
    async put(requestModel: IRequestModel): Promise<IResponseModel> {
        return this.get(requestModel);
    }
    
    async delete(requestModel: IRequestModel): Promise<IResponseModel> {
        return this.get(requestModel);
    }
}