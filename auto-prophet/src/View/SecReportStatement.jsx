// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React from "react";
import { SecReportStatementRow } from "./SecReportStatementRow";

function SecReportStatement(props) {
    const allConcepts = [];

    const processConcepts = (concept) => {
        allConcepts.push(concept);
        concept.concepts = concept.concepts || {};
        for (const childConceptId in concept.concepts) {
          processConcepts(concept.concepts[childConceptId]);
        }
    };
    
    Object.keys(props.concepts).forEach((conceptKey) => {
        processConcepts(props.concepts[conceptKey]);
    });

    return (
        <>
            {props ?
                <> 
                    <h3>{props.statementName}</h3>
                    <table className="statementTable">
                        <thead>
                            <tr>
                                <th></th>
                                <th>{props.statementDate}</th>
                            </tr>
                        </thead>
                        <tbody>
                        {allConcepts.map((concept, index) => {
                            const rowClass = index % 2 ? "" : "alternating";

                            return (
                                <SecReportStatementRow rowClass={rowClass} concept={concept}/>
                            )
                        })}
                        </tbody>
                    </table>
                </>
                :
                <div>Loading...</div> 
            }
            
        </>
    );
}

export { SecReportStatement };
