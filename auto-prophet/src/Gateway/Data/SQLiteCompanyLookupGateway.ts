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
            const result = await window.electron.ipcRenderer.invoke('sqlite-insert', { query, args });
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

            var query:string = "SELECT * FROM PublicCompany WHERE"
            const parameterArray:any[] = [];

            var hasWhereCondition:boolean = false;

            if(keyword !== null) {
                // treat the keyword as a CIK if able to parseFloat()
                if(!isNaN(parseFloat(keyword))) {
                    query = this.appendWhere(query, " cik=?", hasWhereCondition);
                    parameterArray.push(keyword);
                    hasWhereCondition = true;
                } else {
                    query = this.appendWhere(query, " ticker LIKE '%' || ? || '%' OR companyName LIKE '%' || ? || '%'", hasWhereCondition);
                    
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
            
            const rows = await window.electron.ipcRenderer.invoke('sqlite-query', { query, parameterArray });

            const entities:IEntity[] = [];

            rows.forEach((row:any) => {
                window.console.log(row);
                entities.push(row);
            });

        } catch(error) {
            window.console.error(error);
        }
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
            const result = await window.electron.ipcRenderer.invoke('sqlite-delete', { query, args });
            
            const query2 = "UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='PublicCompany'";
            await window.electron.ipcRenderer.invoke('sqlite-update', { query2, args });
            
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
        const rows = await window.electron.ipcRenderer.invoke('sqlite-query', { query, args });
        
        if(rows !== null && rows[0].name) {
            return true;
        }

        return false;
    }

    //for database tables that act as cache, check for the last time a table was updated
    async checkLastTableUpdate() {
        const query = "SELECT changedAt FROM modifications WHERE tableName='PublicCompany' ORDER BY changedAt DESC LIMIT 1"
        const args:any[]  = [];
        const rows = await window.electron.ipcRenderer.invoke('sqlite-query', { query, args });
        window.console.log(rows[0].changedAt);
        
        var date = undefined;

        if(rows !== null && rows[0].changedAt) {
            date = new Date(rows[0].changedAt);
        } 
        
        return date;
    }

    async refreshTableCache(entity: IEntity) {
        await this.delete(entity, "");

        const response = await fetch('https://www.sec.gov/include/ticker.txt');
        const secTextData = await response.text();

        // Parse the SEC text file to extract ticker:CIK pairs
        const lines = secTextData.split('\n');
        const parsedData = lines.map(async (line) => {
            var [ticker, cik] = line.split('\t');
            
            // Add leading 0's to CIK
            if(cik.toString().length < 10) {
                const diff = 10 - cik.toString().length;
                var newCik = "";

                for(var i=0; i < diff; i++) {
                    newCik += "0";
                }

                cik = newCik + cik;
            }

            const query = "INSERT INTO PublicCompany (ticker, cik) VALUES(?,?)";
            const args  = [ticker, cik];
            const result = await window.electron.ipcRenderer.invoke('sqlite-insert', { query, args });
        });
    }
}