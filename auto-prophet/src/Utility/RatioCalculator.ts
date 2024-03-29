// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

class RatioCalculator {
    data:any = null;
    EPS:number = null;
    PER:number = null;
    WCR:number = null;
    QR:number = null;
    DER:number = null;
    GPM:number = null;

    constructor(data:any) {
        this.data = data;
    }

    calculateRatios() {
        this.calculateEPS();
        this.calculatePE();
        this.calculateWC();
        this.calculateQR();
        this.calculateDER();
        this.calculateGPM();
    }

    //EPS Ratio
    private calculateEPS() {
        var netIncome = 1;
        var preferredDividends = 2;
        var weightedAvgSharesOutstanding = 3;
        var earningsPerShare = (netIncome - preferredDividends) / weightedAvgSharesOutstanding;
        this.EPS = earningsPerShare;
    }

    //PE Ratio
    private calculatePE() {
        if(this.EPS === null) {
            this.calculateEPS();
        }

        var sharePrice = this.data["facts"]["us-gaap"]["SharePrice"]["units"]["USD/shares"][0]["val"];
        var priceEarningRatio = sharePrice / this.EPS;
        this.PER = priceEarningRatio;
    }
    
    //WC Ratio
    private calculateWC() {
        var currentAssets = 1;
        var currentLiabilities = 2;
        var workingCapitalRatio = currentAssets / currentLiabilities;
        this.WCR = workingCapitalRatio;
    }

    //Quick Ratio
    private calculateQR() {
        var currentAssets = 1;
        var currentLiabilities = 2;
        var inventory = 1;
        var quickRatio = (currentAssets - inventory) / currentLiabilities;
        this.QR = quickRatio;
    }
 
    //Debt-Equity Ratio
    private calculateDER() {
        var shortTermDebt = 1;
        var longTermDebt = 2;
        var otherFixedPayments = 3;
        var shareholdersEquity = 4;
        var debtEquityRatio = (shortTermDebt + longTermDebt + otherFixedPayments) / shareholdersEquity;
        this.DER = debtEquityRatio;
    }
    
    //Gross Profit Margin
    private calculateGPM() {
        var cOGS = 1
        var revenue = 2
        var grossProfitMargin = (revenue - cOGS) / revenue;
        this.GPM = grossProfitMargin;
    }
}

export default RatioCalculator;