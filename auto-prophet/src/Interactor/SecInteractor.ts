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

    // TODO: break up this method into multiple methods
    async getReport(requestModel: IRequestModel): Promise<IResponseModel> {
        const zeroStrippedCik = requestModel.request.request.sec.cik.replace(/^0+/, "");
        const type = requestModel.request.request.sec.action;

        // get SEC report data from companyFacts API
        var secRequestObj = new JSONRequest(`{
            "request": {
                "sec": {
                    "action": "companyLookup",
                    "cik": "${requestModel.request.request.sec.cik}"
                }
            }
        }`);

        const companyResponse = await this.get(secRequestObj);

        // get SEC submissions from submissions API
        secRequestObj = new JSONRequest(`{
            "request": {
                "sec": {
                    "action": "submissionsLookup",
                    "cik": "${requestModel.request.request.sec.cik}"
                }
            }
        }`);

        const submissionsResponse = await this.get(secRequestObj);

        const mostRecentSubmissionIndex:number = this.findMostRecentFilingIndex(submissionsResponse, type);

        // set up response object to fill with data
        const response = {response: {
            reportDate: submissionsResponse.response.results[0].data.filings.recent["reportDate"][mostRecentSubmissionIndex],
            filingDate: submissionsResponse.response.results[0].data.filings.recent["filingDate"][mostRecentSubmissionIndex],
            statements: {}
        }};
        
        // accession number associated with the particular report on the SEC's website
        const accessionNumber = submissionsResponse.response.results[0].data.filings.recent["accessionNumber"][mostRecentSubmissionIndex].replace(/-/g, "");
        
        // create consistent filename format used for SEC reports
        const [year, month, day] = submissionsResponse.response.results[0].data.filings.recent["reportDate"][mostRecentSubmissionIndex].split("-");
        const calFileName = `${requestModel.request.request.sec.ticker.toLowerCase()}-${year}${month}${day}_cal.xml`;
        const xsdFileName = `${requestModel.request.request.sec.ticker.toLowerCase()}-${year}${month}${day}.xsd`;
        
        // TODO: Should these fetches be moved to a gateway?
        var archivesPath = `https://sec.gov/Archives/edgar/data/${zeroStrippedCik}/${accessionNumber}/`;

        // get _cal.xml file that contains calculation logic for building financial statements
        const reportXmlString = await fetch(archivesPath + calFileName);
        const xmlResponse = new XMLResponse(await reportXmlString.text());

        // get xsd file that contains human readable names of financial statements
        const xsdString = await fetch(archivesPath + xsdFileName);
        const xsdResponse = new XMLResponse(await xsdString.text());

        var schemaResponse = null;
        var reports:any = {};
        try {
            const reportXML = xmlResponse.response;
            const reportXSD = xsdResponse.response;

            var reportCounter = 0;
            // loop through all of the financial statements in link:calculationLink element
            for(var report of reportXML.documentElement.getElementsByTagName("link:calculationLink")) {
                // extract financial statement information from XML/XSD
                var reportId = reportXML.documentElement.getElementsByTagName("link:roleRef")[reportCounter].getAttribute("xlink:href").split("#")[1];
                var reportNameElement = reportXSD.getElementById(reportId).getElementsByTagName("link:definition")[0];
                var reportName = reportNameElement.textContent || reportNameElement.innerText || reportNameElement.innerHTML;
                
                // parse the report name and get the portion after the last hyphen
                const nameSegments = reportName.split("-");
                reportName = nameSegments[nameSegments.length-1]
                reports[reportId] = {
                    title: reportName,
                    concepts: {} 
                };

                // create an object to lookup concepts easily
                const conceptLocations = report.getElementsByTagName("link:loc");
                const conceptLookupObj: { [key: string]: any } = {};
              
                // loop over concept locations to create concept lookup object
                for (const conceptLocation of conceptLocations) {
                    const conceptId = conceptLocation.getAttribute("xlink:href").split("#")[1].split("_")[1];
                    const concept = this.getConceptDetails(companyResponse.response.results[0]["data"]["facts"], conceptId, type);
                    
                    // add keys for xlink:label for xlink:from and :to lookup; return conceptId
                    conceptLookupObj[conceptLocation.getAttribute("xlink:label")] = conceptId;
                    
                    // add keys for conceptId for concept storage
                    if(!conceptLookupObj.hasOwnProperty(conceptId)) {
                        conceptLookupObj[conceptId] = concept;
                    }
                }
                window.console.log(JSON.stringify(conceptLookupObj));
                // infer the parent and children of each concept
                for(var conceptCalc of report.getElementsByTagName("link:calculationArc")) {
                    //get the parent and child of the calculation arc
                    const parentConceptXLink = conceptCalc.getAttribute("xlink:from");
                    const parentConceptId = conceptLookupObj[parentConceptXLink];
                    const childConceptXLink = conceptCalc.getAttribute("xlink:to");
                    const childConceptId = conceptLookupObj[childConceptXLink];

                    conceptLookupObj[childConceptId]["parent"] = parentConceptId;
                    conceptLookupObj[childConceptId]["level"] = conceptLookupObj[parentConceptId]["level"] + 1;
                    const childConcept = conceptLookupObj[childConceptId];
                    conceptLookupObj[parentConceptId]["concepts"][childConceptId] = childConcept;
                }

                // extract root objects from conceptLookupObj
                for(var key in conceptLookupObj) {
                    if(conceptLookupObj[key].hasOwnProperty("parent") && conceptLookupObj[key]["parent"] === "root") {
                        reports[reportId]["concepts"][key] = conceptLookupObj[key];
                    }
                }

                window.console.log("hello2");
                //reports[reportId]["concepts"] = conceptLookupObj;
                window.console.log(reports);
                reportCounter++;
            }

            window.console.log(JSON.stringify(reports));
            // add reports object to response object
            response.response.statements = reports;

            //TODO: for consistency, consider wrapping object in {response: {}}
            schemaResponse = new JSONResponse(JSON.stringify(response));
        } catch(error) {
            window.console.log(error);
            return undefined;
        }
       
        return schemaResponse.response;
    }

    private processConceptHierarchy(concepts: any, parentConceptId: string, childConceptId: string) {
        if(childConceptId in concepts) {
            concepts[parentConceptId]["concepts"][childConceptId] = concepts[childConceptId];
            delete concepts[childConceptId];

            for(const conceptId in concepts[parentConceptId]["concepts"]) {
                this.processConceptHierarchy(concepts[parentConceptId]["concepts"], childConceptId, conceptId);
            }
        } 

        return concepts;
    }

    private findMostRecentFilingIndex(submissionsResponse: IResponseModel, type:string): number {
        var index = undefined;
        
        // loop assumes that SEC maintains API standard of presenting most recent submissions first
        for(var i in submissionsResponse.response.results[0].data.filings.recent.form) {
            const reportType = submissionsResponse.response.results[0].data.filings.recent.form[i];
            
            if(reportType === type) {
                return index = Number(i);
            }
        }

        return index;
    }

    private getConceptDetails(data:any, concept:string, reportType:string="10-K", source:string="us-gaap") {
        const conceptObj: { [key: string]: any } = {
            conceptId: null,
            unit: null,
            label: null,
            description: null,
            value: null,
            level: null,
            parent: "root",
            concepts: {}    
        };
        
        if(!data[source].hasOwnProperty(concept)) {
            return conceptObj;
        }

        // get concept details from SEC company facts API
        var units = data[source][concept]["units"];
        var conceptLabel = data[source][concept]["label"];
        var conceptDescription = data[source][concept]["description"];
        var unit;

        // find the correct unit for the concept
        // find most recent index for the specified report type (i.e., 10-K or 10-Q)
        if(units.hasOwnProperty("USD")) {
            unit = "USD";                 
        } else if(units.hasOwnProperty("shares")) {
            unit = "shares";
        } else if(units.hasOwnProperty("USD/shares")) {
            unit = "USD/shares"
        } else if(units.hasOwnProperty("pure")) {
            unit = "pure"
        } else {
            window.console.log("unit unclear: " + concept);
            return undefined;
        }

        const value = this.getConceptValue(data[source][concept]["units"][unit], reportType);

        conceptObj["conceptId"] = concept;
        conceptObj["unit"] = unit;
        conceptObj["label"] = conceptLabel;
        conceptObj["description"] = null; //conceptDescription;
        conceptObj["value"] = value ? value : null;
        conceptObj["level"] = 0;
        conceptObj["parent"] = "root";
        conceptObj["concepts"] = {};
        window.console.log(concept);
        return conceptObj;
    }

    private getConceptValue(data:any, reportType:string) {
        const startingIndex = data.length - 1;
        const index = this.findIndexForConceptValue(data, reportType, startingIndex);

        if(index === undefined) {
            return undefined;
        } else {
            return data[index]["val"];
        }
    }

    private findIndexForConceptValue(data:any, reportType:string, index:number = 0) {
        try {
            if(data[index]["form"] === reportType) {
                return index;
            } else {
                this.findIndexForConceptValue(data, reportType, index-1);
            }
        } catch(error) {
            window.console.log("error finding index: " + error);
            return undefined;
        }

        if(index === 0) {
            return undefined;
        }
    }
}