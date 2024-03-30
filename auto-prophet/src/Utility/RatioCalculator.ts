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

        // We may need to get share price from price/volume data. The SEC reports don't consistently have this value across companies.
        //var sharePrice = this.data["facts"]["us-gaap"]["SharePrice"]["units"]["USD/shares"][0]["val"];
        var sharePrice = 13.49;
        var priceEarningRatio = sharePrice / this.EPS;
        this.PER = priceEarningRatio;
    }
    
    //WC Ratio
    private calculateWC() {
        var currentAssets = this.data["facts"]["us-gaap"]["AssetsCurrent"]["units"]["USD"][0]["val"];
        var currentLiabilities = this.data["facts"]["us-gaap"]["LiabilitiesCurrent"]["units"]["USD"][0]["val"];
        var workingCapitalRatio = currentAssets / currentLiabilities;
        this.WCR = workingCapitalRatio;
    }

    //Quick Ratio
    private calculateQR() {
        var quickAssets;

        // Additive method
        //if(this.data["facts"]["us-gaap"].hasOwnProperty("CashCashEquivalentsAndShortTermInvestments") && this.data["facts"]["us-gaap"].hasOwnProperty("AccountsReceivableNetCurrent")) {
        
        // AAPL didn't have this even though F and GOOG did. We may need to explore other possibilities
        //const cashAndEquivalents = this.data["facts"]["us-gaap"]["CashCashEquivalentsAndShortTermInvestments"]["units"]["USD"][0]["val"];
        const cashAndEquivalents = 0;
        
        // B didn't have this even though AAPL F and GOOG did. We may need to explore other possibilities
        //const accountsReceivable = this.data["facts"]["us-gaap"]["AccountsReceivableNetCurrent"]["units"]["USD"][0]["val"];
        const accountsReceivable = 0;
        //}
        quickAssets = cashAndEquivalents + accountsReceivable;

        // Subtractive method
        var currentAssets = this.data["facts"]["us-gaap"]["AssetsCurrent"]["units"]["USD"][0]["val"];
        var currentLiabilities = this.data["facts"]["us-gaap"]["LiabilitiesCurrent"]["units"]["USD"][0]["val"];
        
        // GOOG didn't have InvetoryFinishedGoods. May not be useful across companies.
        //var inventory = this.data["facts"]["us-gaap"]["InventoryFinishedGoods"]["units"]["USD"][0]["val"];
        //quickAssets = currentAssets - inventory;

        var quickRatio = quickAssets / currentLiabilities;
        this.QR = quickRatio;
    }
 
    //Debt-Equity Ratio
    private calculateDER() {
        // GOOG didn't have this key. We may need to explore other possibilities 
        //var debtAndLease = this.data["facts"]["us-gaap"]["DebtAndCapitalLeaseObligations"]["units"]["USD"][0]["val"];
        var debtAndLease = 0;
        var otherFixedPayments = 0;
        //var shareholdersEquity = this.data["facts"]["us-gaap"]["NetIncomeLossAvailableToCommonStockholdersBasic"]["units"]["USD"][-1]["val"];
        var shareholdersEquity = this.data["facts"]["us-gaap"]["StockholdersEquity"]["units"]["USD"][0]["val"]
        var debtEquityRatio = (debtAndLease + otherFixedPayments) / shareholdersEquity;
        this.DER = debtEquityRatio;
    }
    
    //Gross Profit Margin
    private calculateGPM() {
        // GOOG didn't have cOGS. We may need to explore other possibilities
        //var cOGS = this.data["facts"]["us-gaap"]["CostOfGoodsAndServicesSold"]["units"]["USD"][0]["val"];
        var cOGS = 0;
        // B didn't have revenues even though F GOOG AAPL did. We may need to find other possibilities.
        //var revenue = this.data["facts"]["us-gaap"]["Revenues"]["units"]["USD"][0]["val"]
        var revenue = 0;
        var grossProfitMargin = (revenue - cOGS) / revenue;
        this.GPM = grossProfitMargin;
    }
}

export default RatioCalculator;