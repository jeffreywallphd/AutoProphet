import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import ConfigUpdater from "../Utility/ConfigManager";
// import { LearnSlideSet } from "./LearnSlideSet";
import { NavLink, useLocation } from "react-router-dom";
import { AppSettingsStocksAPI } from "./AppSettingsStocksAPI";
import TopicList from "./AppSettingsComp/TopicList";
import SectionList from "./AppSettingsComp/SectionList";
import CategoryList from "./AppSettingsComp/CategoryList";
// import { FaSearch } from "react-icons/fa";

function Settings(props) {
  // const location = useLocation();
  const [state, setState] = useState({
    hasStockApiKey: false,
    hasNewsApiKey: false,
    hasReportApiKey: false,
    hasRatioApiKey: false,
    currentStockApiKey: null,
    currentNewsApiKey: null,
    currentReportApiKey: null,
    currentRatioApiKey: null,
    apiSize: 40,
    message: null,

    filterRefVal: null,
    searching: false,
    isLoading: false,
    dsTopics: null,
    dsSections: null,
    dsCategories: null,

    modTopic: null,

    modTopic1: [],
    // isLoading: false,
    form: {
      id: "",
      heading: "",
      description: "",
      keywords: "",
      categ_id: "",
      dura_min: "",
      is_pub: "",
      source: "",
      author: "",
      last_upd: "",
    },
  });

  // useEffect(() => {
  //   updateConfigAndState();

  //   // const config = getConfigAPI(); // Get the current API from config
  //   // stockApiRef.current.value = config.StockGateway;
  //   // newsApiRef.current.value = config.NewsGateway;
  //   // reportApiRef.current.value = config.ReportGateway;
  //   // ratioApiRef.current.value = config.RatioGateway;
  //   // var newState = state;
  //   // newState = handleStockApiChange(null, newState, true);
  //   // newState = handleNewsApiChange(null, newState, true);
  //   // newState = handleReportApiChange(null, newState, true);
  //   // newState = handleRatioApiChange(null, newState, true);
  //   // setState({ ...newState });

  //   selectData_Topics();
  // }, []);

  // useEffect(() => {

  //   selectData_Topics();
  // }, []); // Runs once after initial render

  // const searchRef = useRef("SearchTextField");
  const filterRef = useRef("FilterSelect");

  const stockApiRef = useRef("AlphaVantageStockGateway");
  const newsApiRef = useRef("AlphaVantageNewsGateway");
  const reportApiRef = useRef("SecAPIGateway");
  const ratioApiRef = useRef("AlphaVantageRatioGateway");

  var stockApiKeyRef = useRef();
  var newsApiKeyRef = useRef();
  var reportApiKeyRef = useRef();
  var ratioApiKeyRef = useRef();

  // const express = require("express");
  // const mysql = require("mysql");
  // const path = require("path");
  // const app = express();

  // const location = useLocation();

  const getConfigAPI = () => {
    const updater = new ConfigUpdater();
    return updater.getConfig();
  };

  const getEnv = () => {
    const updater = new ConfigUpdater();
    return updater.getEnv();
  };

  // some stock APIs don't have API keys
  const handleStockApiChange = (
    event = null,
    newState = null,
    isLoading = false
  ) => {
    const env = getEnv();

    if (newState === null) {
      newState = state;
    }

    // set the value of the API Key textbox; don't include API here if no API key
    if (stockApiRef.current.value === "AlphaVantageStockGateway") {
      newState["hasStockApiKey"] = true;
      newState["currentStockApiKey"] = env.ALPHAVANTAGE_API_KEY;
      newState["message"] = null;
    } else if (stockApiRef.current.value === "FinancialModelingPrepGateway") {
      newState["hasStockApiKey"] = true;
      newState["currentStockApiKey"] = env.FMP_API_KEY;
      newState["message"] = null;
    } else {
      newState["hasStockApiKey"] = false;
      newState["currentStockApiKey"] = null;
      newState["message"] = null;
    }

    if (!isLoading) {
      setState({ ...newState });
    }

    return newState;
  };

  const handleNewsApiChange = (
    event = null,
    newState = null,
    isLoading = false
  ) => {
    const env = getEnv();

    if (newState === null) {
      newState = state;
    }

    // set the value of the API Key textbox; don't include API here if no API key
    if (newsApiRef.current.value === "AlphaVantageNewsGateway") {
      newState["hasNewsApiKey"] = true;
      newState["currentNewsApiKey"] = env.ALPHAVANTAGE_API_KEY;
      newState["message"] = null;
    } else {
      newState["hasNewsApiKey"] = false;
      newState["currentNewsApiKey"] = null;
      newState["message"] = null;
    }

    if (!isLoading) {
      setState({ ...newState });
    }

    return newState;
  };

  const handleReportApiChange = (
    event = null,
    newState = null,
    isLoading = false
  ) => {
    const env = getEnv();

    if (newState === null) {
      newState = state;
    }

    // set the value of the API Key textbox; don't include API here if no API key
    // will need if statements if future keyed gateways are used

    newState["hasReportApiKey"] = false;
    newState["currentReportApiKey"] = null;
    newState["message"] = null;

    if (!isLoading) {
      setState({ ...newState });
    }

    return newState;
  };

  const handleRatioApiChange = (
    event = null,
    newState = null,
    isLoading = false
  ) => {
    const env = getEnv();

    if (newState === null) {
      newState = state;
    }

    // set the value of the API Key textbox; don't include API here if no API key
    // will need if statements if multiple gateways used in future
    if (ratioApiRef.current.value === "AlphaVantageRatioGateway") {
      newState["hasRatioApiKey"] = true;
      newState["currentRatioApiKey"] = env.ALPHAVANTAGE_API_KEY;
      newState["message"] = null;
    } else {
      newState["hasRatioApiKey"] = false;
      newState["currentRatioApiKey"] = null;
      newState["message"] = null;
    }

    if (!isLoading) {
      setState({ ...newState });
    }

    return newState;
  };

  function updateConfigAndState() {
    // const updateConfigAndState = () => {
    // console.log("reset...");

    const config = getConfigAPI(); // Get the current API from config

    stockApiRef.current.value = config.StockGateway;
    newsApiRef.current.value = config.NewsGateway;
    reportApiRef.current.value = config.ReportGateway;
    ratioApiRef.current.value = config.RatioGateway;

    let newState = state;
    newState = handleStockApiChange(null, newState, true);
    newState = handleNewsApiChange(null, newState, true);
    newState = handleReportApiChange(null, newState, true);
    newState = handleRatioApiChange(null, newState, true);

    setState({ ...newState });
  }

  const handleSubmit = (event) => {
    // Handle form submission logic here
    event.preventDefault();

    const stockApi = stockApiRef.current.value;
    const newsApi = newsApiRef.current.value;
    const reportApi = reportApiRef.current.value;
    const ratioApi = ratioApiRef.current.value;

    var stockApiKey = null;
    var newsApiKey = null;
    var reportApiKey = null;
    var ratioApiKey = null;

    // Check if selected API requires an API key
    if (state.hasStockApiKey) {
      stockApiKey = event.target.stockApiKey.value;
      if (
        stockApiKey === null ||
        stockApiKey === undefined ||
        stockApiKey === ""
      ) {
        setState({
          ...state,
          message: "You must enter a stock API key for the selected API",
        });
        return;
      }
    }

    if (state.hasNewsApiKey) {
      newsApiKey = event.target.newsApiKey.value;
      if (
        newsApiKey === null ||
        newsApiKey === undefined ||
        newsApiKey === ""
      ) {
        setState({
          ...state,
          message: "You must enter a news API key for the selected API",
        });
        return;
      }
    }

    if (state.hasReportApiKey) {
      reportApiKey = event.target.reportApiKey.value;
      if (
        reportApiKey === null ||
        reportApiKey === undefined ||
        reportApiKey === ""
      ) {
        setState({
          ...state,
          message: "You must enter a report API key for the selected API",
        });
        return;
      }
    }

    if (state.hasRatioApiKey) {
      ratioApiKey = event.target.ratioApiKey.value;
      if (
        ratioApiKey === null ||
        ratioApiKey === undefined ||
        ratioApiKey === ""
      ) {
        setState({
          ...state,
          message: "You must enter a ratio API key for the selected API",
        });
        return;
      }
    }

    const configData = {
      stockApi: stockApi,
      stockApiKey: state.hasStockApiKey ? stockApiKey : null,
      newsApi: newsApi,
      newsApiKey: state.hasNewsApiKey ? newsApiKey : null,
      reportApi: reportApi,
      reportApiKey: state.hasReportApiKey ? reportApiKey : null,
      ratioApi: ratioApi,
      ratioApiKey: state.hasRatioApiKey ? ratioApiKey : null,
    };

    const updater = new ConfigUpdater(configData);
    const updatedEnv = updater.updateEnvFile();

    // Update .env file with new API key
    if (updatedEnv) {
      setState({
        ...state,
        message: "Successfully saved the configuration",
      });

      // update the config file if the .env file successfully saved
      const updatedConfig = updater.updateConfigFile();
      if (updatedConfig) {
        setState({
          ...state,
          message: "Successfully saved the configuration",
        });
      } else {
        setState({
          ...state,
          message: "Failed to save the configuration file",
        });
      }
    } else {
      setState({
        ...state,
        message: "Failed to save the configuration file",
      });
    }
  };

  // const selectData_Topics = async () => {
  //   try {
  //     console.log("calling... sql select");

  //     // updateConfigAndState();

  //     setState({
  //       modTopic: state.modTopic,
  //       isLoading: state.isLoading,
  //       filterRefVal: filterRef.current.value,
  //       searching: true,
  //     });

  //     // TODO: move this query building to a Gateway implementation for SQLite
  //     // so that it can easily be configured with other databases later
  //     const inputData = [];
  //     var query =
  //       "SELECT tutor_topic.*,tutor_categ.code AS categ_code, tutor_categ.name AS category " +
  //       "FROM tutor_topic LEFT JOIN tutor_categ ON tutor_topic.categ_id = tutor_categ.id";

  //     console.log("filterRef val before call: " + filterRef.current.value);
  //     console.log("filterRef: " + filterRef.current.value);

  //     if (filterRef.current.value !== "") {
  //       query += " WHERE categ_code=?";
  //       inputData.push(filterRef.current.value);
  //     }

  //     query += " ORDER BY created DESC, heading ASC";
  //     query += " LIMIT ?";

  //     const limit = 25;
  //     inputData.push(limit);
  //     await window.electron.ipcRenderer
  //       .invoke("select-data", { query, inputData })
  //       .then((data) => {
  //         setState({
  //           modTopic: data,
  //           isLoading: false,
  //           searching: false,
  //         });
  //       });

  //     // console.log("sql: " + query);
  //   } catch (error) {
  //     console.error("Error fetching data:" + error);
  //   }
  // };

  console.log(state.modTopic);

  // // hadle topics -- CRUD ***
  // const handleSubmit_Topics = (event) => {
  //   // Handle form submission logic here
  //   event.preventDefault();
  // };

  return (
    // <div>Hello</div>

    <div className="page">
      <h2>Settings</h2>

      <div>
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              class="nav-link active"
              id="nav-gen-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-gen"
              type="button"
              role="tab"
              aria-controls="nav-gen"
              aria-selected="true"
            >
              General
            </button>
            <button
              class="nav-link"
              id="nav-stockapi-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-stockapi"
              type="button"
              role="tab"
              aria-controls="nav-stockapi"
              aria-selected="false"
            >
              Stock API Settings
            </button>
            <button
              class="nav-link"
              id="nav-tutorials-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-tutorials"
              type="button"
              role="tab"
              aria-controls="nav-tutorials"
              aria-selected="false"
            >
              Tutorials Content
            </button>
            {/* <button class="nav-link" id="nav-disabled-tab" data-bs-toggle="tab" data-bs-target="#nav-disabled" type="button" role="tab" aria-controls="nav-disabled" aria-selected="false" disabled>Disabled</button> */}
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <div
            class="tab-pane fade show active"
            id="nav-gen"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
            tabindex="0"
          >
            &nbsp;
            <h5>General settings information</h5>
            &nbsp; &nbsp;
          </div>
          <div
            class="tab-pane fade"
            id="nav-stockapi"
            role="tabpanel"
            aria-labelledby="nav-stockapi-tab"
            tabindex="0"
          >
            {" "}
            &nbsp;
            <h5>Stock Data API Configuration</h5>
            &nbsp; &nbsp;
            {/* <AppSettings_StockAPI /> */}
            <AppSettingsStocksAPI />
          </div>
          <div
            class="tab-pane fade"
            id="nav-tutorials"
            role="tabpanel"
            aria-labelledby="nav-tutorials-tab"
            tabindex="0"
          >
            &nbsp;
            <h6>
              Manage slides of tutorials by creating <b>topics</b> per
              respective <b>categories</b>, and adding <b>sections</b>. The
              sections give the layout of the topic. Sections can consist of
              codes, examples, tables, figures, images or descriptive text.{" "}
            </h6>
            &nbsp; &nbsp;
            <div class="d-flex align-items-start">
              <div
                className="nav flex-column nav-pills me-3"
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical"
                style={{ borderRight: "1px solid grey", paddingRight: "10px" }}
              >
                <button
                  className="nav-link active"
                  id="v-pills-topics-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-topics"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-topics"
                  aria-selected="true"
                  style={{ textAlign: "left" }}
                >
                  Topics
                </button>

                <button
                  className="nav-link"
                  id="v-pills-sections-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-sections"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-sections"
                  aria-selected="false"
                  style={{ textAlign: "left" }}
                >
                  Sections
                </button>

                <button
                  className="nav-link"
                  id="v-pills-categories-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-categories"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-categories"
                  aria-selected="false"
                  style={{ textAlign: "left" }}
                >
                  Categories
                </button>
              </div>

              {/* Topics -- modal...  */}

              {/* Topics -- modal */}

              <div class="tab-content" id="v-pills-tabContent">
                {/* Topics -- content */}

                <TopicList />

                {/* <TopicList
                  oTopic={state.modTopic}
                  isLoading={state.isLoading}
                  filterRefVal={state.filterRefVal}
                  filterRefObj={state.filterRef}
                /> */}

                {/* Topics -- content */}
                <div
                  class="tab-pane fade"
                  id="v-pills-sections"
                  role="tabpanel"
                  aria-labelledby="v-pills-sections-tab"
                  tabindex="0"
                >
                  {/* Sections ... */}
                  <SectionList />
                </div>
                <div
                  class="tab-pane fade"
                  id="v-pills-categories"
                  role="tabpanel"
                  aria-labelledby="v-pills-categories-tab"
                  tabindex="0"
                >
                  {/* Categories ... */}

                  <CategoryList />
                </div>
              </div>
            </div>
          </div>
          {/* <div class="tab-pane fade" id="nav-disabled" role="tabpanel" aria-labelledby="nav-disabled-tab" tabindex="0">...</div> */}
        </div>
      </div>
    </div>
  );
}

export { Settings };
