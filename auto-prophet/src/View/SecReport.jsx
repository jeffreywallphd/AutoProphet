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

        setState({...location.state, secReportData: reportResults});
    };

    useEffect(() => {
        fetchReport();
    }, [location.state]);

    return (
        <div className="page">
            <NavLink to="/price">Back</NavLink>
            <h2>{location.state.report}</h2>
            <div>
                {state ? 
                        <>
                            {Object.keys(state.secReportData).map((key) => {
                                window.console.log(key);
                                var report = state.secReportData[key];
                                return <SecReportStatement statementName={report.title} concepts={report.concepts} />
                            })}
                        </>
                    : 
                        <div>Report could not be displayed</div>
                }
            </div>
        </div>
    );
}

export { SecReport };
