// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export function Learn2vws() {
  const location = useLocation();
  const [state, setState] = useState({
    modules: null,
    isLoading: true,
    searching: false,
    pages: null,
  });

  const searchRef = useRef("SearchTextField");
  const filterRef = useRef("FilterSelect");

  useEffect(() => {
    selectData();
    selectPageData();
  }, []);

  //Checks the keyUp event to determine if a key was hit
  const checkInput = async (e) => {
    //fetch data when Enter key pressed
    if (e.key === "Enter") {
      await selectData();
    }
  };

  const selectData = async () => {
    try {
      setState({
        modules: state.modules,
        isLoading: state.isLoading,
        searching: true,
      });

      // TODO: move this query building to a Gateway implementation for SQLite
      // so that it can easily be configured with other databases later
      const inputData = [];
      var query = "SELECT * FROM LearningModule";

      // TODO: use more sophisticated NLP query, such as: https://www.sqlite.org/fts5.html
      if (searchRef.current.value !== "") {
        query += " WHERE keywords LIKE '%' || ? || '%'";
        inputData.push(searchRef.current.value);
      }

      if (filterRef.current.value !== "" && searchRef.current.value !== "") {
        query += " AND category=?";
        inputData.push(filterRef.current.value);
      } else if (filterRef.current.value !== "") {
        query += " WHERE category=?";
        inputData.push(filterRef.current.value);
      }

      query += " ORDER BY dateCreated DESC, title ASC";

      query += " LIMIT ?";
      const limit = 25;
      inputData.push(limit);
      await window.electron.ipcRenderer
        .invoke("select-data", { query, inputData })
        .then((data) => {
          setState({
            modules: data,
            isLoading: false,
            searching: false,
          });
        });
    } catch (error) {
      console.error("Error fetching data:" + error);
    }
  };

  const selectPageData = async () => {
    try {
      // TODO: move this query building to a Gateway implementation for SQLite
      // so that it can easily be configured with other databases later
      const inputData1 = [];
      var query1 =
        "SELECT * FROM LearningModulePage WHERE moduleId=? ORDER BY pageNumber ASC";

      inputData1.push(location.state.moduleId);
      await window.electron.ipcRenderer
        .invoke("select-data", { query1, inputData1 })
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
    <div className="page" style={{ margin: "0 5%", overflow: "auto" }}>
      <div
        className="container"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="row ">
          <div className="col-12 text-center mb-4">
            <h2>Financial Learning Modules</h2>
          </div>
          <div className="col-md-8 offset-md-2">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await selectData();
              }}
            >
              <div className="row justify-content-center">
                <div className="input-group mb-3" style={{ width: "75%" }}>
                  <select
                    className="form-select"
                    ref={filterRef}
                    onChange={selectData}
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

                <div className="input-group mb-4" style={{ width: "75%" }}>
                  <input
                    type="text"
                    className="form-control"
                    ref={searchRef}
                    onKeyUp={(e) => checkInput(e)}
                    placeholder="Custom search topic to learn about"
                    aria-label="Recipient's username"
                    aria-describedby="button-addon2"
                    style={{ height: "40px" }}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="submit"
                    id="button-addon2"
                    disabled={state.searching}
                    style={{ height: "40px" }}
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div
            class="modal fade"
            id="currModModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    Topic Info
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  {state.modules &&
                    state.modules.map(
                      (moduleModal, index) => moduleModal.description
                    )}
                </div>
                {/* <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" class="btn btn-primary">
                    Save changes
                  </button>
                </div> */}
              </div>
            </div>
          </div>

          {state.modules ? (
            state.modules.map((module, index) => (
              <div className="col-md-6" key={index}>
                <div
                  className="card mb-4"
                  style={{
                    height: "90%",
                    margin: "5px",
                  }}
                >
                  <div
                    className="card-body"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <h5 className="card-title text-primary ellipsis">
                      {module.title}
                    </h5>
                    <p
                      className="ellipsis text-xs"
                      style={{ fontSize: "0.9rem", margin: "5px 0", flex: "1" }}
                    >
                      {module.description}
                    </p>

                    <div class="row">
                      <div class="col-sm-4 d-flex align-items-center justify-content-start">
                        <p
                          className="text-danger ellipsis"
                          style={{ fontSize: "0.8rem", color: "#555" }}
                        >
                          {module.timeEstimate} min read
                        </p>
                      </div>

                      <div class="col-sm d-flex align-items-center justify-content-end">
                        {/* <button
                          type="button"
                          class="btn btn-sm btn-outline-info"
                          data-bs-toggle="modal"
                          data-bs-target="#currModModal"
                          style={{ fontSize: "0.9rem; " }}
                        >
                          Peek Info
                        </button>
                        &nbsp; */}
                        {/*  &bull; &nbsp; */}
                        &nbsp;
                        <NavLink
                          to="/learningModule"
                          state={{
                            moduleId: module.id,
                            title: module.title,
                            description: module.description,
                            timeEstimate: module.timeEstimate,
                            dateCreated: module.dateCreated,
                            pages: null,
                          }}
                          className="btn btn-sm btn-outline-secondary mt-auto text-xs"
                          data-bs-toggle="modal"
                          data-bs-target="#currModModal"
                          style={{ textDecoration: "none" }}
                        >
                          Peek Info
                        </NavLink>
                        &nbsp;
                        {/* <button
                          type="button"
                          class="btn btn-sm btn-info"
                          style={{ fontSize: "0.9rem;" }}
                        >
                          <NavLink
                            to="/learningModule"
                            state={{
                              moduleId: module.id,
                              title: module.title,
                              description: module.description,
                              timeEstimate: module.timeEstimate,
                              dateCreated: module.dateCreated,
                              pages: null,
                            }}
                            className="btn btn-sm btn-info mt-auto text-sm"
                            style={{ textDecoration: 'none' }}
                          >
                            Open Module
                          </NavLink>
                        </button> */}
                        <NavLink
                          to="/learningModule"
                          state={{
                            moduleId: module.id,
                            title: module.title,
                            description: module.description,
                            timeEstimate: module.timeEstimate,
                            dateCreated: module.dateCreated,
                            pages: null,
                          }}
                          className="btn btn-sm btn-primary mt-auto text-xs"
                          style={{ textDecoration: "none" }}
                        >
                          Open Module
                        </NavLink>
                        {/* <LearningModuleDetails
                          page={props.pages[props.currentPageIndex]}
                          registerSlide={handleSlide}
                        /> */}
                        {/* &nbsp;
                        <NavLink
                          to="/learningModulePage"
                          state={{
                            moduleId: module.id,
                            pages: state.pages,
                            currentPageIndex: 0,
                          }}
                        >
                          Start...
                        </NavLink> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : state.isLoading ? (
            <div className="col-12 text-center">Loading...</div>
          ) : (
            <div className="col-12 text-center">
              Error: Unable to load the learning modules
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
