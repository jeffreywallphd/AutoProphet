import {IInputBoundary} from "./IInputBoundary";
import {IRequestModel} from "../Gateway/Request/IRequestModel";
import {IResponseModel} from "../Gateway/Response/IResponseModel";
import {JSONResponse} from "../Gateway/Response/JSONResponse";
import {IDataGateway} from "../Gateway/Data/IDataGateway";
import {StockRequest} from "../Entity/StockRequest";
import { StockGatewayFactory } from "@DataGateway/StockGatewayFactory";
import { SQLiteCompanyLookupGateway } from "@DataGateway/SQLiteCompanyLookupGateway";
import dep from '../../config/default.json';

export class StockInteractor implements IInputBoundary {
    requestModel: IRequestModel;
    responseModel: IResponseModel;

    async post(requestModel: IRequestModel): Promise<IResponseModel> {    
        return this.get(requestModel);
    }
    
    async get(requestModel: IRequestModel): Promise<IResponseModel> {
        const date = new Date();

        //create stock request object and fill with request model
        var stock = new StockRequest();
        stock.fillWithRequest(requestModel);
        
        var stockGateway: IDataGateway
        // use internal database for company/ticker/cik lookups
        if(requestModel.request.request.stock.action === "lookup") {
            stockGateway = new SQLiteCompanyLookupGateway();
            
            //check to see if the PublicCompany table is filled and has been updated recently
            const lastUpdated = await stockGateway.checkLastTableUpdate();

            if(lastUpdated === undefined) {
                // Calculate last time cache was updated in milliseconds; convert to days
                const timeDiff = Math.abs(date.getTime() - lastUpdated.getTime());
                const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                // Re-cache particular folder data map if more than 7 days old
                if (dayDiff > 7) {
                    throw Error("The cache is outdated");
                }
            }

        } else {
            //instantiate the correct API gateway
            const stockGatewayFactory = new StockGatewayFactory();
            stockGateway = await stockGatewayFactory.createGateway(dep);
            
            //add the API key to the stock request object
            stock.setFieldValue("key", stockGateway.key);
        } 

        //search for the requested information via the API gateway
        var results = await stockGateway.read(stock, requestModel.request.request.stock.action);

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