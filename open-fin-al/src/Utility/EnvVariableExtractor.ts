export class EnvVariableExtractor {
    
    async extractAll() {    
        var ENVContents;
    
        await fetch("../.env")
            .then((response) => response.text() )
            .then((contents) => ENVContents = contents);
        
        ENVContents = JSON.parse(ENVContents);
    
        return ENVContents;
}

    async extract(variable: string) {    
            var ENVContents;
        
            await fetch("../.env")
                .then((response) => response.text() )
                .then((contents) => ENVContents = contents);
            
            ENVContents = JSON.parse(ENVContents);
        
            return ENVContents[variable];
    }
}