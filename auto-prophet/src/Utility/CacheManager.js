

export class CacheManager {
    extractSync(cacheFilePath) {    
        try {
            if(window.fsApi && window.fsApi.readFileSync) {
                const filePath = `Cache/${cacheFilePath}`;
                const contents = window.fsApi.readFileSync(filePath);
                return contents;
            } else {
                throw Error("The file system is not available for caching");
            }
        } catch (error) {
            console.error('Error retreiving cached data:', error);
            return null;
        }
    }

    cacheSync(cachePath, data) {
        try {
            if(window.fsApi && window.fsApi.writeFileSync) {
                const filePath = `Cache/${cachePath}`;
                return window.fsApi.writeFileSync(filePath, data);
            } else {
                throw Error("The file system is not available for caching");
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