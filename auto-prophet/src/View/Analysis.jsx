// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { Component, useState, useRef} from "react";

function Analysis(props) {
    //Create references that will be used to take in user input
    const Revenue = useRef("Revenue");
    const CostOfRevenue = useRef("CostOfRevenue");
    const GandAExpense = useRef("GandAExpense");
    const SandMExpense = useRef("SandMExpense");
    const InterestExpense = useRef("InterestExpense");
    const StockholdersEquity = useRef("StockholdersEquity")
    const Assets = useRef("Assets");
    const PSSO = useRef("PSSO");
    const WANSOB = useRef("WANSOB")
    const SharePrice = useRef("SharePrice");

    const confInt = useRef("confInt");

    const largeCS = useRef("largeCS");
    const midCS = useRef("midCS");
    const smallCS = useRef("smallCS");
    const microCS = useRef("microCS");

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
        overallScore: null
    })

    const [infoState, setInfoState] = useState({
        info: null
    })

    const [diversificationScore, setDiversificationScore] = useState({
        score: null,
        grade: null,
    })

    const handleDiversification = () => {
        const largeCap = Number(largeCS.current.value)*100;
        const midCap = Number(midCS.current.value)*100 + Number(largeCap);
        const smallCap = Number(smallCS.current.value)*100 + Number(midCap);
        setPieChart({
            margin: '20px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundImage: `conic-gradient(orange ${largeCap}%, blue ${largeCap}%, blue ${midCap}%, green ${midCap}%, green ${smallCap}%, purple ${smallCap}%)`,
            border: '2px solid black',
        })
        setDiversificationScore({
            score: Number(largeCS.current.value)*4+Number(midCS.current.value)*2+Number(smallCS.current.value),
            grade: calculateDiversityGrade(Number(largeCS.current.value), Number(midCS.current.value), Number(smallCS.current.value)),
        })
    }

    const calculateDiversityGrade = (large, mid, small) => {
        const score = large*4+mid*2+small;
        if(score > 2.5){
            return "A";
        }
        else if(score > 2){
            return "B";
        }
        else if(score > 1.5){
            return "C";
        }
        else if(score > 1){
            return "D";
        }
        else{
            return "F";
        }
    }
    const [pieChart, setPieChart] = useState ({
        margin: '20px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundImage: `conic-gradient(orange 0%, blue 0%, blue 0%, green 0%, green 0%, white 0%)`,
        border: '2px solid black',
    })

    const calculateROA = (NetIncome) => {
        return (NetIncome / Assets.current.value).toFixed(2);
    }
    const calculateROE = (NetIncome) => {
        return (NetIncome / StockholdersEquity.current.value).toFixed(2);
    }
    const calculateNPM = (NetIncome) => {
        return (NetIncome / Revenue.current.value).toFixed(2);
    }
    const calculateEPS = (NetIncome) => {
        return ((NetIncome - PSSO.current.value) / WANSOB.current.value).toFixed(2);
    }
    const calculatePER = (NetIncome) => {
        return (SharePrice.current.value / ((NetIncome - PSSO.current.value) / WANSOB.current.value)).toFixed(2);
    }
    const calculateOverallScore = (NetIncome) => {
        const roa = (NetIncome / Assets.current.value).toFixed(2);
        const roe = (NetIncome / StockholdersEquity.current.value).toFixed(2);
        const npm = (NetIncome / Revenue.current.value).toFixed(2);
        const eps = ((NetIncome - PSSO.current.value) / WANSOB.current.value).toFixed(2);
        const per = (SharePrice.current.value / ((NetIncome - PSSO.current.value) / WANSOB.current.value)).toFixed(2);
        return (roa*0.25 + roe*0.2 + npm*0.15 + eps*0.25 + per*0.15).toFixed(2);
    }
    
    const calculateROAGrade = (NetIncome) => {
        const roa = (NetIncome / Assets.current.value).toFixed(2);
        var letterGrade = null;
        if(roa > 0.12){
            letterGrade = "A";
        }
        else if(roa > 0.08){
            letterGrade = "B";
        }
        else if(roa > 0.04){
            letterGrade = "C";
        }
        else if(roa > 0){
            letterGrade = "D";
        }
        else{
            letterGrade = "F";
        }
        return letterGrade;
    }

    const calculateROEGrade = (NetIncome) => {
        const roe = (NetIncome / StockholdersEquity.current.value).toFixed(2);
        var letterGrade = null;
        if(roe > 0.20){
            letterGrade = "A";
        }
        else if(roe > 0.15){
            letterGrade = "B";
        }
        else if(roe > 0.10){
            letterGrade = "C";
        }
        else if(roe > 0.5){
            letterGrade = "D";
        }
        else{
            letterGrade = "F";
        }
        return letterGrade;
        
    }
    const calculateNPMGrade = (NetIncome) => {
        const npm = (NetIncome / Revenue.current.value).toFixed(2);
        var letterGrade = null;
        if(npm > 0.12){
            letterGrade = "A";
        }
        else if(npm > 0.08){
            letterGrade = "B";
        }
        else if(npm > 0.04){
            letterGrade = "C";
        }
        else if(npm > 0){
            letterGrade = "D";
        }
        else{
            letterGrade = "F";
        }
        return letterGrade;
    }
    const calculateEPSGrade = (NetIncome) => {
        const eps = ((NetIncome - PSSO.current.value) / WANSOB.current.value).toFixed(2);
        var letterGrade = null;
        if(eps > 0.12){
            letterGrade = "A";
        }
        else if(eps > 0.08){
            letterGrade = "B";
        }
        else if(eps > 0.04){
            letterGrade = "C";
        }
        else if(eps > 0){
            letterGrade = "D";
        }
        else{
            letterGrade = "F";
        }
        return letterGrade;
    }
    const calculatePERGrade = (NetIncome) => {
        const per = (SharePrice.current.value / ((NetIncome - PSSO.current.value) / WANSOB.current.value)).toFixed(2);
        var letterGrade = null;
        if(per > 0.12){
            letterGrade = "A";
        }
        else if(per > 0.08){
            letterGrade = "B";
        }
        else if(per > 0.04){
            letterGrade = "C";
        }
        else if(per > 0){
            letterGrade = "D";
        }
        else{
            letterGrade = "F";
        }
        return letterGrade;
    }

    const calculateOverallScoreGrade = (NetIncome) => {
        const roa = (NetIncome / Assets.current.value).toFixed(2);
        const roe = (NetIncome / StockholdersEquity.current.value).toFixed(2);
        const npm = (NetIncome / Revenue.current.value).toFixed(2);
        const eps = ((NetIncome - PSSO.current.value) / WANSOB.current.value).toFixed(2);
        const per = (SharePrice.current.value / ((NetIncome - PSSO.current.value) / WANSOB.current.value)).toFixed(2);
        const overallScore = roa*0.25 + roe*0.2 + npm*0.15 + eps*0.25 + per*0.15;
        var letterGrade = null;
        if(overallScore > 0.12){
            letterGrade = "A";
        }
        else if(overallScore > 0.08){
            letterGrade = "B";
        }
        else if(overallScore > 0.04){
            letterGrade = "C";
        }
        else if(overallScore > 0){
            letterGrade = "D";
        }
        else{
            letterGrade = "F";
        }
        return letterGrade;
    }

    const handleClick = () => {
        const NetIncome = Revenue.current.value - CostOfRevenue.current.value + GandAExpense.current.value + SandMExpense.current.value + InterestExpense.current.value
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
            overallScoreGrade: calculateOverallScoreGrade(NetIncome)
        });
    }  
    const showInfo = (metric) => {
        var infoString = "showInfo terminated early";
        if(metric == "ROA"){
            infoString = "A higher ROA (Return on Assets) indicates better efficiency in utilizing assets to generate profits, while a lower ROA may suggest inefficiency or underperformance."
        }
        else if(metric == "ROE"){
            infoString = "A higher ROE (Return on Equity) means the company is better at making profits from its investments. Conversely, a lower ROE might mean the company isn't using its investments effectively relative to shareholder expectations."
        }
        else if(metric == "NPM"){
            infoString = "A higher NPM (Net Profit Margin) suggests that a company is keeping more of its revenue as profit after accounting for expenses. Conversely, a lower NPM may indicate that the company is struggling to control its costs or facing challenges in generating profits from its operations."
        }
        else if(metric == "EPS"){
            infoString = "A higher EPS (Earnings Per Share) indicates that a company is generating more profits for each share of its stock. On the other hand, a lower EPS might suggest that the company's profitability is decreasing or that its earnings are being diluted by issuing more shares."
        }
        else if(metric == "PER"){
            infoString = "A lower P/E (Price-to-Earnings) ratio suggests that investors are paying less for each unit of the company's earnings, which may indicate the stock is undervalued. Conversely, a higher P/E ratio might mean that investors are paying more for each unit of earnings, which could suggest the stock is overvalued or that investors expect higher growth in the future."
        }
        else{
            infoString = "Unknown"
        }
        return infoString;
    }
    const infoButtonROA = () => {
        setInfoState({
            info: showInfo("ROA")
        });
    }
    const infoButtonROE = () => {
        setInfoState({
            info: showInfo("ROE")
        });
    }
    const infoButtonNPM = () => {
        setInfoState({
            info: showInfo("NPM")
        });
    }
    const infoButtonEPS = () => {
        setInfoState({
            info: showInfo("EPS")
        });
    }
    const infoButtonPER = () => {
        setInfoState({
            info: showInfo("PER")
        });
    }
    const minimizeInfo = () => {
        setInfoState({
            info: null
        });
    }

    
    
    

    
    return (
            <div className="page">
                <h2>Risk Analysis</h2>
                <div className='riskBody'>
                    <div className='riskContainer'>
                        <h3 className="riskHeader">Your Info</h3>
                        <div className='ROAbox'>
                            <input type='text' ref={Revenue} className='userInput' placeholder='Revenue'></input>
                            <input type='text' ref={CostOfRevenue} className='userInput' placeholder='Cost of Revenue'></input>
                        </div>
                        <div className='ROIbox'>
                            <input type='text' ref={GandAExpense} className='userInput' placeholder='G and A Expense*'></input>
                            <input type='text' ref={SandMExpense} className='userInput' placeholder='S and M Expense**'></input>
                        </div>
                        <div className='ROEbox'>
                            <input type='text' ref={InterestExpense} className='userInput' placeholder='Interest Expense'></input>
                        </div>
                        <div className='NPMbox'>
                            <input type='text' ref={StockholdersEquity} className='userInput' placeholder='Stockholders Equity'></input>
                            <input type='text' ref={Assets} className='userInput' placeholder='Assets'></input>
                        </div>
                        <div className='EPSbox'>
                            <input type='text' ref={PSSO} className='userInput' placeholder='PSSO***'></input>
                            <input type='text' ref={WANSOB} className='userInput' placeholder='WANSOB****'></input>
                        </div>
                        <div className='PERbox'>
                            <input type='text' ref={SharePrice} className='userInput' placeholder='Share Price'></input>
                        </div>
                        <p className='explanationText'>*General and Administrative Expense</p>
                        <p className='explanationText'>**Selling and Marketing Expense</p>
                        <p className='explanationText'>***Preferred Stock Shares Outstanding</p>
                        <p className='explanationText'>****Weighted Average Number of Shares Outstanding</p>
                        <button className='bigbutton' onClick={handleClick}>Calculate Risk Scores</button>
                    </div>
                    <div className='riskContainer'>
                        <h3 className="riskHeader">Risk Ratios</h3>
                        <div className='scoreContainer'>
                            <div className='ratioName'>
                                <button className='infobutton' onClick={infoButtonROA}>i</button>
                                <div className='realRatioName'>ROA: </div>
                            </div>
                            <div className='ratioBox'>{state.ROA}</div>
                            <div className='ratioBox'>{state.ROAGrade}</div>
                        </div>
                        <div className='scoreContainer'>
                            <div className='ratioName'>
                                <button className='infobutton' onClick={infoButtonROE}>i</button>
                                <div className='realRatioName'>ROE: </div>
                            </div>
                            <div className='ratioBox'>{state.ROE}</div>
                            <div className='ratioBox'>{state.ROEGrade}</div>
                        </div>
                        <div className='scoreContainer'>
                            <div className='ratioName'>
                                <button className='infobutton' onClick={infoButtonNPM}>i</button>
                                <div className='realRatioName'>NPM: </div>
                            </div>
                            <div className='ratioBox'>{state.NPM}</div>
                            <div className='ratioBox'>{state.NPMGrade}</div>
                        </div>
                        <div className='scoreContainer'>
                            <div className='ratioName'>
                                <button className='infobutton' onClick={infoButtonEPS}>i</button>
                                <div className='realRatioName'>EPS: </div>
                            </div>
                            <div className='ratioBox'>{state.EPS}</div>
                            <div className='ratioBox'>{state.EPSGrade}</div>
                        </div>
                        <div className='scoreContainer'>
                            <div className='ratioName'>
                                <button className='infobutton' onClick={infoButtonPER}>i</button>
                                <div className='realRatioName'>PER: </div>
                            </div>
                            <div className='ratioBox'>{state.PER}</div>
                            <div className='ratioBox'>{state.PERGrade}</div>
                        </div>
                        <button className='smallbutton' onClick={minimizeInfo}>minimize</button>
                        <div className='explanationText'>
                            {infoState.info}
                        </div>
                        <div className='highlight'>
                            <div className='scoreContainerOverallScore'>
                                <div className='overallScore'>Ratio Score: </div>
                                <div className='ratioBox'>{state.overallScore}</div>
                                <div className='ratioBox'>{state.overallScoreGrade}</div>
                            </div>
                        </div>
                    </div>
                    <div className='riskContainer'>
                        <h3 className='riskHeader'>Your Timeline</h3>
                        <h4 className='statHeader'>Investment Horizon</h4>
                        <h4 className='statHeader'>Confidence Interval</h4>
                        <input type='text' ref={confInt} className='userInput' placeholder='Confidence Interval'></input>
                    </div>
                    <div className='riskContainer'>
                        <h3 className='riskHeader'>Other Stats</h3>
                        <h4 className='statHeader'>Diversification</h4>
                        
                        <input type='text' ref={largeCS} className='userInput' placeholder='Large-Cap Stocks'></input>
                        <input type='text' ref={midCS} className='userInput' placeholder='Mid-Cap Stocks'></input>
                        <input type='text' ref={smallCS} className='userInput' placeholder='Small-Cap Stocks'></input>
                        <input type='text' ref={microCS} className='userInput' placeholder='Micro-Cap Stocks'></input>
                        <button type='text' className='bigbutton'onClick={handleDiversification}>Check Diversification</button>
                        <div style={{display: 'flex'}}>
                            <div style={pieChart}></div>
                            <div style={{display: 'fixed'}}>
                                <div>Key:</div>
                                <div style={{display: 'flex'}}>
                                    <div className='keyColors' style={{backgroundColor: 'orange'}}></div>
                                    <div className='explanationText'>Large Cap Investments</div>
                                </div>
                                <div style={{display: 'flex'}}>
                                    <div className='keyColors' style={{backgroundColor: 'blue'}}></div>
                                    <div className='explanationText'>Mid Cap Investments</div>
                                </div>
                                <div style={{display: 'flex'}}>
                                    <div className='keyColors' style={{backgroundColor: 'green'}}></div>
                                    <div className='explanationText'>Small Cap Investments</div>
                                </div>
                                <div style={{display: 'flex'}}>
                                    <div className='keyColors' style={{backgroundColor: 'purple'}}></div>
                                    <div className='explanationText'>Micro Cap Investments</div>
                                </div>
                            </div>
                        </div>
                        <div className='highlight'>
                            <div className='scoreContainerOverallScore'>
                                <div className='overallScore'>Diversity Score: </div>
                                <div className='ratioBox'>{diversificationScore.score}</div>
                                <div className='ratioBox'>{diversificationScore.grade}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export { Analysis };
