// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

class RatioCalculator {
    data:any = null;
    EPS:number = null;
    PER:number = null;
    WCR:string = null;
    QR:string = null;
    DER:string = null;
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
        this.EPS = this.data.EPS;
    }

    //PE Ratio
    private calculatePE() {
        this.PER = this.data.PERatio;
    }
    
    //WC Ratio
    private calculateWC() {
        this.WCR = (Math.round(this.data.totalCurrentAssets)/(this.data.totalCurrentLiabilities)).toFixed(2);
    }

    //Quick Ratio
    private calculateQR() {  
        this.QR = (Math.round((this.data.totalCurrentAssets)-(this.data.inventory))/(this.data.totalCurrentLiabilities)).toFixed(2);
    }
 
    //Debt-Equity Ratio
    private calculateDER() {
        this.DER = (Math.round(+this.data.shortTermDebt + +this.data.longTermDebt + +this.data.otherNonCurrentLiabilities)/(this.data.totalShareholderEquity)).toFixed(2);
    }
    
    //Gross Profit Margin
    private calculateGPM() {
        this.GPM = this.data.ProfitMargin;
    }
}

export default RatioCalculator;