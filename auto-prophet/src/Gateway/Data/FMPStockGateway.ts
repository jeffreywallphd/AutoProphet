import { StockRequest } from "../../Entity/StockRequest";
import { IEntity } from "../../Entity/IEntity";
import { IKeyedDataGateway } from "../Data/IKeyedDataGateway";

export class FinancialModelingPrepGateway implements IKeyedDataGateway {
  baseURL: string = "https://financialmodelingprep.com/api/v3/";
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
    key: string;

  connect(): void {
    // No connection needed for this data gateway
    throw new Error("This gateway requires no special connection");
  }

  disconnect(): void {
    // No disconnection needed for this data gateway
    throw new Error("This gateway requires no special connection, so no disconnection is necessary");
  }

  create(entity: IEntity, action: string): Promise<Boolean> {
    throw new Error("This gateway does not have the ability to post content");
  }

  async read(entity: IEntity, action: string): Promise<Array<IEntity>> {
    var url;
    if (action === "lookup") {
      url = this.getSymbolLookupUrl(entity);
    } else if (action === "intraday") {
      url = this.getIntradayUrl(entity);
    } else if (action === "interday") {
      url = this.getInterdayUrl(entity);
    } else {
      throw new Error("Either no action was sent in the request or an incorrect action was used.");
    }

    const response = await fetch(url);
    const data = await response.json();

    if ("error" in data) {
      throw new Error(data.error); // Handle potential API errors
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
    return `${this.baseURL}search?query=${entity.getFieldValue("keyword")}&apikey=${this.apiKey}`;
  }

  private getIntradayUrl(entity: IEntity) {
    return `${this.baseURL}historical-chart/1min/${entity.getFieldValue("ticker")}?apikey=${this.apiKey}`;
  }

  private getInterdayUrl(entity: IEntity) {
    const currentDate = new Date();
    const previousDate = new Date();
    const intervalMap: { [key: string]: any } = { 
        "5D": {from: previousDate.setDate(currentDate.getDate() - 5), to: currentDate},
        "1M": {from: previousDate.setDate(currentDate.getDate() - 30), to: currentDate},
        "6M": {from: previousDate.setDate(currentDate.getDate() - 180), to: currentDate},
        "1Y": {from: previousDate.setDate(currentDate.getDate() - 365), to: currentDate},
        "5Y": {from: previousDate.setDate(currentDate.getDate() - 2190), to: currentDate},
        "Max": {from: null, to: null}
    };

    const interval = intervalMap[entity.getFieldValue("interval")];

    if (!interval) {
        throw new Error("Invalid interval specified");
    }

    var fromToQuery = "";

    if(interval["from"] !== null && interval["to"] !== null) {
      fromToQuery = `from=${interval["from"]}&to=${interval["to"]}&`;
    }

    return `${this.baseURL}historical-price-full/${entity.getFieldValue("ticker")}?${fromToQuery}apikey=${this.apiKey}`;
  }

  private formatDataResponse(data: any[], entity: IEntity, action: string) {
    var array: Array<IEntity> = [];

    const formattedData: Array<{ [key: string]: any }> = [];
    for (const item of data) {
      const date = new Date(item["date"]);
      formattedData.push({
        date: date.toLocaleDateString(),
        time: action === "intraday" ? date.toLocaleTimeString() : "", // Only include time for intraday data
        price: item["close"],
        volume: item["volume"],
      });
    }

    entity.setFieldValue("data", formattedData.reverse());
    array.push(entity);

    return array;
  }

  private createDataItem(date: Date, timeSeries: any) {
    throw new Error("This method is not used with Financial Modeling Prep");
  }

  private formatLookupResponse(data: any) {
    var array: Array<IEntity> = [];

    for (const match of data) {
      var entity = new StockRequest();
      entity.setFieldValue("ticker", match["symbol"]);
      entity.setFieldValue("companyName", match["name"]);
      array.push(entity);
    }

    return array;
  }

  update(entity: IEntity, action: string): Promise<number> {
    throw new Error("This gateway does not have the ability to update content");
  }

  delete(entity: IEntity, action: string): Promise<number> {
    throw new Error("This gateway does not have the ability to delete content");
  }
}

