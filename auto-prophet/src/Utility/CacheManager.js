

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

    // TODO: Finish this logic in preload.js
    async makeDirectory(cachePath, folder) {
        try {
            if(window.fsApi && window.fsApi.directoryExists && window.fsApi.makeDirectory) {
                const folderPath = `Cache/${cachePath}/${folder}`;

                if(window.fsApi.directoryExists(folderPath)) {
                    return true;
                } else {
                    try {
                        await window.fsApi.makeDirectory(folderPath);
                        return true;
                    } catch(error) {
                        console.error("Failed to make the directory: ", error);
                        return false;
                    }
                }
            } else {
                return false;
            }
        } catch (error) { 
            console.error('Error caching data:', error);
            return false;
        }
    }
}