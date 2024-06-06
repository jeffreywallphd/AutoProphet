import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import ConfigUpdater from "../Utility/ConfigManager";

function Settings(props) {
  const stockApiRef = useRef("AlphaVantageStockGateway");
  const newsApiRef = useRef("AlphaVantageNewsGateway");
  const reportApiRef = useRef("SecAPIGateway");
  const ratioApiRef = useRef("AlphaVantageRatioGateway");

  var stockApiKeyRef = useRef();
  var newsApiKeyRef = useRef();
  var reportApiKeyRef = useRef();
  var ratioApiKeyRef = useRef();

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
  });

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

  useEffect(() => {
    const config = getConfigAPI(); // Get the current API from config

    stockApiRef.current.value = config.StockGateway;
    newsApiRef.current.value = config.NewsGateway;
    reportApiRef.current.value = config.ReportGateway;
    ratioApiRef.current.value = config.RatioGateway;

    var newState = state;
    newState = handleStockApiChange(null, newState, true);
    newState = handleNewsApiChange(null, newState, true);
    newState = handleReportApiChange(null, newState, true);
    newState = handleRatioApiChange(null, newState, true);

    setState({ ...newState });
  }, []);

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
            <form className="row g-3 was-validated" onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label htmlFor="stockApi" className="form-label">
                    {" "}
                    {/* Select a  */}
                    Stock Data API:{" "}
                  </label>
                  <select
                    className="form-select"
                    id="stockApi"
                    name="stockApi"
                    ref={stockApiRef}
                    onChange={handleStockApiChange}
                    aria-describedby="stockApiFeedback"
                    required
                  >
                    <option selected disabled value="">
                      Choose API
                    </option>
                    <option value="AlphaVantageStockGateway">
                      {" "}
                      Alpha Vantage Stock API{" "}
                    </option>
                    <option value="FinancialModelingPrepGateway">
                      {" "}
                      Financial Modeling Prep Stock API{" "}
                    </option>
                    <option value="YFinanceStockGateway">
                      {" "}
                      Yahoo Finance (unofficial community) API{" "}
                    </option>
                  </select>
                  <div id="stockApiFeedback" className="invalid-feedback">
                    Please select the Stock API
                  </div>
                </div>

                {/* 
              <div>
                <label htmlFor="stockApi">Select a Stock Data API:</label>
              </div>
              <select
                id="stockApi"
                name="stockApi"
                ref={stockApiRef}
                onChange={handleStockApiChange}
              >
                <option value="AlphaVantageStockGateway">
                  Alpha Vantage Stock API
                </option>
                <option value="FinancialModelingPrepGateway">
                  Financial Modeling Prep Stock API
                </option>
                <option value="YFinanceStockGateway">
                  Yahoo Finance (unofficial community) API
                </option>
              </select>
              <br /> */}

                {/* only show API key textbox if the API requires one */}
                {state.hasStockApiKey ? (
                  <>
                    <div className="col-md-5">
                      <label htmlFor="stockApiKey" className="form-label">
                        &nbsp; {/* Stock API Key: */}
                      </label>
                      <div className="input-group">
                        <span
                          className="input-group-text"
                          id="inputGroupPrepend3"
                        >
                          API Key
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="stockApiKey"
                          name="stockApiKey"
                          size={state.apiSize}
                          ref={stockApiKeyRef}
                          value={state.currentStockApiKey}
                          onChange={(e) => {
                            setState({
                              ...state,
                              currentStockApiKey: e.target.value,
                              message: null,
                            });
                          }}
                          aria-describedby="inputGroupPrepend3 stockApiKeyFeedback"
                          required
                        />
                        {/* <div
                        id="stockApiKeyFeedback"
                        className="invalid-feedback"
                      >
                        Please specify API key.
                      </div> */}
                        <div id="stockApiKeyFeedback" class="invalid-feedback">
                          Please specify API key.
                        </div>
                      </div>
                    </div>

                    {/* <div>
                    <label htmlFor="stockApiKey">Stock API Key:</label>
                  </div>
                  <div>
                    <input
                      type="text"
                      id="stockApiKey"
                      name="stockApiKey"
                      size={state.apiSize}
                      ref={stockApiKeyRef}
                      value={state.currentStockApiKey}
                      onChange={(e) => {
                        setState({
                          ...state,
                          currentStockApiKey: e.target.value,
                          message: null,
                        });
                      }}
                    />
                  </div> */}
                  </>
                ) : null}
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label htmlFor="newsApi" className="form-label">
                    {" "}
                    {/* Select a  */}
                    News Data API
                  </label>
                  <select
                    className="form-select"
                    id="newsApi"
                    name="newsApi"
                    ref={newsApiRef}
                    onChange={handleNewsApiChange}
                    aria-describedby="newsApiFeedback"
                    required
                  >
                    <option selected disabled value="">
                      Choose API
                    </option>
                    <option value="AlphaVantageNewsGateway">
                      Alpha Vantage News API
                    </option>
                  </select>
                  <div id="newsApiFeedback" className="invalid-feedback">
                    Please select the News API
                  </div>
                </div>

                {/* <div>
                <label htmlFor="newsApi">Select a News Data API:</label>
              </div>
              <select
                id="newsApi"
                name="newsApi"
                ref={newsApiRef}
                onChange={handleNewsApiChange}
              >
                <option value="AlphaVantageNewsGateway">
                  Alpha Vantage News API
                </option>
              </select> */}

                {/* <br /> */}
                {/* only show API key textbox if the API requires one */}
                {state.hasNewsApiKey ? (
                  <>
                    <div className="col-md-5">
                      <label htmlFor="newsApiKey" className="form-label">
                        &nbsp; {/* News API Key: */}
                      </label>
                      <div className="input-group">
                        <span
                          className="input-group-text"
                          id="inputGroupPrepend3"
                        >
                          API Key
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="newsApiKey"
                          name="newsApiKey"
                          size={state.apiSize}
                          ref={newsApiKeyRef}
                          value={state.currentNewsApiKey}
                          onChange={(e) => {
                            setState({
                              ...state,
                              currentNewsApiKey: e.target.value,
                              message: null,
                            });
                          }}
                          aria-describedby="inputGroupPrepend3 newsApiKeyFeedback"
                          required
                        />
                        <div id="newsApiKeyFeedback" class="invalid-feedback">
                          Please specify News API key.
                        </div>
                      </div>
                    </div>
                    {/* 
                  <div>
                    <label htmlFor="newsApiKey">News API Key:</label>
                  </div>
                  <div>
                    <input
                      type="text"
                      id="newsApiKey"
                      name="newsApiKey"
                      size={state.apiSize}
                      ref={newsApiKeyRef}
                      value={state.currentNewsApiKey}
                      onChange={(e) => {
                        setState({
                          ...state,
                          currentNewsApiKey: e.target.value,
                          message: null,
                        });
                      }}
                    />
                  </div> */}
                  </>
                ) : null}
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label htmlFor="reportApi" className="form-label">
                    {" "}
                    {/* Select a  */}
                    Financial Report API
                  </label>
                  <select
                    className="form-select"
                    id="reportApi"
                    name="reportApi"
                    ref={reportApiRef}
                    onChange={handleReportApiChange}
                    aria-describedby="reportApiFeedback"
                    required
                  >
                    <option selected disabled value="">
                      Choose API
                    </option>
                    <option value="SecAPIGateway">SEC Reporting API</option>
                  </select>
                  <div id="reportApiFeedback" className="invalid-feedback">
                    Please select the News API
                  </div>
                </div>

                {/* <div>
                <label htmlFor="reportApi">
                  Select a Financial Report API:
                </label>
              </div>
              <select
                id="reportApi"
                name="reportApi"
                ref={reportApiRef}
                onChange={handleReportApiChange}
              >
                <option value="SecAPIGateway">SEC Reporting API</option>
              </select> */}

                {/* <br /> */}

                {/* only show API key textbox if the API requires one */}
                {state.hasReportApiKey ? (
                  <>
                    <div className="col-md-5">
                      <label htmlFor="reportApiKey" className="form-label">
                        &nbsp; {/* Financial Report API Key: */}
                      </label>
                      <div className="input-group">
                        <span
                          className="input-group-text"
                          id="inputGroupPrepend3"
                        >
                          API Key
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="reportApiKey"
                          name="reportApiKey"
                          size={state.apiSize}
                          ref={reportApiKeyRef}
                          value={state.currentReportApiKey}
                          onChange={(e) => {
                            setState({
                              ...state,
                              currentReportApiKey: e.target.value,
                              message: null,
                            });
                          }}
                          aria-describedby="inputGroupPrepend3 reportApiKeyFeedback"
                          required
                        />
                        <div id="reportApiKeyFeedback" class="invalid-feedback">
                          Please specify Financial Report API key.
                        </div>
                      </div>
                    </div>
                    {/* 
                  <div>
                    <label htmlFor="reportApiKey">
                      Financial Report API Key:
                    </label>
                  </div>
                  <div>
                    <input
                      type="text"
                      id="reportApiKey"
                      name="reportApiKey"
                      size={state.apiSize}
                      ref={reportApiKeyRef}
                      value={state.currentReportApiKey}
                      onChange={(e) => {
                        setState({
                          ...state,
                          currentReportApiKey: e.target.value,
                          message: null,
                        });
                      }}
                    />
                  </div> */}
                  </>
                ) : null}
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label htmlFor="ratioApi" className="form-label">
                    {" "}
                    {/* Select a  */}
                    Financial Ratios API
                  </label>
                  <select
                    className="form-select"
                    id="ratioApi"
                    name="ratioApi"
                    ref={ratioApiRef}
                    onChange={handleRatioApiChange}
                    aria-describedby="ratioApiFeedback"
                    required
                  >
                    <option selected disabled value="">
                      Choose API
                    </option>
                    <option value="AlphaVantageRatioGateway">
                      Alpha Vantage Ratio API
                    </option>
                  </select>
                  <div id="ratioApiFeedback" className="invalid-feedback">
                    Please select the Ratio API
                  </div>
                </div>

                {/* <div>
                <label htmlFor="ratioApi">Select a Financial Ratios API:</label>
              </div>
              <select
                id="ratioApi"
                name="ratioApi"
                ref={ratioApiRef}
                onChange={handleRatioApiChange}
              >
                <option value="AlphaVantageRatioGateway">
                  Alpha Vantage Ratio API
                </option>
              </select> */}

                {/* <br /> */}

                {/* only show API key textbox if the API requires one */}
                {state.hasRatioApiKey ? (
                  <>
                    <div className="col-md-5">
                      <label htmlFor="ratioApiKey" className="form-label">
                        &nbsp; {/* Financial Ratio API Key: */}
                      </label>
                      <div className="input-group">
                        <span
                          className="input-group-text"
                          id="inputGroupPrepend3"
                        >
                          API Key
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="ratioApiKey"
                          name="ratioApiKey"
                          size={state.apiSize}
                          ref={ratioApiKeyRef}
                          value={state.currentRatioApiKey}
                          onChange={(e) => {
                            setState({
                              ...state,
                              currentRatioApiKey: e.target.value,
                              message: null,
                            });
                          }}
                          aria-describedby="inputGroupPrepend3 ratioApiKeyFeedback"
                          required
                        />
                        <div id="ratioApiKeyFeedback" class="invalid-feedback">
                          Please specify Financial Ratio API key.
                        </div>
                      </div>
                    </div>
                    {/* 
                  <div>
                    <label htmlFor="ratioApiKey">
                      Financial Ratio API Key:
                    </label>
                  </div>
                  <div>
                    <input
                      type="text"
                      id="ratioApiKey"
                      name="ratioApiKey"
                      size={state.apiSize}
                      ref={ratioApiKeyRef}
                      value={state.currentRatioApiKey}
                      onChange={(e) => {
                        setState({
                          ...state,
                          currentRatioApiKey: e.target.value,
                          message: null,
                        });
                      }}
                    />
                  </div> */}
                  </>
                ) : null}
              </div>

              {/* <button type="submit">Save Configuration</button> */}
              <div className="row mt-5">
                <div className="col-sm-9 d-flex justify-content-end">
                  <button type="submit" className="btn btn-secondary">
                    Save Configuration
                  </button>
                </div>
              </div>

              <p>{state.message}</p>
            </form>
          </div>
          <div
            class="tab-pane fade"
            id="nav-tutorials"
            role="tabpanel"
            aria-labelledby="nav-tutorials-tab"
            tabindex="0"
          >
            &nbsp;
            <h5>Tutorials details</h5>
            &nbsp; &nbsp;
          </div>
          {/* <div class="tab-pane fade" id="nav-disabled" role="tabpanel" aria-labelledby="nav-disabled-tab" tabindex="0">...</div> */}
        </div>
      </div>
    </div>
  );
}

export { Settings };
