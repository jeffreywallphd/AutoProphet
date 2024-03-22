

export class CacheManager {
    async extract(cacheFilePath) {    
        try {
            if(window.fsApi && window.fsApi.readFile) {
                const filePath = `Cache/${cacheFilePath}`;
                const contents = await window.fsApi.readFile(filePath);
                return contents;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error retreiving cached data:', error);
            return null;
        }
    }

    async extractSync(cacheFilePath) {    
        try {
            if(window.fsApi && window.fsApi.readFileSync) {
                const filePath = `Cache/${cacheFilePath}`;
                const contents = window.fsApi.readFileSync(filePath);
                return contents;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error retreiving cached data:', error);
            return null;
        }
    }

    async cache(cachePath, data) {
        try {
            if(window.fsApi && window.fsApi.writeFile) {
                const filePath = `Cache/${cachePath}`;
                await window.fsApi.writeFile(filePath, data);
                return true;
            } else {
                return false;
            }
        } catch (error) { 
            console.error('Error caching data:', error);
            return false;
        }
    }

    cacheSync(cachePath, data) {
        try {
            if(window.fsApi && window.fsApi.writeFileSync) {
                const filePath = `Cache/${cachePath}`;
                window.fsApi.writeFileSync(filePath, data);
                return true;
            } else {
                return false;
            }
        } catch (error) { 
            console.error('Error caching data:', error);
            return false;
        }
    }

    makeDirectorySync(cachePath, folder) {
        try {
            if(window.fsApi && window.fsApi.makeDirectorySync) {
                const folderPath = `Cache/${cachePath}/${folder}`;
                window.fsApi.makeDirectorySync(folderPath);
            } else {
                throw Error("The filesystem is not yet ready");
            }
        } catch (error) { 
            console.error('Error caching data:', error);
        }
    }
}