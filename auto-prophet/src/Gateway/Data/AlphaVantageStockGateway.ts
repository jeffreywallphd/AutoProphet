import {StockRequest} from "../../Entity/StockRequest";
import {IEntity} from "../../Entity/IEntity";
import {IDataGateway} from "../Data/IDataGateway";
import { time } from "console";

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
        const url = `${this.baseURL}?function=TIME_SERIES_INTRADAY&symbol=${entity.getFieldValue("ticker")}&interval=1min&apikey=${entity.getFieldValue("key")}&extended_hours=false&outputsize=full&datatype=json`;

        const response = await fetch(url);
        const data = await response.json();

        const entities = this.formatPriceVolumeResponse(data, entity);

        return entities;
    }

    private formatPriceVolumeResponse(data: { [key: string]: any }, entity:IEntity) {
        var array: Array<IEntity> = [];
        
        const timeSeries = data["Time Series (1min)"];
        const mostRecentDate = new Date(Object.keys(timeSeries)[0]);
        
        const formattedData: Array<{ [key: string]: any }> = [];

        for (var key in timeSeries) {
            var date = new Date(key);           

            if(mostRecentDate.getDate() === date.getDate()) {
                var item = {
                    date: date.toLocaleDateString(),
                    time: date.toLocaleTimeString(),
                    price: timeSeries[key]["4. close"],
                    volume: timeSeries[key]["5. volume"],
                };

                formattedData.push(item);
            }

            //stop the loop once the date is less than the most recent date
            if(date.getDate() < mostRecentDate.getDate()) {
                break;
            }
        }

        entity.setFieldValue("data", formattedData.reverse());

        array.push(entity);

        return array;
    }

    async search(entity: IEntity): Promise<Array<IEntity>> {
        const url = `${this.baseURL}?function=SYMBOL_SEARCH&keywords=${entity.getFieldValue("keyword")}&apikey=${entity.getFieldValue("key")}&datatype=json`;

        const response = await fetch(url);
        const data: { [key: string]: any } = await response.json();
        
        if("Information" in data) {
            throw Error("The API key used for Alpha Vantage has reached its daily limit");
        }

        const entities = this.formatLookupResponse(data);

        return entities;
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

    update(entity: IEntity): Promise<number> {
        throw new Error("Method not implemented.");
    }

    delete(entity: IEntity): Promise<number> {
        throw new Error("Method not implemented.");
    }    
}