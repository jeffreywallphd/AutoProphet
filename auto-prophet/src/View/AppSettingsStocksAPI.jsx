import React, { useRef, useEffect, useState } from "react";
import ConfigUpdater from "../Utility/ConfigManager";

function AppSettingsStocksAPI() {
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

  const filterRef = useRef(null);
  const stockApiRef = useRef(null);
  const newsApiRef = useRef(null);
  const reportApiRef = useRef(null);
  const ratioApiRef = useRef(null);
  const stockApiKeyRef = useRef(null);
  const newsApiKeyRef = useRef(null);
  const reportApiKeyRef = useRef(null);
  const ratioApiKeyRef = useRef(null);

  useEffect(() => {
    const config = getConfigAPI();
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
  }, []);

  const getConfigAPI = () => {
    const updater = new ConfigUpdater();
    return updater.getConfig();
  };

  const getEnv = () => {
    const updater = new ConfigUpdater();
    return updater.getEnv();
  };

  const handleStockApiChange = (
    event = null,
    newState = null,
    isLoading = false
  ) => {
    const env = getEnv();

    if (newState === null) {
      newState = state;
    }

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

  const handleSubmit = (event) => {
    event.preventDefault();

    const stockApi = stockApiRef.current.value;
    const newsApi = newsApiRef.current.value;
    const reportApi = reportApiRef.current.value;
    const ratioApi = ratioApiRef.current.value;

    let stockApiKey = null;
    let newsApiKey = null;
    let reportApiKey = null;
    let ratioApiKey = null;

    if (state.hasStockApiKey) {
      stockApiKey = event.target.stockApiKey.value;
      if (!stockApiKey) {
        setState({
          ...state,
          message: "You must enter a stock API key for the selected API",
        });
        return;
      }
    }

    if (state.hasNewsApiKey) {
      newsApiKey = event.target.newsApiKey.value;
      if (!newsApiKey) {
        setState({
          ...state,
          message: "You must enter a news API key for the selected API",
        });
        return;
      }
    }

    if (state.hasReportApiKey) {
      reportApiKey = event.target.reportApiKey.value;
      if (!reportApiKey) {
        setState({
          ...state,
          message: "You must enter a report API key for the selected API",
        });
        return;
      }
    }

    if (state.hasRatioApiKey) {
      ratioApiKey = event.target.ratioApiKey.value;
      if (!ratioApiKey) {
        setState({
          ...state,
          message: "You must enter a ratio API key for the selected API",
        });
        return;
      }
    }

    const configData = {
      stockApi,
      stockApiKey: state.hasStockApiKey ? stockApiKey : null,
      newsApi,
      newsApiKey: state.hasNewsApiKey ? newsApiKey : null,
      reportApi,
      reportApiKey: state.hasReportApiKey ? reportApiKey : null,
      ratioApi,
      ratioApiKey: state.hasRatioApiKey ? ratioApiKey : null,
    };

    const updater = new ConfigUpdater(configData);
    const updatedEnv = updater.updateEnvFile();

    if (updatedEnv) {
      setState({
        ...state,
        message: "Successfully saved the configuration",
      });

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

        {/* only show API key textbox if the API requires one */}
        {state.hasStockApiKey ? (
          <>
            <div className="col-md">
              <label htmlFor="stockApiKey" className="form-label">
                &nbsp; {/* Stock API Key: */}
              </label>
              <div className="input-group">
                <span className="input-group-text" id="inputGroupPrepend3">
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
          </>
        ) : null}
      </div>
      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="newsApi" className="form-label">
            {" "}
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

        {state.hasNewsApiKey ? (
          <>
            <div className="col-md">
              <label htmlFor="newsApiKey" className="form-label">
                &nbsp; {/* News API Key: */}
              </label>
              <div className="input-group">
                <span className="input-group-text" id="inputGroupPrepend3">
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

        {state.hasReportApiKey ? (
          <>
            <div className="col-md">
              <label htmlFor="reportApiKey" className="form-label">
                &nbsp; {/* Financial Report API Key: */}
              </label>
              <div className="input-group">
                <span className="input-group-text" id="inputGroupPrepend3">
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

        {state.hasRatioApiKey ? (
          <>
            <div className="col-md">
              <label htmlFor="ratioApiKey" className="form-label">
                &nbsp; {/* Financial Ratio API Key: */}
              </label>
              <div className="input-group">
                <span className="input-group-text" id="inputGroupPrepend3">
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
          </>
        ) : null}
      </div>

      {/* <button type="submit">Save Configuration</button> */}
      <div className="row mt-5">
        {/* <div className="col-sm-4 d-flex justify-content-end">
      <button type="button" className="btn btn-outline-secondary">
          Cancel 
        </button>
      </div> */}

        <div className="col-sm-9 d-flex justify-content-end">
          <button type="button" className="btn btn-outline-primary">
            Cancel
          </button>
          &nbsp;
          <button type="submit" className="btn btn-primary">
            Save Configuration
          </button>
        </div>
      </div>

      <p>{state.message}</p>
    </form>
  );
}

export { AppSettingsStocksAPI };
