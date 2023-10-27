// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.


import React, { Component } from "react";

class BuyReport extends Component {
    render() {
        return (
            <div className="page">
                <h2>Buy Report</h2>

                <form action="report.html" method="post">
                    <label for="CIKNum">CIK Number: </label>
                    <input type="text" id="CIKNum" name="CIKNum"/><br/><br/>

                    <input type="radio" id="10-K" name="filingType"/>
                    <label for="10-K">10-K</label><br/>
                    <input type="radio" id="10-Q" name="filingType"/>
                    <label for="10-Q">10-Q</label><br/><br/>

                    <label for="start">Start Date: </label>
                    <input type="date" id="start" name="start"/><br/>

                    <label for="end">End Date: </label>
                    <input type="date" id="end" name="end"/><br/><br/>

                    <input type="submit" value="Submit"/>
                </form>

            </div>
        );
    }
}

export default BuyReport;
