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
        this.EPS = this.data["facts"]["us-gaap"]["EarningsPerShareDiluted"]["units"]["USD/shares"][0]["val"];
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
        var currentAssets = this.data["facts"]["us-gaap"]["EquityMethodInvestmentSummarizedFinancialInformationCurrentAssets"]["units"]["USD"][0]["val"];
        var currentLiabilities = this.data["facts"]["us-gaap"]["EquityMethodInvestmentSummarizedFinancialInformationCurrentLiabilities"]["units"]["USD"][0]["val"];
        var workingCapitalRatio = currentAssets / currentLiabilities;
        this.WCR = workingCapitalRatio;
    }

    //Quick Ratio
    private calculateQR() {
        var currentAssets = this.data["facts"]["us-gaap"]["EquityMethodInvestmentSummarizedFinancialInformationCurrentAssets"]["units"]["USD"][0]["val"];
        var currentLiabilities = this.data["facts"]["us-gaap"]["EquityMethodInvestmentSummarizedFinancialInformationCurrentLiabilities"]["units"]["USD"][0]["val"];
        var inventory = this.data["facts"]["us-gaap"]["InventoryFinishedGoods"]["units"]["USD"][0]["val"];
        var quickRatio = (currentAssets - inventory) / currentLiabilities;
        this.QR = quickRatio;
    }
 
    //Debt-Equity Ratio
    private calculateDER() {
        var debtAndLease = this.data["facts"]["us-gaap"]["DebtAndCapitalLeaseObligations"]["units"]["USD"][0]["val"];
        var otherFixedPayments = 0;
        var shareholdersEquity = this.data["facts"]["us-gaap"]["NetIncomeLossAvailableToCommonStockholdersBasic"]["units"]["USD"][0]["val"];
        var debtEquityRatio = (debtAndLease + otherFixedPayments) / shareholdersEquity;
        this.DER = debtEquityRatio;
    }
    
    //Gross Profit Margin
    private calculateGPM() {
        var cOGS = this.data["facts"]["us-gaap"]["CostOfGoodsAndServicesSold"]["units"]["USD"][0]["val"];
        var revenue = this.data["facts"]["us-gaap"]["Revenues"]["units"]["USD"][0]["val"]
        var grossProfitMargin = (revenue - cOGS) / revenue;
        this.GPM = grossProfitMargin;
    }
}

export default RatioCalculator;