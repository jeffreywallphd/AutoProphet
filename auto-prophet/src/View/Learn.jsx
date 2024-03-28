// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { useState, useEffect } from "react";
import {
    NavLink,
    useLocation
} from "react-router-dom";

export function Learn() {
    const location = useLocation();
    const [state, setState] = useState({
        modules: null,
        isLoading: true
    });

    useEffect(() => {
        selectData("Stock");
    }, []);

    const selectData = async (category) => {
        try {
            const query = "SELECT * FROM LearningModule WHERE category=?"
            const inputData = [category];
            
            await window.electron.ipcRenderer.invoke('select-data', { query, inputData }).then((data) => {
                setState({
                    modules: data,
                    isLoading: false
                  });
            });
        } catch (error) {
            window.terminal.log('Error fetching data:' + error);
        }
    };

    return (
        <div className="page">
            <h2>Financial Learning Modules</h2>
            { state.modules ? 
                ( state.modules.map((module, index) => (
                <div>
                    <h3>{module.title}</h3>
                    <p>Description: {module.description}</p>
                    <p>Estimated Time: {module.estimatedTime} minutes</p>
                    <NavLink to="/learningModule" state={{
                        title: module.title,
                        description: module.description,
                        estimatedTime: module.estimatedTime,
                        dataCreated: module.dateCreated,
                        pages: null}}>View Module</NavLink>
                    </div>)))
                : state.isLoading === true ? 
                    (<div>Loading...</div>)
                :
                    (<div>Error: Unable to load the learning modules</div>)
                
            }
        </div>
    );
}
