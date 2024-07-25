import React, { useRef, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function TopicList() {
  const filterRef = useRef("FilterSelect");

  const [state, setState] = useState({
    searching: false,
    isLoading: false,
    oTopic: null,
  });

  function deleteTopic(id) {
    // fetch("http://localhost:4000/products/" + id, {
    //   method: "DELETE",
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw Error();
    //     }
    //     getTopics();
    //   })
    //   .catch((error) => {
    //     alert("Error occured while deleting: " + error);
    //   });
  }

  const getTopics = async () => {
    try {
      //   console.log("calling... sql select");

      setState((prevState) => ({
        ...prevState,
        searching: true,
      }));

      const inputData = [];
      let query =
        "SELECT tutor_topic.*,tutor_categ.code AS categ_code, tutor_categ.name AS category " +
        "FROM tutor_topic LEFT JOIN tutor_categ ON tutor_topic.categ_id = tutor_categ.id";

      if (filterRef.current.value !== "") {
        query += " WHERE categ_code=?";
        inputData.push(filterRef.current.value);
      }

      query += " ORDER BY created DESC, heading ASC";
      query += " LIMIT ?";
      inputData.push(25);

      const data = await window.electron.ipcRenderer.invoke("select-data", {
        query,
        inputData,
      });

      setState({
        oTopic: data,
        isLoading: false,
        searching: false,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getTopics();
  }, []);

  return (
    <div
      className="tab-pane fade show active"
      id="v-pills-topics"
      role="tabpanel"
      aria-labelledby="v-pills-home-tab"
      tabIndex="0"
    >
      <div className="row justify-content-center mb-3">
        <div className="input-group mb-3" style={{ width: "75%" }}>
          <select
            className="form-select"
            ref={filterRef}
            onChange={getTopics}
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
      </div>

      <div
        className="container my-4"
        id="table-data-topic"
        style={{ padding: "5px" }}
      >
        {state.oTopic ? (
          <div>
            <p>Count: {state.oTopic.length}</p>

            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Heading</th>
                  <th>Description</th>
                  <th>Category</th>
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
                {state.oTopic.map((topicItem, index) => (
                  <tr key={index}>
                    <td>{topicItem.heading}</td>
                    <td>{topicItem.description}</td>
                    <td>{topicItem.category}</td>
                    <td>{topicItem.dura_min}</td>
                    <td style={{ whitespace: "nowrap" }}>
                      {/* <NavLink
                        to="/learningModule"
                        state={{
                          topicId: topicItem.id,
                          heading: topicItem.heading,
                          description: topicItem.description,
                          duraMin: topicItem.dura_min,
                          created: topicItem.created,
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
                          topicId: topicItem.id,
                          heading: topicItem.heading,
                          description: topicItem.description,
                          duraMin: topicItem.dura_min,
                          created: topicItem.created,
                          pages: null,
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
                        onClick={() => deleteTopic(topicItem.id)}
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
            Error: learning topics or modules failed to load successfully
          </div>
        )}
      </div>
    </div>
  );
}
