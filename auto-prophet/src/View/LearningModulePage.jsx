// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { Component } from "react";
import {
    NavLink,
    useLocation
  } from "react-router-dom";

export function LearningModulePage(props) {
    const state = {
        "title": null,
        "pages": null,
        "currentPage": null,
    };

    const location = useLocation();

    return (
        <div className="page">
            <div>
                <h2>{location.state.title}</h2>
            </div>
            <div>
                <NavLink to="/learningModulePage" state={{
                    "title": "Dividend Example 2",
                    "pages": null,
                    "currentPage": 2,
                }}>Next Page</NavLink>
            </div>
            <div>Page {location.state.currentPage}</div>
        </div>
        );
}

export default LearningModulePage;
