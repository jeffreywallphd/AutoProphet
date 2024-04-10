import {IEntity} from "../../Entity/IEntity";
import {ISqlDataGateway} from "../Data/ISqlDataGateway";

// allow the yahoo.finance contextBridge to be used in TypeScript
declare global {
    interface Window { database: any; }
}

export class SQLiteCompanyLookupGateway implements ISqlDataGateway {
    databasePath = "./src/Asset/DB/AutoProphet.db";
    connection: any = null;

    connect(): void {
        this.connection = new window.database.sqlite.Database('./src/Asset/DB/AutoProphet.db');
    }

    disconnect(): void {
        if(this.connection != null) {
            this.connection.close();
        }
    }

    // used to create and periodically refresh the cache
    async create(entity: IEntity, action: string): Promise<Boolean> {
        const statement = this.connection.prepare("INSERT INTO PublicCompany (ticker, cik) VALUES (?, ?)");
        return await statement.run([entity.getFieldValue("ticker"), entity.getFieldValue("cik")]);
    }
    
    async read(entity: IEntity, action: string): Promise<IEntity[]> {
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

        if(companyName != null) {
            query = this.appendWhere(query, " companyName LIKE '%' || ? || '%'", hasWhereCondition);
            parameterArray.push(companyName);
        }

        if(ticker != null) {
            query = this.appendWhere(query, " ticker LIKE '%' || ? || '%'", hasWhereCondition);
            parameterArray.push(ticker);
        }

        if(cik != null) {
            query = this.appendWhere(query, " cik LIKE '%' || ? || '%'", hasWhereCondition);
            parameterArray.push(cik);
        }

        const statement = this.connection.prepare(query);
        //const results = await statement.run(parameterArray);

        return new Promise((resolve, reject) => {
            try {
              const entities:IEntity[] = [];
              //execute the query
              statement.all(parameterArray, (err:any, rows:any) => {
                if (err) {
                  window.console.log(err);
                  reject(err);
                  return;
                }
        
                // Convert rows to array of objects
                rows.forEach((row:any) => {
                    window.console.log(row);
                    entities.push(row)
                });
                resolve(entities);
              });
            } catch (err) {
              console.log(err);
              reject(err);
            } 
          });
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
        await this.connection.run("DELETE FROM PublicCompany;");
        //reset indices for this table
        return await this.connection.run("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='PublicCompany';");
    }

    //check to see if the database table exists
    async checkTableExists() {
        const query = "SELECT name FROM sqlite_master WHERE type='table' AND name='PublicCompany';"
        const row = await this.connection.get(query);

        if(row !== null && row.name) {
            return true;
        }

        return false;
    }

    //for database tables that act as cache, check for the last time a table was updated
    async checkLastTableUpdate() {
        const query = "SELECT changedAt FROM modifications WHERE tableName='PublicCompany' ORDER BY changedAt DESC LIMIT 1";
        const row = await this.connection.get(query);
        window.console.log(row.changedAt);
        
        var date = undefined;

        if(row !== null && row.changedAt) {
            date = new Date(row.changedAt);
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

            var query = "INSERT INTO PublicCompany (ticker, cik) VALUES(?,?)";
            const statement = this.connection.prepare(query);
            await statement.run([ticker, cik]);
        });
    }
}