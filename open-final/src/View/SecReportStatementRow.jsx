// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React from "react";

function SecReportStatementRow(props) {
    const getCellClass = () => {
        if(props.concept.level === 0) {
            return "total";
        } else if(props.concept.level === 1) {
            if(Object.keys(props.concept.concepts).length > 0) {
                return "indent1 subTotal";
            } else {
                return "indent1";
            }
        } else if(props.concept.level === 2) {
            if(Object.keys(props.concept.concepts).length > 0) {
                return "indent2 subTotal";
            } else {
                return "indent2";
            }
        } else if(props.concept.level === 3) {
            return "indent3";
        } else {
            return "";
        }
    };

    const getValueClass = () => {
        if(props.concept.level === 0) {
            return "statementValue total";
        } else if(props.concept.level >= 1 && Object.keys(props.concept.concepts).length > 0) {
            return "statementValue subTotal";
        } else {
            return "statementValue";
        }
    }

    const formatConceptValue = (concept, value) => {
        var preValue = "";

        if(concept.unit === "USD" || concept.unit === "USD/shares") {
            preValue += "$ ";
        }

        var valueDivided = value / concept.valueDivisor;
        
        if(valueDivided < 0) {
            valueDivided = Math.abs(valueDivided);
            return(
                <div className="valueContainer">
                    <span>{preValue}</span>
                    <span className="numericValue negative">({valueDivided.toLocaleString('en')})</span>
                </div>
            );
        } else {
            return(
                <div className="valueContainer">
                    <span>{preValue}</span>
                    <span className="numericValue">{valueDivided.toLocaleString('en')}</span>
                </div>
            );
        }
    }

    return (
        <tr className={props.rowClass}>
            <td className={getCellClass()}>{props.concept.label}</td>
            {props.dataColumns > 0 ? 
                (
                    <td className={getValueClass()}>
                        {props.concept.hasOwnProperty("previousValue") ? formatConceptValue(props.concept, props.concept.previousValue) : ""}
                    </td>
                )
                :
                (null)
            }
            <td className={getValueClass()}>
                {props.concept.hasOwnProperty("value") ? formatConceptValue(props.concept, props.concept.value) : ""}
            </td>
        </tr>
    );
}

export { SecReportStatementRow };
