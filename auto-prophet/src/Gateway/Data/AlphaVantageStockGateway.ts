import {StockRequest} from "../../Entity/StockRequest";
import {IEntity} from "../../Entity/IEntity";
import {IDataGateway} from "../Data/IDataGateway";

export class AlphaVantageStockGateway implements IDataGateway {
    baseURL: string = "https://www.alphavantage.co/query";
    key: string;

    constructor(key: string) {
        this.key = key;
    }

    connect(): void {
        //no connection needed for this data gateway
    }

    disconnect(): void {
        //no disconnection needed for this data gateway
    }

    create(entity: IEntity): Promise<Boolean> {
        throw new Error("Method not implemented.");
    }

    async read(entity: IEntity): Promise<Array<IEntity>> { 
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${entity.getFieldValue("ticker")}&interval=1min&apikey=${entity.getFieldValue("key")}&extended_hours=false&outputsize=full&datatype=json`;

        const response = await fetch(url);
        const data = await response.json();

        alert(JSON.stringify(data));

        throw new Error("Method not implemented.");
    }

    async search(entity: IEntity): Promise<Array<IEntity>> {
        const url = `${this.baseURL}?function=SYMBOL_SEARCH&keywords=${entity.getFieldValue("keyword")}&apikey=${entity.getFieldValue("key")}&datatype=json`;

        const response = await fetch(url);
        const data: { [key: string]: any } = await response.json();
        
        if("Information" in data) {
            throw Error("The API key used for Alpha Vantage has reached its daily limit");
        }

        const entities = this.formatResponse(data);

        return entities;
    }

    private formatResponse(data: { [key: string]: any }) {
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

    update(entity: IEntity): Promise<number> {
        throw new Error("Method not implemented.");
    }

    delete(entity: IEntity): Promise<number> {
        throw new Error("Method not implemented.");
    }    
}