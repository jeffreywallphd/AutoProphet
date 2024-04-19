import {IInputBoundary} from "./IInputBoundary";
import {IRequestModel} from "../Gateway/Request/IRequestModel";
import {IResponseModel} from "../Gateway/Response/IResponseModel";
import {JSONResponse} from "../Gateway/Response/JSONResponse";
import {IDataGateway} from "../Gateway/Data/IDataGateway";
import {SecRequest} from "../Entity/SecRequest";
import {SecReportGatewayFactory} from "@DataGateway/SecReportGatewayFactory";
import { XMLResponse } from "../Gateway/Response/XMLResponse";

declare global {
    interface Window { fs: any; }
}

export class SecInteractor implements IInputBoundary {
    requestModel: IRequestModel;
    responseModel: IResponseModel;

    async post(requestModel: IRequestModel): Promise<IResponseModel> {    
        return this.get(requestModel);
    }
    
    async get(requestModel: IRequestModel): Promise<IResponseModel> {
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
    
    async put(requestModel: IRequestModel): Promise<IResponseModel> {
        return this.get(requestModel);
    }
    
    async delete(requestModel: IRequestModel): Promise<IResponseModel> {
        return this.get(requestModel);
    }

    async calculateReport(ticker:string, submissionsData: IResponseModel, companyData: IResponseModel, frequency: string="most recent", types: Array<string>=null) {
        var includedSubmissionIndices = [];
        var includedXMLSchemas = [];

        const zeroStrippedCik = submissionsData.response.results[0].cik.replace(/^0+/, "");
        
        // set default report types to consider
        if(types === null) {
            types = ["10-Q","10-K"];
        }

        // filter to include only desired SEC company submissions
        if(frequency === "most recent") {
            var foundMostRecent = false;
            // loop assumes that SEC maintains API standard of presenting most recent submissions first
            for(var i in submissionsData.response.results[0].data.filings.recent.form) {
                const reportType = submissionsData.response.results[0].data.filings.recent.form[i];
                
                for(var type of types) {
                    if(reportType === type) {
                        includedSubmissionIndices.push(i);
                        foundMostRecent = true;
                        break; //stop searching after finding the most recent matching submission   
                    }
                }
                
                if(foundMostRecent) {
                    break; //stop searching after finding the most recent matching submission   
                }
            }
        } // TODO: add other frequencies of reporting if desired
        
        for(var submissionIndex of includedSubmissionIndices) {
            const accessionNumber = submissionsData.response.results[0].data.filings.recent["accessionNumber"][submissionIndex].replace(/-/g, "");
            //const schemaDocument = `${submissionsData.response.results[0].data.filings.recent["primaryDocument"][submissionIndex]}_cal.xml`;
            
            const [year, month, day] = submissionsData.response.results[0].data.filings.recent["reportDate"][submissionIndex].split("-");
            const fileName = `${ticker}-${year}${month}${day}_cal.xml`;
            
            // TODO: Should this fetch be moved to a gateway?
            var archivesPath = `https://sec.gov/Archives/edgar/data/${zeroStrippedCik}/${accessionNumber}/${fileName}`;

            const reportSchema = await fetch(archivesPath);

            const responseDoc = new XMLResponse(await reportSchema.text());
            includedXMLSchemas.push(responseDoc);
        }

        return includedXMLSchemas;
    }
}