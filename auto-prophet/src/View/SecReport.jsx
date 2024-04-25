// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SecInteractor } from "../Interactor/SecInteractor";
import { JSONRequest } from "../Gateway/Request/JSONRequest";
import { SecReportStatement } from "./SecReportStatement";

function SecReport(props) {
    const location = useLocation();
    const [state, setState] = useState(null);

    const fetchReport = async () => {
        var secInteractor = new SecInteractor();
        var secRequestObj = new JSONRequest(`{
            "request": {
                "sec": {
                    "action": "${location.state.report}",
                    "cik": "${location.state.cik}",
                    "ticker": "${location.state.ticker}"
                }
            }
        }`);

        const reportResults = await secInteractor.get(secRequestObj);

        setState({...location.state, secReportData: reportResults.response});
    };

    useEffect(() => {
        fetchReport();
    }, [location.state]);

    return (
        <div className="page">
            <NavLink to="/price">Back</NavLink>
            <h2>Form {location.state.report} for {location.state.data.response.results[0]["companyName"]}</h2>
            
                {state ? 
                        <div>
                            <p>Report filed on {state.secReportData.filingDate} for period ending {state.secReportData.reportDate}</p>
                            {Object.keys(state.secReportData.statements).map((key) => {
                                var report = state.secReportData.statements[key];
                                return <SecReportStatement statementDate={state.secReportData.reportDate} statementName={report.title} concepts={report.concepts} />
                            })}
                        </div>
                    : 
                        <div>Loading...</div>
                }
            
        </div>
    );
}

export { SecReport };
