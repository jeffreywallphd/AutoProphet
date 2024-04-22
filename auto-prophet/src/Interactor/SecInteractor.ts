import {IInputBoundary} from "./IInputBoundary";
import {IRequestModel} from "../Gateway/Request/IRequestModel";
import {IResponseModel} from "../Gateway/Response/IResponseModel";
import { JSONRequest } from "../Gateway/Request/JSONRequest";
import {JSONResponse} from "../Gateway/Response/JSONResponse";
import { XMLResponse } from "../Gateway/Response/XMLResponse";
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

        var secRequestObj = new JSONRequest(`{
            "request": {
                "sec": {
                    "action": "companyLookup",
                    "cik": "${requestModel.request.request.sec.cik}"
                }
            }
        }`);

        const companyResponse = await this.get(secRequestObj);
        window.console.log(JSON.stringify(companyResponse));

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
        const calFileName = `${requestModel.request.request.sec.ticker.toLowerCase()}-${year}${month}${day}_cal.xml`;
        const xsdFileName = `${requestModel.request.request.sec.ticker.toLowerCase()}-${year}${month}${day}.xsd`;
        
        // TODO: Should this fetch be moved to a gateway?
        var archivesPath = `https://sec.gov/Archives/edgar/data/${zeroStrippedCik}/${accessionNumber}/`;
        window.console.log(archivesPath);
        // get _cal.xml file that contains calculation logic for building financial statements
        const reportXmlString = await fetch(archivesPath + calFileName);
        const xmlResponse = new XMLResponse(await reportXmlString.text());
        window.console.log(xmlResponse.response.documentElement.getElementsByTagName("link:calculationLink"));

        // get xsd file that contains human readable names of financial statements
        const xsdString = await fetch(archivesPath + xsdFileName);
        const xsdResponse = new XMLResponse(await xsdString.text());
        window.console.log(xsdResponse.response);
        window.console.log(xmlResponse.response.documentElement.getElementsByTagName("link:roleType"));

        var schemaResponse = null;
        var reports:any = {};
        try {
            const reportXML = xmlResponse.response;
            const reportXSD = xsdResponse.response;

            var reportCounter = 0;
            for(var report of reportXML.documentElement.getElementsByTagName("link:calculationLink")) {
                var reportId = reportXML.documentElement.getElementsByTagName("link:roleRef")[reportCounter].getAttribute("xlink:href").split("#")[1];
                //window.console.log(reportId);
                var reportNameElement = reportXSD.getElementById(reportId).getElementsByTagName("link:definition")[0];
                var reportName = reportNameElement.textContent || reportNameElement.innerText || reportNameElement.innerHTML;
                //window.console.log(reportName);
                reports[reportId] = {
                    title: reportName 
                };

                reports[reportId]["concepts"] = [];

                for(var concept of report.getElementsByTagName("link:loc")) {
                    var conceptName = concept.getAttribute("xlink:href").split("#")[1].split("_")[1];
                    if(companyResponse.response.results[0]["data"]["facts"]["us-gaap"].hasOwnProperty(conceptName) && companyResponse.response.results[0]["data"]["facts"]["us-gaap"][conceptName].hasOwnProperty("units")) {
                        var units = companyResponse.response.results[0]["data"]["facts"]["us-gaap"][conceptName]["units"];
                        var conceptValue;

                        // find the correct unit for the concept
                        if(units.hasOwnProperty("USD")) {
                            conceptValue = units["USD"][0]["val"];
                        } else if(units.hasOwnProperty("shares")) {
                            conceptValue = units["shares"][0]["val"];
                        } else if(units.hasOwnProperty("USD/shares")) {
                            conceptValue = units["USD/shares"][0]["val"];
                        } else if(units.hasOwnProperty("pure")) {
                            conceptValue = units["pure"][0]["val"];
                        } else {
                            continue;
                        }
                    
                        //window.console.log(conceptName + "=" + conceptValue);
                        reports[reportId]["concepts"].push({
                            concept: conceptName,
                            value: conceptValue
                        });
                    }   
                }

                reportCounter++;
            }

            schemaResponse = new JSONResponse(JSON.stringify(reports));
        } catch(error) {
            window.console.log(error);
            return undefined;
        }
       
        return schemaResponse.response;
    }
}