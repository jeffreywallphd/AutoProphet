import {IEntity} from "../../Entity/IEntity";
import {IKeyedDataGateway} from "./IKeyedDataGateway";

export class AlphaVantageNewsGateway implements IKeyedDataGateway {
    baseURL: string = "https://www.alphavantage.co/query";
    key: string;
    sourceName: string = "AlphaVantage News API";

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
        //This API has no post capabilities
        throw new Error("This gateway does not have the ability to post content");
    }

    async read(entity: IEntity, action: string): Promise<Array<IEntity>> { 
        var url = `${this.baseURL}?function=NEWS_SENTIMENT&tickers=${entity.getFieldValue("ticker")}&apikey=${entity.getFieldValue("key")}`;
        
        if(entity.getFieldValue("keyword") !== null) {
            url = url + "&topics=" + entity.getFieldValue("keyword");
        }

        if(entity.getFieldValue("startDate") !== null) {
            url = url + "&time_from=" + entity.getFieldValue("startDate");
        }

        if(entity.getFieldValue("endDate") !== null) {
            url = url + "&time_to=" + entity.getFieldValue("endDate");
        }

        if(entity.getFieldValue("limit") !== null) {
            url = url + "&limit=" + entity.getFieldValue("limit");
        }

        if(entity.getFieldValue("sort") !== null) {
            url = url + "&sort=" + entity.getFieldValue("sort");
        }

        const response = await fetch(url);
        const data = await response.json();

        if("Information" in data) {
            throw Error("The API key used for Alpha Vantage has reached its daily limit");
        }

        var entities = this.formatDataResponse(data, entity, action);

        return entities;
    }

    private formatDataResponse(data: { [key: string]: any }, entity:IEntity, action:string) {
        var array: Array<IEntity> = [];
        
        var newsFeed = data["feed"];
                
        const formattedData: Array<{ [key: string]: any }> = [];

        for (var key in newsFeed) {           
            var item = this.createDataItem(newsFeed[key]);
            formattedData.push(item);
        }

        entity.setFieldValue("data", formattedData.reverse());

        array.push(entity);

        return array;
    }

    private createDataItem(newsFeed: any) {
        const item = {
            date: newsFeed["time_published"].split("T")[0],
            time: newsFeed["time_published"].split("T")[1],
            title: newsFeed["title"],
            url: newsFeed["url"],
            authors: newsFeed["authors"].join(", "),
            summary: newsFeed["summary"],
            thumbnail: newsFeed["banner_image"],
            source: newsFeed["source"]
        };

        return item;
    }

    update(entity: IEntity, action: string): Promise<number> {
        throw new Error("This gateway does not have the ability to update content");
    }

    delete(entity: IEntity, action: string): Promise<number> {
        throw new Error("This gateway does not have the ability to delete content");
    }    
}