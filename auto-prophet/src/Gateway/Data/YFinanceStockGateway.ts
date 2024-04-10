import {IEntity} from "../../Entity/IEntity";
import { StockRequest } from "../../Entity/StockRequest";
import { IKeylessDataGateway } from "./IKeylessDataGateway";
import { FinancialModelingPrepGateway } from "./FMPStockGateway";
//import yahooFinance from 'yahoo-finance2';

// allow the yahoo.finance contextBridge to be used in TypeScript
declare global {
    interface Window { yahoo: any; }
}

export class YFinanceStockGateway implements IKeylessDataGateway {
  yahooFinance = window.yahoo.finance;
     
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

  async read(entity: IEntity, action: string): Promise<IEntity[]> {
    var data;
    if (action === "lookup") {
        data = await this.searchSymbol(entity);
    } else if (action === "intraday") {
        data = await this.getIntradayData(entity);
    } else if (action === "interday") {
        data = await this.getInterdayData(entity);
    } else {
        throw new Error("Either no action was sent in the request or an incorrect action was used.");
    }
    window.console.log(data);
    var entities;
    if (action === "lookup") {
        entities = this.formatLookupResponse(data);
    } else {
        entities = this.formatDataResponse(data, entity, action);
    }

    return entities;
  }
    
  formatDataResponse(data: any, entity: IEntity, action: string): any {
    var array: Array<IEntity> = [];
    var closingPriceKey = "close";

    if(action === "interday") {
      closingPriceKey = "adjClose";
    } else if(action === "intraday") {
      data = data["quotes"];
    }

    const formattedData: Array<{ [key: string]: any }> = [];
    for (const item of data) {
      const date = new Date(item["date"]);
      formattedData.push({
        date: date.toLocaleDateString(),
        time: action === "intraday" ? date.toLocaleTimeString() : "", // Only include time for intraday data
        price: item[closingPriceKey],
        volume: item["volume"],
      });
    }

    entity.setFieldValue("data", formattedData);
    array.push(entity);

    return array;
  }

  formatLookupResponse(data: any): any {
    var array: Array<IEntity> = [];

    for (const item of data) {
      var entity = new StockRequest();
      entity.setFieldValue("ticker", item["symbol"]);
      entity.setFieldValue("companyName", item["shortname"]);
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
  
  private async searchSymbol(entity: IEntity) {
    const keyword = entity.getFieldValue("keyword");

    try {
        const searchOptions = {
            quotesCount: 10
        };
        const searchResult = await this.yahooFinance.search(keyword, searchOptions);
        window.console.log(searchResult);
        // the filter ensures only results with a symbol are mapped
        const symbols = searchResult.quotes.filter((result:any) => result.symbol).map((result:any) => ({
            ticker: result.symbol,
            companyName: result.shortName
        }));
        return symbols;
    } catch (error) {
        throw new Error("Error occurred while searching for symbols: " + error.message);
    }        
  }

  private async getIntradayData(ticker: any) {
    try {
      const queryOptions = {
        period1: new Date()
      };
      const data = await this.yahooFinance.chart(ticker, queryOptions);
      return data;
    } catch (error) {
      throw new Error("Error occurred while fetching intraday data: " + error.message);
    }
  }

  private async getInterdayData(entity: IEntity) {
    var period2;
    const currentDate = new Date();
    const previousDate = new Date();

    const fiveDaysAgo = new Date(previousDate.setDate(currentDate.getDate() - 5)).toISOString().split('T')[0];
    const oneMonthAgo = new Date(previousDate.setDate(currentDate.getDate() - 30)).toISOString().split('T')[0];
    const sixMonthsAgo = new Date(previousDate.setDate(currentDate.getDate() - 180)).toISOString().split('T')[0];
    const oneYearAgo = new Date(previousDate.setDate(currentDate.getDate() - 365)).toISOString().split('T')[0];
    const fiveYearsAgo = new Date(previousDate.setDate(currentDate.getDate() - 2190)).toISOString().split('T')[0];

    const period2Map: { [key: string]: any } = { 
        "5D": fiveDaysAgo,
        "1M": oneMonthAgo,
        "6M": sixMonthsAgo,
        "1Y": oneYearAgo,
        "5Y": fiveYearsAgo,
        "Max": null
    };

    period2 = period2Map[entity.getFieldValue("interval")];

    try {
        const data = await this.yahooFinance.historical(entity.getFieldValue("ticker"), {
            period1: new Date().toISOString().split('T')[0],
            period2: period2
        });
        return data;
    } catch (error) {
        throw new Error("Error occurred while fetching interday data: " + error.message);
    }
  }
}