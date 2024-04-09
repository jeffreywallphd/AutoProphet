// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.
import React, { Component, useState, useRef } from "react";
import * as ReactDOM from "react-dom";
import { Routes, Route, NavLink, HashRouter } from "react-router-dom";

export function Analysis() {
  //Create references that will be used to take in user input
  const Revenue = useRef("Revenue");
  const CostOfRevenue = useRef("CostOfRevenue");
  const GandAExpense = useRef("GandAExpense");
  const SandMExpense = useRef("SandMExpense");
  const InterestExpense = useRef("InterestExpense");
  const StockholdersEquity = useRef("StockholdersEquity");
  const Assets = useRef("Assets");
  const PSSO = useRef("PSSO");
  const WANSOB = useRef("WANSOB");
  const SharePrice = useRef("SharePrice");
  const overallScore = useRef("Overall Score");
  const confInt = useRef("confInt");

  //Create a key value pair data structure which will hold our variables which will be changeale in the html on the button click
  //Initialize each key
  const [state, setState] = useState({
    ROA: null,
    ROE: null,
    NPM: null,
    EPS: null,
    PER: null,
    ROAGrade: null,
    ROEGrade: null,
    NPMGrade: null,
    EPSGrade: null,
    PERGrade: null,
    overallScore: null,
  });

  const calculateROA = (NetIncome) => {
    return (NetIncome / Assets.current.value).toFixed(2);
  };
  const calculateROE = (NetIncome) => {
    return (NetIncome / StockholdersEquity.current.value).toFixed(2);
  };
  const calculateNPM = (NetIncome) => {
    return (NetIncome / Revenue.current.value).toFixed(2);
  };
  const calculateEPS = (NetIncome) => {
    return ((NetIncome - PSSO.current.value) / WANSOB.current.value).toFixed(2);
  };
  const calculatePER = (NetIncome) => {
    return (
      SharePrice.current.value /
      ((NetIncome - PSSO.current.value) / WANSOB.current.value)
    ).toFixed(2);
  };
  const calculateOverallScore = (NetIncome) => {
    const roa = (NetIncome / Assets.current.value).toFixed(2);
    const roe = (NetIncome / StockholdersEquity.current.value).toFixed(2);
    const npm = (NetIncome / Revenue.current.value).toFixed(2);
    const eps = (
      (NetIncome - PSSO.current.value) /
      WANSOB.current.value
    ).toFixed(2);
    const per = (
      SharePrice.current.value /
      ((NetIncome - PSSO.current.value) / WANSOB.current.value)
    ).toFixed(2);
    return (
      roa * 0.25 +
      roe * 0.2 +
      npm * 0.15 +
      eps * 0.25 +
      per * 0.15
    ).toFixed(2);
  };

  const calculateROAGrade = (NetIncome) => {
    const roa = (NetIncome / Assets.current.value).toFixed(2);
    var letterGrade = null;
    if (roa > 0.12) {
      letterGrade = "A";
    } else if (roa > 0.08) {
      letterGrade = "B";
    } else if (roa > 0.04) {
      letterGrade = "C";
    } else if (roa > 0) {
      letterGrade = "D";
    } else {
      letterGrade = "F";
    }
    return letterGrade;
  };

  const calculateROEGrade = (NetIncome) => {
    const roe = (NetIncome / StockholdersEquity.current.value).toFixed(2);
    var letterGrade = null;
    if (roe > 0.2) {
      letterGrade = "A";
    } else if (roe > 0.15) {
      letterGrade = "B";
    } else if (roe > 0.1) {
      letterGrade = "C";
    } else if (roe > 0.5) {
      letterGrade = "D";
    } else {
      letterGrade = "F";
    }
    return letterGrade;
  };
  const calculateNPMGrade = (NetIncome) => {
    const npm = (NetIncome / Revenue.current.value).toFixed(2);
    var letterGrade = null;
    if (npm > 0.12) {
      letterGrade = "A";
    } else if (npm > 0.08) {
      letterGrade = "B";
    } else if (npm > 0.04) {
      letterGrade = "C";
    } else if (npm > 0) {
      letterGrade = "D";
    } else {
      letterGrade = "F";
    }
    return letterGrade;
  };
  const calculateEPSGrade = (NetIncome) => {
    const eps = (
      (NetIncome - PSSO.current.value) /
      WANSOB.current.value
    ).toFixed(2);
    var letterGrade = null;
    if (eps > 0.12) {
      letterGrade = "A";
    } else if (eps > 0.08) {
      letterGrade = "B";
    } else if (eps > 0.04) {
      letterGrade = "C";
    } else if (eps > 0) {
      letterGrade = "D";
    } else {
      letterGrade = "F";
    }
    return letterGrade;
  };
  const calculatePERGrade = (NetIncome) => {
    const per = (
      SharePrice.current.value /
      ((NetIncome - PSSO.current.value) / WANSOB.current.value)
    ).toFixed(2);
    var letterGrade = null;
    if (per > 0.12) {
      letterGrade = "A";
    } else if (per > 0.08) {
      letterGrade = "B";
    } else if (per > 0.04) {
      letterGrade = "C";
    } else if (per > 0) {
      letterGrade = "D";
    } else {
      letterGrade = "F";
    }
    return letterGrade;
  };

  const calculateOverallScoreGrade = (NetIncome) => {
    const roa = (NetIncome / Assets.current.value).toFixed(2);
    const roe = (NetIncome / StockholdersEquity.current.value).toFixed(2);
    const npm = (NetIncome / Revenue.current.value).toFixed(2);
    const eps = (
      (NetIncome - PSSO.current.value) /
      WANSOB.current.value
    ).toFixed(2);
    const per = (
      SharePrice.current.value /
      ((NetIncome - PSSO.current.value) / WANSOB.current.value)
    ).toFixed(2);
    const overallScore =
      roa * 0.25 + roe * 0.2 + npm * 0.15 + eps * 0.25 + per * 0.15;
    var letterGrade = null;
    if (per > 0.12) {
      letterGrade = "A";
    } else if (per > 0.08) {
      letterGrade = "B";
    } else if (per > 0.04) {
      letterGrade = "C";
    } else if (per > 0) {
      letterGrade = "D";
    } else {
      letterGrade = "F";
    }
    return letterGrade;
  };

  const handleClick = () => {
    const NetIncome =
      Revenue.current.value -
      CostOfRevenue.current.value +
      GandAExpense.current.value +
      SandMExpense.current.value +
      InterestExpense.current.value;
    setState({
      ROA: calculateROA(NetIncome),
      ROE: calculateROE(NetIncome),
      NPM: calculateNPM(NetIncome),
      EPS: calculateEPS(NetIncome),
      PER: calculatePER(NetIncome),
      ROAGrade: calculateROAGrade(NetIncome),
      ROEGrade: calculateROEGrade(NetIncome),
      NPMGrade: calculateNPMGrade(NetIncome),
      EPSGrade: calculateEPSGrade(NetIncome),
      PERGrade: calculatePERGrade(NetIncome),
      overallScore: calculateOverallScore(NetIncome),
      overallScoreGrade: calculateOverallScoreGrade(NetIncome),
    });
  };

  //What is actually displayed
  return (
    <div className="page">
      <h2>Risk Analysis</h2>
      <div className="riskBody">
        <div className="riskContainer">
          <h3 className="riskHeader">Your Info</h3>
          <div className="ROAbox">
            <input
              type="text"
              ref={Revenue}
              className="userInput"
              placeholder="Revenue"
            ></input>
            <input
              type="text"
              ref={CostOfRevenue}
              className="userInput"
              placeholder="Cost of Revenue"
            ></input>
          </div>

          <div className="ROIbox">
            <input
              type="text"
              ref={GandAExpense}
              className="userInput"
              placeholder="G and A Expense*"
            ></input>
            <input
              type="text"
              ref={SandMExpense}
              className="userInput"
              placeholder="S and M Expense**"
            ></input>
          </div>

          <div className="ROEbox">
            <input
              type="text"
              ref={InterestExpense}
              className="userInput"
              placeholder="Interest Expense"
            ></input>
          </div>
          <div className="NPMbox">
            <input
              type="text"
              ref={StockholdersEquity}
              className="userInput"
              placeholder="Stockholders Equity"
            ></input>
            <input
              type="text"
              ref={Assets}
              className="userInput"
              placeholder="Assets"
            ></input>
          </div>
          <div className="EPSbox">
            <input
              type="text"
              ref={PSSO}
              className="userInput"
              placeholder="PSSO***"
            ></input>
            <input
              type="text"
              ref={WANSOB}
              className="userInput"
              placeholder="WANSOB****"
            ></input>
          </div>

          <div className="PERbox">
            <input
              type="text"
              ref={SharePrice}
              className="userInput"
              placeholder="Share Price"
            ></input>
          </div>
          <p className="explanationText">*General and Administrative Expense</p>
          <p className="explanationText">**Selling and Marketing Expense</p>
          <p className="explanationText">
            ***Preferred Stock Shares Outstanding
          </p>
          <p className="explanationText">
            ****Weighted Average Number of Shares Outstanding
          </p>
          <button id="calcRiskScores" onClick={handleClick}>
            Calculate Risk Scores
          </button>
          <div>
            <h3 className="riskHeader">Your Timeline</h3>
            <h4 className="statHeader">Investment Horizon</h4>
            <h4 className="statHeader">Confidence Interval</h4>
            <input
              type="text"
              ref={confInt}
              className="userInput"
              placeholder="Confidence Interval"
            ></input>
          </div>
        </div>
        <div className="riskContainer">
          <h3 className="riskHeader">Risk Ratios</h3>
          <div className="scoreContainer">
            <div className="ratioName">ROA: </div>
            <div className="ratioBox">{state.ROA}</div>
            <div className="ratioBox">{state.ROAGrade}</div>
          </div>
          <div className="scoreContainer">
            <div className="ratioName">ROE: </div>
            <div className="ratioBox">{state.ROE}</div>
            <div className="ratioBox">{state.ROEGrade}</div>
          </div>
          <div className="scoreContainer">
            <div className="ratioName">NPM: </div>
            <div className="ratioBox">{state.NPM}</div>
            <div className="ratioBox">{state.NPMGrade}</div>
          </div>
          <div className="scoreContainer">
            <div className="ratioName">EPS: </div>
            <div className="ratioBox">{state.EPS}</div>
            <div className="ratioBox">{state.EPSGrade}</div>
          </div>
          <div className="scoreContainer">
            <div className="ratioName">PER: </div>
            <div className="ratioBox">{state.PER}</div>
            <div className="ratioBox">{state.PERGrade}</div>
          </div>
            <div className="scoreContainerOverallScore">
              <div className="ratioName">Overall: </div>
              <div className="ratioBox">{state.overallScore}</div>
              <div className="ratioBox">{state.overallScoreGrade}</div>
      
          </div>
          <div>
            <h3 className="riskHeader">Other Stats</h3>
            <h4 className="statHeader">Diversification</h4>
          </div>
        </div>
      </div>
      
    </div>
  );
}
//export { Analysis };
