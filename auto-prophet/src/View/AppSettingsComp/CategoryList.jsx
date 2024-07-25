import React, { useRef, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function CategoryList() {
  const filterRef = useRef("FilterSelect");

  const [state, setState] = useState({
    searching: false,
    isLoading: false,
    oCategory: null,
  });

  function deleteCategory(id) {
    // fetch("http://localhost:4000/products/" + id, {
    //   method: "DELETE",
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw Error();
    //     }
    //     getCategories();
    //   })
    //   .catch((error) => {
    //     alert("Error occured while deleting: " + error);
    //   });
  }

  const getCategories = async () => {
    try {
      //   console.log("calling... sql select");

      setState((prevState) => ({
        ...prevState,
        searching: true,
      }));

      const inputData = [];
      let query = "SELECT * FROM tutor_categ ";

      //   if (filterRef.current.value !== "") {
      //     query += " WHERE categ_code=?";
      //     inputData.push(filterRef.current.value);
      //   }

      query += " ORDER BY id desc";
      query += " LIMIT ?";
      inputData.push(25);

      const data = await window.electron.ipcRenderer.invoke("select-data", {
        query,
        inputData,
      });

      setState({
        oCategory: data,
        isLoading: false,
        searching: false,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div
      className="tab-pane fade show active"
      id="v-pills-categories"
      role="tabpanel"
      aria-labelledby="v-pills-home-tab"
      tabIndex="0"
    >
      <div
        className="container my-4"
        id="table-data-category"
        style={{ padding: "5px" }}
      >
        {state.oCategory ? (
          <div>
            <p>Count: {state.oCategory.length}</p>

            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Code</th>
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

                      {/* <span style={{ display: "flex", alignItems: "center" }}>
                        <i
                          className="fa fa-plus fa-sm"
                          style={{ fontSize: "1.0rem", marginRight: "0.5rem" }}
                        ></i>
                        Add
                      </span> */}

                      {/* <i
                        className="bi bi-plus"
                        style={{ fontSize: "1.0rem" }}
                      ></i> */}

                      {/* <i
                        className="fa fa-plus fa-sm"
                        style={{ fontSize: "1.0rem" }}
                      ></i>  */}

                      {/* <span style={{ display: "flex", alignItems: "center" }}>
                        <i
                          className="fa fa-plus fa-sm"
                          style={{ fontSize: "1.0rem", marginRight: "0.5rem" }}
                        ></i>
                        <span style={{ fontSize: "0.6rem" }}>Add</span>
                      </span> */}

                      {/* <button
                        className="btn btn-primary btn-sm"
                        // style={{
                        //   display: "flex",
                        //   alignItems: "center",
                        //   border: "none",
                        //   background: "none",
                        //   cursor: "pointer",
                        // }}
                      >
                        <i
                          className="fa fa-plus fa-sm"
                          style={{ fontSize: "1.0rem", marginRight: "0.5rem" }}
                        ></i>
                        Add
                      </button> */}
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.oCategory.map((categoryItem, index) => (
                  <tr key={index}>
                    <td>{categoryItem.name}</td>
                    <td>{categoryItem.code}</td>
                    <td style={{ whitespace: "nowrap" }}>
                      {/* <NavLink
                        to="/learningModule"
                        state={{
                          categoryId: categoryItem.id,
                          heading: categoryItem.heading,
                          description: categoryItem.description,
                          duraMin: categoryItem.dura_min,
                          created: categoryItem.created,
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
                          id: categoryItem.id,
                          name: categoryItem.name,
                          code: categoryItem.code,
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
                        onClick={() => deleteCategory(categoryItem.id)}
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
            Error: learning categories failed to load successfully
          </div>
        )}
      </div>
    </div>
  );
}
