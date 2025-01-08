

export class CacheManager {
    extractSync(cacheFilePath) {    
        try {
            if(window.fs && window.fs.fs) {
                const filePath = `src/Cache/${cacheFilePath}`;
                const contents = window.fs.fs.readFileSync(filePath, 'utf-8');
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
            if(window.fs && window.fs.fs) {
                const filePath = `src/Cache/${cachePath}`;
                return window.fs.fs.writeFileSync(filePath, data);
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
            if(window.fs && window.fs.fs) {
                const folderPath = `src/Cache/${cachePath}/${folder}`;
                window.fs.fs.mkdirSync(folderPath);
            } else {
                throw Error("The filesystem is not yet ready");
            }
        } catch (error) { 
            console.error('Error caching data:', error);
        }
    }
}