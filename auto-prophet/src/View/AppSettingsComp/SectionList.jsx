import React, { useRef, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function SectionList() {
  //   const location = useLocation();
  const filterRef = useRef("FilterSelect");

  const [state, setState] = useState({
    searching: false,
    isLoading: false,
    oSection: null,
    // topicId: null,
  });

  function deleteSection(id) {
    // fetch("http://localhost:4000/products/" + id, {
    //   method: "DELETE",
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw Error();
    //     }
    //     getSections();
    //   })
    //   .catch((error) => {
    //     alert("Error occured while deleting: " + error);
    //   });
  }

  useEffect(() => {
    getSections();
  }, []);

  const getSections = async () => {
    try {
      const inputData = [];
      var query =
        // "SELECT * FROM tutor_section WHERE topic_id=? ORDER BY order_idx ASC";

        "SELECT tutor_section.*, tutor_topic.heading AS topic_heading, section_type.code AS st_code, tutor_categ.code AS categ_code, tutor_categ.name AS categ_name " +
        "FROM tutor_section " +
        "LEFT JOIN tutor_topic ON tutor_topic.id = tutor_section.topic_id " +
        "LEFT JOIN section_type ON section_type.id = tutor_section.sect_type_id " +
        "LEFT JOIN tutor_categ ON tutor_categ.id = tutor_topic.categ_id ";

      // "WHERE topic_id=? " +
      // "ORDER BY tutor_topic.id, order_idx ASC";

      // "SELECT * FROM LearningModulePage WHERE moduleId=? ORDER BY pageNumber ASC";

      //     console.log("topicId:", location.state.topicId);

      //   if (searchRef.current.value !== "") {
      //     query += " WHERE keywords LIKE '%' || ? || '%'";
      //     inputData.push(searchRef.current.value);
      //   }

      //   if (filterRef.current.value !== "" && searchRef.current.value !== "") {
      //     query += " AND categ_code=?";
      //     inputData.push(filterRef.current.value);
      //   } else if (filterRef.current.value !== "") {
      //     query += " WHERE categ_code=?";
      //     inputData.push(filterRef.current.value);
      //   }

      query += " ORDER BY tutor_topic.id, order_idx ASC";

      query += " LIMIT ?";
      const limit = 25;
      inputData.push(limit);
      await window.electron.ipcRenderer
        .invoke("select-data", { query, inputData })
        .then((data) => {
          setState({
            oSection: data,
            isLoading: false,
            searching: false,
          });
        });

      //   inputData.push(location.state.topicId);
      //   await window.electron.ipcRenderer
      //     .invoke("select-data", { query, inputData })
      //     .then((data) => {
      //       setState({
      //         oSection: data,
      //         isLoading: false,
      //       });
      //     });

      //   console.log("oSection list: " + state.oSection.length);
      //   console.log("oSection list: " + state.oSection);
      //
    } catch (error) {
      console.error("Error fetching data:" + error);
    }
  };

  //   const getSections2 = async () => {
  //     try {
  //       console.log("calling... sql select");

  //       setState((prevState) => ({
  //         ...prevState,
  //         searching: true,
  //       }));

  //       const inputData = [];
  //       let query =
  //         "SELECT tutor_topic.*,tutor_categ.code AS categ_code, tutor_categ.name AS category " +
  //         "FROM tutor_topic LEFT JOIN tutor_categ ON tutor_topic.categ_id = tutor_categ.id";

  //       if (filterRef.current.value !== "") {
  //         query += " WHERE categ_code=?";
  //         inputData.push(filterRef.current.value);
  //       }

  //       query += " ORDER BY created DESC, heading ASC";
  //       query += " LIMIT ?";
  //       inputData.push(25);

  //       const data = await window.electron.ipcRenderer.invoke("select-data", {
  //         query,
  //         inputData,
  //       });

  //       setState({
  //         oSection: data,
  //         isLoading: false,
  //         searching: false,
  //       });
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  return (
    <div
      className="tab-pane fade show active"
      id="v-pills-sections"
      role="tabpanel"
      aria-labelledby="v-pills-home-tab"
      tabIndex="0"
    >
      {/* <div className="row justify-content-center mb-3">
        <div className="input-group mb-3" style={{ width: "75%" }}>
          <select
            className="form-select"
            ref={filterRef}
            onChange={getSections}
            style={{ width: "100%", height: "45px" }}
          >
            <option value="">Select a category...</option>
            <option value="Stock">Stocks</option>
            <option value="Index">Index Funds</option>
            <option value="Bond">Bonds</option>
            <option value="Tax">Taxes</option>
            <option value="RiskAnalysis">Risk Analysis</option>
            <option value="MLAI">AI and Machine Learning</option>
          </select>
        </div>
      </div> */}

      <div
        className="container my-4"
        id="table-data-section"
        style={{ padding: "5px" }}
      >
        {state.oSection ? (
          <div>
            <p>Total: {state.oSection.length}</p>

            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Heading</th>
                  <th>Topic</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Min</th>
                  <th style={{ width: "150px", whitespace: "nowrap" }}>
                    <Link
                      className="btn btn-secondary btn-xs me-1"
                      //   to="/learningModule"
                      //   state={{
                      //     id: categoryItem.id,
                      //     name: categoryItem.name,
                      //     code: categoryItem.code,
                      //     //   pages: null,
                      //   }}
                      style={{
                        "--bs-btn-padding-y": ".25rem",
                        "--bs-btn-padding-x": ".25rem",
                        "--bs-btn-font-size": "1.0rem",
                      }}
                    >
                      <i
                        className="fa fa-plus fa-sm"
                        style={{
                          fontSize: "1.0rem",
                          marginLeft: "0.1rem",
                          marginRight: "0.5rem",
                        }}
                      ></i>
                      <span style={{ fontSize: "0.8rem" }}>New</span>
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.oSection.map((sectionItem, index) => (
                  <tr key={index}>
                    <td>{sectionItem.heading}</td>
                    <td>{sectionItem.topic_heading}</td>
                    <td>{sectionItem.categ_name}</td>
                    <td>{sectionItem.st_code}</td>
                    <td>{sectionItem.dura_min}</td>
                    <td style={{ whitespace: "nowrap" }}>
                      {/* <NavLink
                        to="/learningModule"
                        state={{
                          sectionId: sectionItem.id,
                          heading: sectionItem.heading,
                          description: sectionItem.description,
                          duraMin: sectionItem.dura_min,
                          created: sectionItem.created,
                          pages: null,
                        }}
                        className="btn btn-sm btn-outline-secondary mt-auto text-xs"
                        data-bs-toggle="modal"
                        data-bs-target="#currModModal"
                        style={{ textDecoration: "none" }}
                      >
                        Open
                      </NavLink> */}

                      <Link
                        className="btn btn-outline-primary btn-xs me-1"
                        to="/learningModule"
                        state={{
                          sectionId: sectionItem.id,
                          heading: sectionItem.heading,
                          description: sectionItem.description,
                          //   duraMin: sectionItem.dura_min,
                          //   created: sectionItem.created,
                          //   pages: null,
                        }}
                        style={{
                          "--bs-btn-padding-y": ".25rem",
                          "--bs-btn-padding-x": ".5rem",
                          "--bs-btn-font-size": ".75rem",
                        }}
                      >
                        <i
                          className="bi bi-pencil-square"
                          style={{ marginRight: "5px", fontSize: "1.0rem" }}
                        ></i>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger"
                        style={{
                          "--bs-btn-padding-y": ".25rem",
                          "--bs-btn-padding-x": ".5rem",
                          "--bs-btn-font-size": ".75rem",
                        }}
                        onClick={() => deleteSection(sectionItem.id)}
                      >
                        <i
                          className="bi bi-trash"
                          style={{ fontSize: "1.0rem" }}
                        ></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : state.isLoading ? (
          <div className="text-center">Loading table data...</div>
        ) : (
          <div className="text-center">
            Error: learning sections failed to load successfully
          </div>
        )}
      </div>
    </div>
  );
}
