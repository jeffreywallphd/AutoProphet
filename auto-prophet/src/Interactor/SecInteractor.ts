import {IInputBoundary} from "./IInputBoundary";
import {IRequestModel} from "../Gateway/Request/IRequestModel";
import {IResponseModel} from "../Gateway/Response/IResponseModel";
import { JSONRequest } from "../Gateway/Request/JSONRequest";
import {JSONResponse} from "../Gateway/Response/JSONResponse";
import {IDataGateway} from "../Gateway/Data/IDataGateway";
import {SecRequest} from "../Entity/SecRequest";
import {SecReportGatewayFactory} from "@DataGateway/SecReportGatewayFactory";

declare global {
    interface Window { fs: any; }
}

declare global {
    interface Window { convert: any; }
}

export class SecInteractor implements IInputBoundary {
    requestModel: IRequestModel;
    responseModel: IResponseModel;

    async post(requestModel: IRequestModel): Promise<IResponseModel> {    
        return this.get(requestModel);
    }
    
    async get(requestModel: IRequestModel): Promise<IResponseModel> {
        window.console.log(requestModel.request.request.sec.action);
        if(requestModel.request.request.sec.action === "10-K" || requestModel.request.request.sec.action === "10-Q") {
            return this.getReport(requestModel);    
        } else {
            //create sec request object and fill with request model
            var sec = new SecRequest();
            sec.fillWithRequest(requestModel);

            //instantiate the correct API gateway
            const config = window.fs.fs.readFileSync('./config/default.json', "utf-8");
            const secGatewayFactory = new SecReportGatewayFactory();
            var secGateway: IDataGateway = await secGatewayFactory.createGateway(JSON.parse(config));

            sec.setFieldValue("key", secGateway.key);
            
            //search for the requested information via the API gateway
            var results = await secGateway.read(sec, requestModel.request.request.sec.action);
            
            //convert the API gateway response to a JSON reponse object
            var response = new JSONResponse();
            
            response.convertFromEntity(results, false);

            return response.response;
        }
        
    }
    
    async put(requestModel: IRequestModel): Promise<IResponseModel> {
        return this.get(requestModel);
    }
    
    async delete(requestModel: IRequestModel): Promise<IResponseModel> {
        return this.get(requestModel);
    }

    async getReport(requestModel: IRequestModel): Promise<IResponseModel> {
        var includedSubmissionIndices = [];

        const zeroStrippedCik = requestModel.request.request.sec.cik.replace(/^0+/, "");
        const type = requestModel.request.request.sec.action;
        window.console.log(JSON.stringify(requestModel));
        var secRequestObj = new JSONRequest(`{
            "request": {
                "sec": {
                    "action": "companyLookup",
                    "cik": "${requestModel.request.request.sec.cik}"
                }
            }
        }`);

        const companyResponse = await this.get(secRequestObj);

        secRequestObj = new JSONRequest(`{
            "request": {
                "sec": {
                    "action": "submissionsLookup",
                    "cik": "${requestModel.request.request.sec.cik}"
                }
            }
        }`);

        const submissionsResponse = await this.get(secRequestObj);
        
        // filter to include only desired SEC company submissions
        var foundMostRecent = false;
        // loop assumes that SEC maintains API standard of presenting most recent submissions first
        for(var i in submissionsResponse.response.results[0].data.filings.recent.form) {
            const reportType = submissionsResponse.response.results[0].data.filings.recent.form[i];
            
            if(reportType === type) {
                includedSubmissionIndices.push(i);
                foundMostRecent = true;
                break; //stop searching after finding the most recent matching submission   
            }
        }
        
        const accessionNumber = submissionsResponse.response.results[0].data.filings.recent["accessionNumber"][includedSubmissionIndices[0]].replace(/-/g, "");
        //const schemaDocument = `${submissionsData.response.results[0].data.filings.recent["primaryDocument"][submissionIndex]}_cal.xml`;
        
        const [year, month, day] = submissionsResponse.response.results[0].data.filings.recent["reportDate"][includedSubmissionIndices[0]].split("-");
        const fileName = `${requestModel.request.request.sec.ticker.toLowerCase()}-${year}${month}${day}_cal.xml`;
        
        // TODO: Should this fetch be moved to a gateway?
        var archivesPath = `https://sec.gov/Archives/edgar/data/${zeroStrippedCik}/${accessionNumber}/${fileName}`;
        window.console.log(archivesPath);
        const reportSchemaXmlString = await fetch(archivesPath);

        var schemaResponse = {};
        try {
            const reportSchemaJson = await window.convert.xmlToJson.parseStringPromise(await reportSchemaXmlString.text());
            schemaResponse = new JSONResponse(JSON.stringify(reportSchemaJson));
        } catch(error) {
            window.console.log(error);
            return undefined;
        }
       
        const combinedResponse = {response: {
            schema: schemaResponse,
            data: companyResponse.response.results[0].data
        }}

        const response = new JSONResponse(JSON.stringify(combinedResponse));
        return response.response;
    }
}