// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { Component } from "react";

class BrowseFAQ extends Component {

    render() {
        return (
            <div className="page">
                <h2>FAQs:</h2>
                <h3>Tab Definitions:</h3>

                <div>
                    <h4>Porfolio</h4>
                    <p>Term- definition</p>
                    <p>Acronym (full-term)- definition</p>
                </div>

                <div>
                    <h4>Stock & Fund</h4>
                    <p>Term- definition</p>
                    <p>Acronym (full-term)- definition</p>
                </div>

                <div>
                    <h4>Risk Analysis</h4>
                    <p>Term- definition</p>
                    <p>Acronym (full-term)- definition</p>
                </div>

            </div>
        );
    }
}

export default BrowseFAQ;