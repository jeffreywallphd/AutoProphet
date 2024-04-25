// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React from "react";

function SecReportStatementRow(props) {
    const getCellClass = () => {
        if(props.concept.level === 1) {
            return "indent1";
        } else if(props.concept.level === 2) {
            return "indent2";
        } else if(props.concept.level === 3) {
            return "indent3";
        } else {
            return "";
        }
    };

    return (
        <tr className={props.rowClass}>
            <td className={getCellClass()}>{props.concept.label}</td>
            <td className="statementValue">{props.concept.hasOwnProperty("value") ? props.concept.value : ""}</td>
        </tr>
    );
}

export { SecReportStatementRow };
