import {StockRequest} from "../../Entity/StockRequest";
import {IEntity} from "../../Entity/IEntity";
import {IDataGateway} from "../Data/IDataGateway";

export class AlphaVantageRatioGateway implements IDataGateway {
    baseURL: string = "https://www.alphavantage.co/query";
    key: string;

    constructor(key: string) {
        this.key = key;
    }

    connect(): void {
        //no connection needed for this data gateway
        throw new Error("This gateway requries no special connection");
    }

    disconnect(): void {
        //no disconnection needed for this data gateway
        throw new Error("This gateway requries no special connection, so no disconnection is necessary");
    }

    create(entity: IEntity, action: string): Promise<Boolean> {
        throw new Error("This gateway does not have the ability to post content");
    }

    async read(entity: IEntity, action: string): Promise<Array<IEntity>> { 
        var url;
        if (action === "lookup") {
            url = this.getSymbolLookupUrl(entity);    
        } else if (action === "income") {
            url = this.getIncomeUrl(entity);
        } else if (action === "overview"){
            url = this.getOverviewUrl(entity);
        } else if (action === "balance") {
            url = this.getBalanceUrl(entity);
        } else {
            throw Error("Either no action was sent in the request or an incorrect action was used.");
        }     

        const response = await fetch(url);
        const data = await response.json();

        if("Information" in data) {
            throw Error("The API key used for Alpha Vantage has reached its daily limit");
        }

        var entities;
        if (action === "lookup") {
            entities = this.formatLookupResponse(data);
        } else {
            entities = this.formatDataResponse(data, entity, action);
        }

        return entities;
    }

    private getSymbolLookupUrl(entity: IEntity) {
        return `${this.baseURL}?function=SYMBOL_SEARCH&keywords=${entity.getFieldValue("keyword")}&apikey=${entity.getFieldValue("key")}&datatype=json`;
    }

    private getOverviewUrl(entity: IEntity) {
        return `${this.baseURL}?function=OVERVIEW&symbol=${entity.getFieldValue("ticker")}&apikey=${entity.getFieldValue("key")}&datatype=json`;
    }

    private getIncomeUrl(entity: IEntity) {
        return `${this.baseURL}?function=INCOME_STATEMENT&symbol=${entity.getFieldValue("ticker")}&apikey=${entity.getFieldValue("key")}&datatype=json`;
    }

    private getBalanceUrl(entity: IEntity) {
        return `${this.baseURL}?function=BALANCE_SHEET&symbol=${entity.getFieldValue("ticker")}&apikey=${entity.getFieldValue("key")}&datatype=json`;
    }

    private formatDataResponse(data: { [key: string]: any }, entity:IEntity, action:string) {
        var array: Array<IEntity> = [];
        
        console.log(data);

        var timeSeries;
        if(action === "interday") { 
            timeSeries = data["Time Series (Daily)"];
        } else {
            timeSeries = data["Time Series (1min)"];    
        }
        
        const formattedData: Array<{ [key: string]: any }> = [];

        entity.setFieldValue("data", formattedData.reverse());

        array.push(entity);

        return array;
    }

    private createDataItem(date: Date, timeSeries: any) {
        const item = {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString(),
            price: timeSeries["4. close"],
            volume: timeSeries["5. volume"],
        };

        return item;
    }

    private formatLookupResponse(data: { [key: string]: any }) {
        var array: Array<IEntity> = [];
        
        const bestMatches = data["bestMatches"];

        for (const match of bestMatches) {           
            var entity = new StockRequest();
            
            entity.setFieldValue("ticker", match["1. symbol"]);
            entity.setFieldValue("companyName", match["2. name"]);
            
            array.push(entity);
        }

        return array
    }

    update(entity: IEntity, action: string): Promise<number> {
        throw new Error("This gateway does not have the ability to update content");
    }

    delete(entity: IEntity, action: string): Promise<number> {
        throw new Error("This gateway does not have the ability to delete content");
    }   
}