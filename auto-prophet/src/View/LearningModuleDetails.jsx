// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

export function LearningModuleDetails(props) {
  const location = useLocation();
  const [state, setState] = useState({
    pages: null,
    isLoading: true,
  });

  useEffect(() => {
    selectPageData();
  }, []);

  const selectPageData = async () => {
    try {
      // TODO: move this query building to a Gateway implementation for SQLite
      // so that it can easily be configured with other databases later
      const inputData = [];
      var query =
        // "SELECT * FROM tutor_section WHERE topic_id=? ORDER BY order_idx ASC";

        "SELECT tutor_section.*, tutor_topic.heading AS topic_heading, section_type.code AS st_code " +
        "FROM tutor_section " +
        "LEFT JOIN tutor_topic ON tutor_topic.id = tutor_section.topic_id " +
        "LEFT JOIN section_type ON section_type.id = tutor_section.sect_type_id " +
        "WHERE topic_id=? " +
        "ORDER BY order_idx ASC";

      // "SELECT * FROM LearningModulePage WHERE moduleId=? ORDER BY pageNumber ASC";

      console.log("topicId:", location.state.topicId);

      inputData.push(location.state.topicId);
      await window.electron.ipcRenderer
        .invoke("select-data", { query, inputData })
        .then((data) => {
          setState({
            pages: data,
            isLoading: false,
          });
        });
    } catch (error) {
      console.error("Error fetching data:" + error);
    }
  };

  return (
    <div className="page">
      <div>
        <h3>{location.state.heading}</h3>
        <p>Description: {location.state.description}</p>
        <p>Estimated Time: {location.state.duraMin} minutes</p>
      </div>
      {state.isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <NavLink
            to="/learningModulePage"
            state={{
              pages: state.pages,
              currentPageIndex: 0,
            }}
          >
            Start Module...
          </NavLink>
        </div>
      )}
    </div>
  );
}
