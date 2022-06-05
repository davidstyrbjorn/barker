import { Bucket, File, GetSignedUrlConfig, GetSignedUrlResponse, Storage } from '@google-cloud/storage';
import { DownloadGCPReturnObject } from '../types/types';

// Creates a client
const storage = new Storage({
	keyFilename: 'barker-347020-278cb9b81a99.json',
	projectId: 'barker-347020'
});


const downloadFile = async (fileName:string): Promise<DownloadGCPReturnObject> => {
    const bucketName = 'barker-sounds-bucket';
    
    const result: DownloadGCPReturnObject = {};
    // Check if file exists on GCP
    const exists = await storage.bucket(bucketName).file(fileName).exists();
    // If not return Error
    if(!exists[0]){
        result.error = `The file ${fileName} does not exist`;
        return result;  
    }

    // These options will allow temporary read access to the file
     const options:GetSignedUrlConfig = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 2 * 60 * 60 * 1000, // 120 minutes
    };
    // Try to get signed url
    try {
        // Get a v4 signed URL for reading the file
        const [url]:GetSignedUrlResponse = await storage
            .bucket(bucketName)
            .file(fileName)
            .getSignedUrl(options);
        result.url = url as string;
    } catch (error) {
        result.error = `Request to getSignedUrl failed`;
    }
    return result;
}
export default downloadFile;