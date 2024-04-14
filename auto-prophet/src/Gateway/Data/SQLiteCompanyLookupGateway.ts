import { StockRequest } from "../../Entity/StockRequest";
import {IEntity} from "../../Entity/IEntity";
import {ISqlDataGateway} from "../Data/ISqlDataGateway";

// allow the yahoo.finance contextBridge to be used in TypeScript
declare global {
    interface Window { electron: any }
}

export class SQLiteCompanyLookupGateway implements ISqlDataGateway {
    databasePath = "./src/Asset/DB/AutoProphet.db";
    connection: any = null;

    async connect(): Promise<void> {
        throw new Error("Due to the nature of this gateway's dependencies, connections are not handled through this method");
    }

    disconnect(): void {
        throw new Error("Due to the nature of this gateway's dependencies, connections and disconnections are not handled through this method");
    }

    // used to create and periodically refresh the cache
    async create(entity: IEntity, action: string): Promise<Boolean> {
        try {
            const query = "INSERT INTO PublicCompany (ticker, cik) VALUES (?, ?)";
            const args  = [entity.getFieldValue("ticker"), entity.getFieldValue("cik")];
            const result = await window.electron.ipcRenderer.invoke('sqlite-insert', { database: this.databasePath, query: query, parameters: args });
            return true;
        } catch(error) {
            return false;
            window.console.error(error);
        }
    }
    
    async read(entity: IEntity, action: string): Promise<IEntity[]> {
        try {
            const keyword = entity.getFieldValue("keyword");
            const companyName = entity.getFieldValue("companyName");
            const ticker = entity.getFieldValue("ticker");
            const cik = entity.getFieldValue("cik");

            if(keyword === null && companyName === null && ticker === null && cik === null) {
                return [];
            }
            
            var query:string = "SELECT *";

            // an array to contain the parameters for the parameterized query
            const parameterArray:any[] = [];

            // create a preference for ticker matches over companyName matches
            if(keyword !== null) {
                query += ", CASE WHEN ticker LIKE ? || '%' THEN 1 WHEN companyName LIKE ? || '%' THEN 2 ELSE 3 END AS rank";
                parameterArray.push(keyword);
                parameterArray.push(keyword);
            }

            query += " FROM PublicCompany WHERE";

            var hasWhereCondition:boolean = false;

            if(keyword !== null) {
                // treat the keyword as a CIK if able to parseFloat()
                if(!isNaN(parseFloat(keyword))) {
                    query = this.appendWhere(query, " cik=?", hasWhereCondition);
                    parameterArray.push(keyword);
                    hasWhereCondition = true;
                } else {
                    query = this.appendWhere(query, " ticker LIKE ? || '%' OR companyName LIKE ? || '%'", hasWhereCondition);
                    
                    // Push twice to check in ticker and companyName
                    // TODO: create a text index with ticker and companyName data
                    parameterArray.push(keyword);
                    parameterArray.push(keyword);
                }
            }

            if(companyName !== null) {
                query = this.appendWhere(query, " companyName LIKE '%' || ? || '%'", hasWhereCondition);
                parameterArray.push(companyName);
            }

            if(ticker !== null) {
                query = this.appendWhere(query, " ticker LIKE '%' || ? || '%'", hasWhereCondition);
                parameterArray.push(ticker);
            }

            if(cik !== null) {
                query = this.appendWhere(query, " cik LIKE '%' || ? || '%'", hasWhereCondition);
                parameterArray.push(cik);
            }

            if(keyword !== null) {
                query += " ORDER BY rank ASC, ticker ASC LIMIT 10";
            } else {
                query += " ORDER BY ticker ASC LIMIT 10";
            }
            
            const data = await window.electron.ipcRenderer.invoke('sqlite-query', { database: this.databasePath, query: query, parameters: parameterArray });
            var entities;
            if (action === "lookup") {
                entities = this.formatLookupResponse(data);
            }

            return entities;
        } catch(error) {
            window.console.error(error);
        }
    }

    private formatLookupResponse(data:any) {
        var array: Array<IEntity> = [];

        for (const match of data) {           
            var entity = new StockRequest();
            
            entity.setFieldValue("ticker", match.ticker.toUpperCase());
            entity.setFieldValue("companyName", match.companyName);
            entity.setFieldValue("cik", match.cik);
            
            array.push(entity);
        }

        return array
    }

    private appendWhere(query:string, condition:string, hasWhereCondition:boolean) {
        if(!hasWhereCondition) {
            query += condition;
        } else {
            // currently using OR to match any of the conditions
            query += " OR" + condition;
        }

        return query;
    }

    update(entity: IEntity, action: string): Promise<number> {
        throw new Error("This gateway does not have the ability to update content. Updates are handled by periodically deleting and re-entering data");
    }

    // purge the database of entries for a periodic refresh of the data
    async delete(entity: IEntity, action: string): Promise<number> {
        try {
            const query = "DELETE FROM PublicCompany;";
            const args:any[]  = [];
            const result = await window.electron.ipcRenderer.invoke('sqlite-delete', { query: query, parameters: args });
            
            const query2 = "UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='PublicCompany'";
            await window.electron.ipcRenderer.invoke('sqlite-update', { query: query2, parameters: args });
            
            return result;
        } catch(error) {
            window.console.error(error);
            return 0;
        }
    }

    //check to see if the database table exists
    async checkTableExists() {
        const query = "SELECT name FROM sqlite_master WHERE type='table' AND name='PublicCompany';"
        const args:any[]  = [];
        const rows = await window.electron.ipcRenderer.invoke('sqlite-query', { query: query, parameters: args });
        
        if(rows !== null && rows[0].name) {
            return true;
        }

        return false;
    }

    //for database tables that act as cache, check for the last time a table was updated
    async checkLastTableUpdate() {
        const query = "SELECT changedAt FROM modifications WHERE tableName='PublicCompany' ORDER BY changedAt DESC LIMIT 1"
        const args:any[]  = [];
        const data = await window.electron.ipcRenderer.invoke('sqlite-get', { query: query, parameters: args });
        
        if(data && data.changedAt) {
            return new Date(data.changedAt);
        } else {
            return undefined;
        }
    }

    async refreshTableCache(entity: IEntity) {
        await this.delete(entity, "");

        const response = await fetch('https://www.sec.gov/files/company_tickers.json');
        const secData = await response.json();

        // Parse the SEC text file to extract ticker:CIK pairs
        //const lines = secTextData.split('\n');

        for(var key in secData) {
            var ticker = secData[key]["ticker"];
            var cik = secData[key]["cik_str"];
            var companyName = secData[key]["title"].toUpperCase();

            if(cik.toString().length < 10) {
                const diff = 10 - cik.toString().length;
                var newCik = "";

                for(var i=0; i < diff; i++) {
                    newCik += "0";
                }

                cik = newCik + cik;
            }
            
            const query = "INSERT INTO PublicCompany (companyName, ticker, cik) VALUES(?,?,?)";
            const args  = [companyName, ticker, cik];
            await window.electron.ipcRenderer.invoke('sqlite-insert', { query: query, parameters: args });
        } 
    }
}