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
    return `<span class="math-inline">\{this\.baseURL\}search?query\=</span>{entity.getFieldValue("keyword")}&apikey=${this.apiKey}`;
  }

  private getIntradayUrl(entity: IEntity) {
    return `<span class="math-inline">\{this\.baseURL\}historical\-price\-full/</span>{entity.getFieldValue("ticker")}?interval=1min&apikey=${this.apiKey}`;
  }

  private getInterdayUrl(entity: IEntity) {
    const intervalMap: { [key: string]: string } = { 
        "5D": "5day",
        "1M": "1month",
        "6M": "6month",
        "1Y": "1year",
        "5Y": "5year",
    };
    const interval = intervalMap[entity.getFieldValue("interval")];

    if (!interval) {
        throw new Error("Invalid interval specified");
    }

    return `${this.baseURL}historical-price-full/${entity.getFieldValue("ticker")}?seriesType=${interval}&apikey=${this.apiKey}`;
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

