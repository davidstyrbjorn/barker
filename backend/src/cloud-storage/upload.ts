import { Storage } from '@google-cloud/storage';
import { DownloadGCPReturnObject } from '../types/types';

// Creates a client
const storage = new Storage({
	keyFilename: 'barker-347020-278cb9b81a99.json',
	projectId: 'barker-347020'
});

// Upload to bucket
const uploadFile = async (destFileName:string, filePath: string): Promise<DownloadGCPReturnObject> => {
	const bucketName =  'barker-sounds-bucket';
	
	const result: DownloadGCPReturnObject = {};

	try {
		await storage.bucket(bucketName).upload(filePath, {
			destination: destFileName,
		});
		result.url = destFileName;
		//console.log(`${filePath} uploaded to ${bucketName}`);
	} catch (error) {
		result.error = `file with name ${destFileName} could not be uploaded`
	}

	return result;
}
export default uploadFile;	